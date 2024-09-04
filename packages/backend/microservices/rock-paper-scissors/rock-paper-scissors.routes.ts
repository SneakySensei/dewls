import { EthersService, RedisService } from "../../services";
import {
    parseStringifiedValues,
    stringifyObjectValues,
    WSError,
} from "../../utils/functions";
import {
    addPlayer2ToGame,
    createGame,
    fetchPlayersDetailsForPlayedGame,
    setWinnerToGame,
} from "../played-games/played-games.service";
import {
    addMoneyToSeasonPool,
    fetchCurrentSeason,
} from "../seasons/seasons.service";
import { RockPaperScissors } from "common";
import { type Namespace, type Socket } from "socket.io";

export const RockPaperScissorsRoutes = async (
    socket: Socket,
    io: Namespace,
) => {
    try {
        const RedisClient = RedisService.getRedisClient();
        const season = await fetchCurrentSeason();

        if (!season) {
            throw Error("Internal server error. No Current Season found.");
        }

        const { season_id } = season;

        socket.on(
            "join" satisfies RockPaperScissors.JoinEvent["type"],
            async ({
                game_id,
                tier_id,
                chain_id,
                player_id,
            }: RockPaperScissors.JoinEvent["payload"]) => {
                try {
                    const roomKey: string = `${season_id}::${game_id}::${tier_id}::${chain_id}`;
                    const logId: string = `[${season_id}][${game_id}][${tier_id}][${player_id}]`;

                    let room_id: string | null =
                        (await RedisClient.lpop(roomKey)) || null;

                    if (!room_id) {
                        console.info(
                            logId,
                            `no room found for room key ${roomKey}`,
                        );

                        const { played_game_id } = await createGame(
                            player_id,
                            season_id,
                            game_id,
                            tier_id,
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
                                Omit<
                                    RockPaperScissors.ServerGameState,
                                    "player2"
                                >
                            >({
                                winner_id: null,
                                round: 0,
                                player1: {
                                    player_id,
                                    currentMove: null,
                                    currentScore: 0,
                                    staked: false,
                                },
                            }),
                        );

                        console.info(
                            logId,
                            `saved game state in hashmap ${room_id}`,
                        );
                    } else {
                        console.info(
                            logId,
                            `room found for room key ${roomKey}`,
                        );

                        // TODO: fix self joining room

                        await addPlayer2ToGame(room_id, player_id);

                        await RedisClient.hset(
                            room_id,
                            stringifyObjectValues<
                                Pick<
                                    RockPaperScissors.ServerGameState,
                                    "player2"
                                >
                            >({
                                player2: {
                                    player_id,
                                    currentMove: null,
                                    currentScore: 0,
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

                    const playerJoinedEvent: RockPaperScissors.PlayerJoinedEvent =
                        {
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
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
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

                        const stakingEvent: RockPaperScissors.StakingEvent = {
                            type: "staking",
                            payload: {
                                player1: gameState.player1,
                                player2: gameState.player2,
                                round: gameState.round as 0,
                            },
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
            "staked" satisfies RockPaperScissors.StakedEvent["type"],
            async ({
                room_id,
                player_id,
                tier_id,
            }: RockPaperScissors.StakedEvent["payload"]) => {
                try {
                    const gameState =
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
                            await RedisClient.hgetall(room_id),
                        );

                    if (gameState.player1.player_id === player_id) {
                        gameState.player1.staked = true;
                        await RedisClient.hset(
                            room_id,
                            stringifyObjectValues<
                                Pick<
                                    RockPaperScissors.ServerGameState,
                                    "player1"
                                >
                            >({ player1: gameState.player1 }),
                        );
                    } else if (gameState.player2.player_id === player_id) {
                        gameState.player2.staked = true;
                        await RedisClient.hset(
                            room_id,
                            stringifyObjectValues<
                                Pick<
                                    RockPaperScissors.ServerGameState,
                                    "player2"
                                >
                            >({ player2: gameState.player2 }),
                        );
                    } else {
                        throw Error(
                            `Player ${player_id} does not exist in room ${room_id}`,
                        );
                    }

                    const updatedGameState =
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
                            await RedisClient.hgetall(room_id),
                        );

                    if (
                        updatedGameState.player1.staked &&
                        updatedGameState.player2.staked
                    ) {
                        await addMoneyToSeasonPool(season_id, tier_id);

                        const gameStartEvent: RockPaperScissors.GameStartEvent =
                            {
                                type: "game-start",
                                payload: {
                                    ...updatedGameState,
                                    round: 0,
                                },
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
            "move" satisfies RockPaperScissors.MoveEvent["type"],
            async ({
                move,
                room_id,
                player_id,
                chain_id,
            }: RockPaperScissors.MoveEvent["payload"]) => {
                try {
                    const gameState =
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
                            await RedisClient.hgetall(room_id),
                        );

                    let updateGameState: boolean = true;

                    if (gameState.player1.player_id === player_id) {
                        if (gameState.player1.currentMove === null) {
                            gameState.player1.currentMove = move;
                            await RedisClient.hset(
                                room_id,
                                stringifyObjectValues<
                                    Pick<
                                        RockPaperScissors.ServerGameState,
                                        "player1"
                                    >
                                >({ player1: gameState.player1 }),
                            );
                        } else {
                            return;
                        }
                    } else if (gameState.player2.player_id === player_id) {
                        if (gameState.player2.currentMove === null) {
                            gameState.player2.currentMove = move;
                            await RedisClient.hset(
                                room_id,
                                stringifyObjectValues<
                                    Pick<
                                        RockPaperScissors.ServerGameState,
                                        "player2"
                                    >
                                >({ player2: gameState.player2 }),
                            );
                        } else {
                            return;
                        }
                    } else {
                        throw Error(
                            `Player ${player_id} does not exist in room ${room_id}`,
                        );
                    }

                    const updatedGameState =
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
                            await RedisClient.hgetall(room_id),
                        );

                    if (
                        updatedGameState.player1.currentScore <
                            RockPaperScissors.winScore &&
                        updatedGameState.player2.currentScore <
                            RockPaperScissors.winScore &&
                        updatedGameState.player1.currentMove &&
                        updatedGameState.player2.currentMove
                    ) {
                        if (
                            updatedGameState.player1.currentMove ===
                            updatedGameState.player2.currentMove
                        ) {
                            updatedGameState.winner_id = null;
                        } else if (
                            updatedGameState.player1.currentMove === "skipped"
                        ) {
                            // player 2 wins round by default
                            updatedGameState.winner_id =
                                updatedGameState.player2.player_id;
                            updatedGameState.player2.currentScore =
                                updatedGameState.player2.currentScore + 1;
                        } else if (
                            updatedGameState.player2.currentMove === "skipped"
                        ) {
                            // player 1 wins round by default
                            updatedGameState.winner_id =
                                updatedGameState.player1.player_id;
                            updatedGameState.player1.currentScore =
                                updatedGameState.player1.currentScore + 1;
                        } else if (
                            (updatedGameState.player1.currentMove === "rock" &&
                                updatedGameState.player2.currentMove ===
                                    "scissors") ||
                            (updatedGameState.player1.currentMove === "paper" &&
                                updatedGameState.player2.currentMove ===
                                    "rock") ||
                            (updatedGameState.player1.currentMove ===
                                "scissors" &&
                                updatedGameState.player2.currentMove ===
                                    "paper")
                        ) {
                            updatedGameState.winner_id =
                                updatedGameState.player1.player_id;
                            updatedGameState.player1.currentScore =
                                updatedGameState.player1.currentScore + 1;
                        } else {
                            updatedGameState.winner_id =
                                updatedGameState.player2.player_id;
                            updatedGameState.player2.currentScore =
                                updatedGameState.player2.currentScore + 1;
                        }

                        if (
                            updatedGameState.player1.currentScore <
                                RockPaperScissors.winScore &&
                            updatedGameState.player2.currentScore <
                                RockPaperScissors.winScore
                        ) {
                            const roundEndEvent: RockPaperScissors.RoundEndEvent =
                                {
                                    type: "round-end",
                                    payload: updatedGameState,
                                };
                            io.to(room_id).emit(
                                roundEndEvent.type,
                                roundEndEvent.payload,
                            );

                            updatedGameState.player1.currentMove = null;
                            updatedGameState.player2.currentMove = null;
                            updatedGameState.winner_id = null;
                            updatedGameState.round = updatedGameState.round + 1;

                            await RedisClient.hset(
                                room_id,
                                stringifyObjectValues<RockPaperScissors.ServerGameState>(
                                    updatedGameState,
                                ),
                            );
                        } else {
                            const gameEndEvent: RockPaperScissors.GameEndEvent =
                                {
                                    type: "game-end",
                                    payload:
                                        updatedGameState as RockPaperScissors.GameEndEvent["payload"],
                                };
                            io.to(room_id).emit(
                                gameEndEvent.type,
                                gameEndEvent.payload,
                            );

                            const [{ player_1, player_2 }] = await Promise.all([
                                fetchPlayersDetailsForPlayedGame(room_id),
                                setWinnerToGame(
                                    room_id,
                                    updatedGameState.winner_id,
                                ),
                            ]);

                            await EthersService.endGame(
                                room_id,
                                updatedGameState.winner_id ===
                                    player_1.player_id
                                    ? player_1.wallet_address
                                    : player_2.wallet_address,
                                updatedGameState.winner_id ===
                                    player_1.player_id
                                    ? player_2.wallet_address
                                    : player_1.wallet_address,
                                chain_id,
                            );

                            // safe to cleanup now that all prior calls have gone through
                            await RedisClient.del(room_id);
                        }
                    }
                } catch (error) {
                    WSError(socket, error);
                }
            },
        );
    } catch (error) {
        WSError(socket, error);
    }
};
