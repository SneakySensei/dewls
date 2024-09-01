import { RedisService } from "../../services";
import {
    parseStringifiedValues,
    stringifyObjectValues,
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
            user_id,
        }: ConnectFour.JoinEvent["payload"]) => {
            const roomKey: string = `${season_id}::${game_id}::${tier_id}`;
            const logId: string = `[${season_id}][${game_id}][${tier_id}][${user_id}]`;

            let roomId: string | null =
                (await RedisClient.lpop(roomKey)) || null;

            if (!roomId) {
                console.info(logId, `no room found for room key ${roomKey}`);

                const { played_game_id } = await createGame(
                    user_id,
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
                        active_player: user_id,
                        player1: {
                            user_id,
                            currentMove: null,
                        },
                        board: ConnectFour.emptyBoard,
                    }),
                );

                console.info(logId, `saved game state in hashmap ${roomId}`);
            } else {
                console.info(logId, `room found for room key ${roomKey}`);

                // TODO: fix self joining room

                await addPlayer2ToGame(roomId, user_id);

                await RedisClient.hset(
                    roomId,
                    stringifyObjectValues<
                        Pick<ConnectFour.ServerGameState, "player2">
                    >({
                        player2: {
                            user_id,
                            currentMove: null,
                        },
                    }),
                );

                console.info(logId, `updated game state in hashmap ${roomId}`);
            }

            socket.join(roomId);
            console.info(logId, `user joined ${roomId}`);

            const playerJoinedEvent: ConnectFour.PlayerJoinedEvent = {
                type: "player-joined",
                payload: {
                    room_id: roomId,
                    user_id,
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
                            user_id: player1.user_id,
                        },
                        player2: {
                            currentMove: null,
                            user_id: player2.user_id,
                        },
                        active_player,
                        board,
                    },
                };
                io.to(roomId).emit(gameStartEvent.type, gameStartEvent.payload);
            }
        },
    );

    socket.on(
        "move" satisfies ConnectFour.MoveEvent["type"],
        async ({
            move,
            room_id,
            user_id,
        }: ConnectFour.MoveEvent["payload"]) => {
            const gameState =
                parseStringifiedValues<ConnectFour.ServerGameState>(
                    await RedisClient.hgetall(room_id),
                );

            if (user_id !== gameState.active_player) {
                return;
            }

            if (gameState.winner_id) {
                return;
            }

            if (user_id === gameState.player1.user_id) {
                if (gameState.player1.currentMove === null) {
                    gameState.player1.currentMove = move;
                } else {
                    return;
                }
            } else if (user_id === gameState.player2.user_id) {
                if (gameState.player2.currentMove === null) {
                    gameState.player2.currentMove = move;
                } else {
                    return;
                }
            } else {
                throw Error(
                    `Player ${user_id} does not exist in room ${room_id}`,
                );
            }

            const activePlayer =
                user_id === gameState.player1.user_id &&
                gameState.player1.currentMove
                    ? gameState.player1
                    : gameState.player2.user_id === user_id &&
                        gameState.player2.currentMove
                      ? gameState.player2
                      : null;

            if (!activePlayer?.currentMove) {
                throw Error(`no active player for player ${user_id}`);
            }

            for (let row = ConnectFour.rowCount - 1; row >= 0; row--) {
                if (
                    gameState.board[row][activePlayer.currentMove.column] ===
                    null
                ) {
                    gameState.board[row][activePlayer.currentMove.column] =
                        activePlayer.user_id;
                    break;
                }
            }

            const win = checkWinner(gameState.board, user_id);

            if (!win) {
                const moveEndEvent: ConnectFour.MoveEndEvent = {
                    type: "move-end",
                    payload: gameState,
                };
                io.to(room_id).emit(moveEndEvent.type, moveEndEvent.payload);

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
                gameState.winner_id = activePlayer.user_id;
                await setWinnerToGame(room_id, gameState.winner_id);

                await RedisClient.del(room_id);

                const gameEndEvent: ConnectFour.GameEndEvent = {
                    type: "game-end",
                    payload: gameState as ConnectFour.GameEndEvent["payload"],
                };
                io.to(room_id).emit(gameEndEvent.type, gameEndEvent.payload);
            }
        },
    );
};
