import { EthersService, RedisService } from "../../services";
import { currentSeasonKey } from "../../utils/constants";
import {
    parseStringifiedValues,
    stringifyObjectValues,
    WSError,
} from "../../utils/functions";
import { MappedSeason } from "../../utils/types/mappers.types";
import {
    addPlayer2ToGame,
    createDBGame,
    fetchPlayersDetailsForPlayedGame,
    setWinnerToGame,
} from "../played-games/played-games.service";
import {
    addMoneyToSeasonPool,
    fetchCurrentSeason,
} from "../seasons/seasons.service";
import { ConnectFour } from "common";
import { type Namespace, type Socket } from "socket.io";

export const ConnectFourRoutes = async (socket: Socket, io: Namespace) => {
    socket.on(
        "join" satisfies ConnectFour.JoinEvent["type"],
        async ({
            game_id,
            tier_id,
            player_id,
            chain_id,
        }: ConnectFour.JoinEvent["payload"]) => {
            try {
                const RedisClient = RedisService.getRedisClient();

                let season = parseStringifiedValues<MappedSeason>(
                    await RedisClient.hgetall(currentSeasonKey),
                );

                if (!season.season_id) {
                    const data = await fetchCurrentSeason();
                    if (data) {
                        season = data;
                        await RedisClient.hset(
                            currentSeasonKey,
                            stringifyObjectValues<MappedSeason>(season),
                        );
                    }
                }

                if (!season.season_id) {
                    throw Error(
                        "Internal server error. No Current Season found.",
                    );
                }

                const { season_id } = season;

                const roomKey: string = `${season_id}::${game_id}::${tier_id}::${chain_id}`;
                const logId: string = `[${season_id}][${game_id}][${tier_id}][${player_id}]`;

                let room_id: string | null =
                    (await RedisClient.lpop(roomKey)) || null;

                if (!room_id) {
                    console.info(
                        logId,
                        `no room found for room key ${roomKey}`,
                    );

                    const { played_game_id } = await createDBGame(
                        player_id,
                        season_id,
                        game_id,
                        tier_id,
                        chain_id,
                    );

                    room_id = played_game_id;

                    await RedisClient.rpush(roomKey, room_id);
                    console.info(
                        logId,
                        `pushed room id ${room_id} in room key ${roomKey}`,
                    );

                    await RedisClient.hset(
                        room_id,
                        stringifyObjectValues<
                            Omit<ConnectFour.ServerGameState, "player2">
                        >({
                            winner_id: null,
                            active_player: player_id,
                            player1: {
                                player_id,
                                currentMove: null,
                                staked: false,
                            },
                            board: ConnectFour.emptyBoard,
                        }),
                    );

                    console.info(
                        logId,
                        `saved game state in hashmap ${room_id}`,
                    );
                } else {
                    console.info(logId, `room found for room key ${roomKey}`);

                    // TODO: fix self joining room

                    await addPlayer2ToGame(room_id, player_id);

                    await RedisClient.hset(
                        room_id,
                        stringifyObjectValues<
                            Pick<ConnectFour.ServerGameState, "player2">
                        >({
                            player2: {
                                player_id,
                                currentMove: null,
                                staked: false,
                            },
                        }),
                    );

                    console.info(
                        logId,
                        `updated game state in hashmap ${room_id}`,
                    );
                }

                socket.join(room_id);
                console.info(logId, `user joined ${room_id}`);

                const playerJoinedEvent: ConnectFour.PlayerJoinedEvent = {
                    type: "player-joined",
                    payload: {
                        room_id: room_id,
                        player_id,
                    },
                };
                io.to(room_id).emit(
                    playerJoinedEvent.type,
                    playerJoinedEvent.payload,
                );

                const gameState =
                    parseStringifiedValues<ConnectFour.ServerGameState>(
                        await RedisClient.hgetall(room_id),
                    );

                if (gameState.player1 && gameState.player2) {
                    const { player_1, player_2 } =
                        await fetchPlayersDetailsForPlayedGame(room_id);

                    await EthersService.createContractGame(
                        room_id,
                        player_1.wallet_address,
                        player_2.wallet_address,
                        tier_id,
                        chain_id,
                    );

                    const stakingEvent: ConnectFour.StakingEvent = {
                        type: "staking",
                        payload: gameState,
                    };
                    io.to(room_id).emit(
                        stakingEvent.type,
                        stakingEvent.payload,
                    );
                }
            } catch (error) {
                WSError(socket, error);
            }
        },
    );

    socket.on(
        "staked" satisfies ConnectFour.StakedEvent["type"],
        async ({
            room_id,
            player_id,
            tier_id,
        }: ConnectFour.StakedEvent["payload"]) => {
            try {
                const RedisClient = RedisService.getRedisClient();

                const season = parseStringifiedValues<MappedSeason>(
                    await RedisClient.hgetall(currentSeasonKey),
                );

                if (!season.season_id) {
                    throw Error(
                        "Internal server error. No Current Season found.",
                    );
                }

                const { season_id } = season;

                const gameState =
                    parseStringifiedValues<ConnectFour.ServerGameState>(
                        await RedisClient.hgetall(room_id),
                    );

                if (gameState.player1.player_id === player_id) {
                    gameState.player1.staked = true;
                    await RedisClient.hset(
                        room_id,
                        stringifyObjectValues<
                            Pick<ConnectFour.ServerGameState, "player1">
                        >({ player1: gameState.player1 }),
                    );
                } else if (gameState.player2.player_id === player_id) {
                    gameState.player2.staked = true;
                    await RedisClient.hset(
                        room_id,
                        stringifyObjectValues<
                            Pick<ConnectFour.ServerGameState, "player2">
                        >({ player2: gameState.player2 }),
                    );
                } else {
                    throw Error(
                        `Player ${player_id} does not exist in room ${room_id}`,
                    );
                }

                const updatedGameState =
                    parseStringifiedValues<ConnectFour.ServerGameState>(
                        await RedisClient.hgetall(room_id),
                    );

                if (
                    updatedGameState.player1.staked &&
                    updatedGameState.player2.staked
                ) {
                    await addMoneyToSeasonPool(season_id, tier_id);

                    const gameStartEvent: ConnectFour.GameStartEvent = {
                        type: "game-start",
                        payload: gameState,
                    };
                    io.to(room_id).emit(
                        gameStartEvent.type,
                        gameStartEvent.payload,
                    );
                }
            } catch (error) {
                WSError(socket, error);
            }
        },
    );

    socket.on(
        "move" satisfies ConnectFour.MoveEvent["type"],
        async ({
            move,
            room_id,
            player_id,
            chain_id,
        }: ConnectFour.MoveEvent["payload"]) => {
            try {
                const RedisClient = RedisService.getRedisClient();

                const gameState =
                    parseStringifiedValues<ConnectFour.ServerGameState>(
                        await RedisClient.hgetall(room_id),
                    );

                if (player_id !== gameState.active_player) {
                    return;
                }

                if (gameState.winner_id) {
                    return;
                }

                if (player_id === gameState.player1.player_id) {
                    if (gameState.player1.currentMove === null) {
                        gameState.player1.currentMove = move;
                        gameState.active_player = gameState.player2.player_id;
                    } else {
                        return;
                    }
                } else if (player_id === gameState.player2.player_id) {
                    if (gameState.player2.currentMove === null) {
                        gameState.player2.currentMove = move;
                        gameState.active_player = gameState.player1.player_id;
                    } else {
                        return;
                    }
                } else {
                    throw Error(
                        `Player ${player_id} does not exist in room ${room_id}`,
                    );
                }

                const activePlayer =
                    player_id === gameState.player1.player_id &&
                    gameState.player1.currentMove
                        ? gameState.player1
                        : gameState.player2.player_id === player_id &&
                            gameState.player2.currentMove
                          ? gameState.player2
                          : null;

                if (!activePlayer?.currentMove) {
                    throw Error(`no active player for player ${player_id}`);
                }

                if (activePlayer.currentMove.column !== -1) {
                    for (let row = ConnectFour.rowCount - 1; row >= 0; row--) {
                        if (
                            gameState.board[row][
                                activePlayer.currentMove.column
                            ] === null
                        ) {
                            gameState.board[row][
                                activePlayer.currentMove.column
                            ] = activePlayer.player_id;
                            break;
                        }
                    }

                    const win = ConnectFour.getWinner(
                        gameState.board,
                        player_id,
                    );

                    if (!win) {
                        const tie = ConnectFour.checkTie(gameState.board);

                        if (!tie) {
                            const moveEndEvent: ConnectFour.MoveEndEvent = {
                                type: "move-end",
                                payload: gameState,
                            };
                            io.to(room_id).emit(
                                moveEndEvent.type,
                                moveEndEvent.payload,
                            );
                        } else {
                            gameState.board = ConnectFour.emptyBoard;
                            const tieEvent: ConnectFour.TieEvent = {
                                type: "tie",
                                payload: gameState,
                            };
                            io.to(room_id).emit(
                                tieEvent.type,
                                tieEvent.payload,
                            );
                        }

                        gameState.player1.currentMove = null;
                        gameState.player2.currentMove = null;

                        await RedisClient.hset(
                            room_id,
                            stringifyObjectValues<ConnectFour.ServerGameState>(
                                gameState,
                            ),
                        );
                        return;
                    } else {
                        gameState.winner_id = activePlayer.player_id;
                    }
                } else {
                    gameState.winner_id =
                        activePlayer.player_id === gameState.player1.player_id
                            ? gameState.player2.player_id
                            : gameState.player1.player_id;
                }

                const gameEndEvent: ConnectFour.GameEndEvent = {
                    type: "game-end",
                    payload: gameState as ConnectFour.GameEndEvent["payload"],
                };
                io.to(room_id).emit(gameEndEvent.type, gameEndEvent.payload);

                const [{ player_1, player_2 }] = await Promise.all([
                    fetchPlayersDetailsForPlayedGame(room_id),
                    setWinnerToGame(room_id, gameState.winner_id),
                ]);

                await EthersService.endGame(
                    room_id,
                    gameState.winner_id === player_1.player_id
                        ? player_1.wallet_address
                        : player_2.wallet_address,
                    gameState.winner_id === player_1.player_id
                        ? player_2.wallet_address
                        : player_1.wallet_address,
                    chain_id,
                );

                await RedisClient.del(room_id);
                io.socketsLeave(room_id);
            } catch (error) {
                WSError(socket, error);
            }
        },
    );
};
