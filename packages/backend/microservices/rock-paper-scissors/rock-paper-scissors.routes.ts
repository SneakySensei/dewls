import { RedisService } from "../../services";
import {
    parseStringifiedValues,
    stringifyObjectValues,
} from "../../utils/functions";
import {
    addPlayer2ToGame,
    createGame,
} from "../played-games/played-games.service";
import {
    IdlePlayerServerState,
    MoveEvent,
    winScore,
    type GameStartEvent,
    type JoinEvent,
    type PlayerJoinedEvent,
    type ServerGameState,
} from "common/rock-paper-scissors";
import { Namespace, type Socket } from "socket.io";

export const RockPaperScissorsRoutes = (socket: Socket, io: Namespace) => {
    const RedisClient = RedisService.getRedisClient();

    socket.on(
        "join" as JoinEvent["type"],
        async ({
            game_id,
            season_id,
            tier_id,
            user_id,
        }: JoinEvent["payload"]) => {
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
                    stringifyObjectValues<Omit<ServerGameState, "player2">>({
                        winner_id: null,
                        round: 0,
                        player1: {
                            user_id,
                            currentMove: null,
                            currentScore: 0,
                        },
                    }),
                );

                console.info(logId, `saved game state in hashmap ${roomId}`);
            } else {
                console.info(logId, `room found for room key ${roomKey}`);

                await addPlayer2ToGame(roomId, user_id);

                await RedisClient.hset(
                    roomId,
                    stringifyObjectValues<Pick<ServerGameState, "player2">>({
                        player2: {
                            user_id,
                            currentMove: null,
                            currentScore: 0,
                        },
                    }),
                );

                console.info(logId, `updated game state in hashmap ${roomId}`);
            }

            socket.join(roomId);
            console.info(logId, `user joined ${roomId}`);

            const playerJoinedEvent: PlayerJoinedEvent = {
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

            const { player1, player2, round } =
                parseStringifiedValues<ServerGameState>(
                    await RedisClient.hgetall(roomId),
                );

            if (player1 && player2) {
                console.info(logId, `starting game ${roomId}`);

                const gameStartEvent: GameStartEvent = {
                    type: "game-start",
                    payload: {
                        player1: {
                            currentMove: null,
                            currentScore: 0,
                            user_id: player1.user_id,
                        },
                        player2: {
                            currentMove: null,
                            currentScore: 0,
                            user_id: player2.user_id,
                        },
                        round: round as 0,
                    },
                };
                io.to(roomId).emit(gameStartEvent.type, gameStartEvent.payload);
            }
        },
    );

    socket.on(
        "move" as MoveEvent["type"],
        async ({ move, room_id, user_id }: MoveEvent["payload"]) => {
            const gameState = parseStringifiedValues<ServerGameState>(
                await RedisClient.hgetall(room_id),
            );

            if (gameState.player1.user_id === user_id) {
                if (
                    (gameState.player1 as IdlePlayerServerState).currentMove ===
                    null
                ) {
                    gameState.player1.currentMove = move;
                }
            } else if (gameState.player2.user_id === user_id) {
                if (
                    (gameState.player2 as IdlePlayerServerState).currentMove ===
                    null
                ) {
                    gameState.player2.currentMove = move;
                }
            } else {
                throw Error(
                    `Player ${user_id} does not exist in room ${room_id}`,
                );
            }

            if (
                gameState.player1.currentScore < winScore &&
                gameState.player2.currentScore < winScore
            ) {
                if (
                    gameState.player1.currentMove &&
                    gameState.player2.currentMove
                ) {
                    if (
                        gameState.player1.currentMove ===
                        gameState.player2.currentMove
                    ) {
                        gameState.winner_id = null;
                    } else if (
                        (gameState.player1.currentMove === "rock" &&
                            gameState.player2.currentMove === "scissors") ||
                        (gameState.player1.currentMove === "paper" &&
                            gameState.player2.currentMove === "rock") ||
                        (gameState.player1.currentMove === "scissors" &&
                            gameState.player2.currentMove === "paper")
                    ) {
                        gameState.winner_id = gameState.player1.user_id;
                        gameState.player1.currentScore =
                            gameState.player1.currentScore + 1;
                    } else {
                        gameState.winner_id = gameState.player2.user_id;
                        gameState.player2.currentScore =
                            gameState.player2.currentScore + 1;
                    }
                } else {
                    // ? which event to emit to let the other player know first player has made a move
                }
            } else {
                // TODO: emit game end with winner and clear hmap
            }

            await RedisClient.hset(
                room_id,
                stringifyObjectValues<ServerGameState>(gameState),
            );
        },
    );
};
