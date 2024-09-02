import { RedisService } from "../../services";
import {
    parseStringifiedValues,
    stringifyObjectValues,
    WSError,
} from "../../utils/functions";
import {
    addPlayer2ToGame,
    createGame,
    setWinnerToGame,
} from "../played-games/played-games.service";
import { checkTie, checkWinner } from "./connect-four.service";
import { ConnectFour } from "common";
import { type Namespace, type Socket } from "socket.io";

export const ConnectFourRoutes = (socket: Socket, io: Namespace) => {
    const RedisClient = RedisService.getRedisClient();

    socket.on(
        "join" satisfies ConnectFour.JoinEvent["type"],
        async ({
            game_id,
            season_id,
            tier_id,
            player_id,
        }: ConnectFour.JoinEvent["payload"]) => {
            try {
                const roomKey: string = `${season_id}::${game_id}::${tier_id}`;
                const logId: string = `[${season_id}][${game_id}][${tier_id}][${player_id}]`;

                let roomId: string | null =
                    (await RedisClient.lpop(roomKey)) || null;

                if (!roomId) {
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

                    roomId = played_game_id;

                    await RedisClient.rpush(roomKey, roomId);
                    console.info(
                        logId,
                        `pushed room id ${roomId} in room key ${roomKey}`,
                    );

                    await RedisClient.hset(
                        roomId,
                        stringifyObjectValues<
                            Omit<ConnectFour.ServerGameState, "player2">
                        >({
                            winner_id: null,
                            active_player: player_id,
                            player1: {
                                player_id,
                                currentMove: null,
                            },
                            board: ConnectFour.emptyBoard,
                        }),
                    );

                    console.info(
                        logId,
                        `saved game state in hashmap ${roomId}`,
                    );
                } else {
                    console.info(logId, `room found for room key ${roomKey}`);

                    // TODO: fix self joining room

                    await addPlayer2ToGame(roomId, player_id);

                    await RedisClient.hset(
                        roomId,
                        stringifyObjectValues<
                            Pick<ConnectFour.ServerGameState, "player2">
                        >({
                            player2: {
                                player_id,
                                currentMove: null,
                            },
                        }),
                    );

                    console.info(
                        logId,
                        `updated game state in hashmap ${roomId}`,
                    );
                }

                socket.join(roomId);
                console.info(logId, `user joined ${roomId}`);

                const playerJoinedEvent: ConnectFour.PlayerJoinedEvent = {
                    type: "player-joined",
                    payload: {
                        room_id: roomId,
                        player_id,
                    },
                };
                io.to(roomId).emit(
                    playerJoinedEvent.type,
                    playerJoinedEvent.payload,
                );

                const { player1, player2, active_player, board } =
                    parseStringifiedValues<ConnectFour.ServerGameState>(
                        await RedisClient.hgetall(roomId),
                    );

                if (player1 && player2) {
                    console.info(logId, `starting game ${roomId}`);

                    const gameStartEvent: ConnectFour.GameStartEvent = {
                        type: "game-start",
                        payload: {
                            player1: {
                                currentMove: null,
                                player_id: player1.player_id,
                            },
                            player2: {
                                currentMove: null,
                                player_id: player2.player_id,
                            },
                            active_player,
                            board,
                        },
                    };
                    io.to(roomId).emit(
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
        }: ConnectFour.MoveEvent["payload"]) => {
            try {
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
                    } else {
                        return;
                    }
                } else if (player_id === gameState.player2.player_id) {
                    if (gameState.player2.currentMove === null) {
                        gameState.player2.currentMove = move;
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

                for (let row = ConnectFour.rowCount - 1; row >= 0; row--) {
                    if (
                        gameState.board[row][
                            activePlayer.currentMove.column
                        ] === null
                    ) {
                        gameState.board[row][activePlayer.currentMove.column] =
                            activePlayer.player_id;
                        break;
                    }
                }

                const win = checkWinner(gameState.board, player_id);

                if (!win) {
                    const moveEndEvent: ConnectFour.MoveEndEvent = {
                        type: "move-end",
                        payload: gameState,
                    };
                    io.to(room_id).emit(
                        moveEndEvent.type,
                        moveEndEvent.payload,
                    );

                    gameState.player1.currentMove = null;
                    gameState.player2.currentMove = null;

                    const tie = checkTie(gameState.board);

                    if (tie) {
                        gameState.board = ConnectFour.emptyBoard;
                        const tieEvent: ConnectFour.TieEvent = {
                            type: "tie",
                            payload: gameState,
                        };
                        io.to(room_id).emit(tieEvent.type, tieEvent.payload);
                    }

                    await RedisClient.hset(
                        room_id,
                        stringifyObjectValues<ConnectFour.ServerGameState>(
                            gameState,
                        ),
                    );
                } else {
                    gameState.winner_id = activePlayer.player_id;
                    await setWinnerToGame(room_id, gameState.winner_id);

                    await RedisClient.del(room_id);

                    const gameEndEvent: ConnectFour.GameEndEvent = {
                        type: "game-end",
                        payload:
                            gameState as ConnectFour.GameEndEvent["payload"],
                    };
                    io.to(room_id).emit(
                        gameEndEvent.type,
                        gameEndEvent.payload,
                    );
                }
            } catch (error) {
                WSError(socket, error);
            }
        },
    );
};
