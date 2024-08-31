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
import { RockPaperScissors } from "common";
import { type Namespace, type Socket } from "socket.io";

export const RockPaperScissorsRoutes = (socket: Socket, io: Namespace) => {
    const RedisClient = RedisService.getRedisClient();

    socket.on(
        "join" as RockPaperScissors.JoinEvent["type"],
        async ({
            game_id,
            season_id,
            tier_id,
            user_id,
        }: RockPaperScissors.JoinEvent["payload"]) => {
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
                        Omit<RockPaperScissors.ServerGameState, "player2">
                    >({
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
                    stringifyObjectValues<
                        Pick<RockPaperScissors.ServerGameState, "player2">
                    >({
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

            const playerJoinedEvent: RockPaperScissors.PlayerJoinedEvent = {
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
                parseStringifiedValues<RockPaperScissors.ServerGameState>(
                    await RedisClient.hgetall(roomId),
                );

            if (player1 && player2) {
                console.info(logId, `starting game ${roomId}`);

                const gameStartEvent: RockPaperScissors.GameStartEvent = {
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
        "move" as RockPaperScissors.MoveEvent["type"],
        async ({
            move,
            room_id,
            user_id,
        }: RockPaperScissors.MoveEvent["payload"]) => {
            const gameState =
                parseStringifiedValues<RockPaperScissors.ServerGameState>(
                    await RedisClient.hgetall(room_id),
                );

            let updateGameState: boolean = true;

            if (gameState.player1.user_id === user_id) {
                if (gameState.player1.currentMove === null) {
                    gameState.player1.currentMove = move;
                }
            } else if (gameState.player2.user_id === user_id) {
                if (gameState.player2.currentMove === null) {
                    gameState.player2.currentMove = move;
                }
            } else {
                throw Error(
                    `Player ${user_id} does not exist in room ${room_id}`,
                );
            }

            if (
                gameState.player1.currentScore < RockPaperScissors.winScore &&
                gameState.player2.currentScore < RockPaperScissors.winScore &&
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

                if (
                    gameState.player1.currentScore <
                        RockPaperScissors.winScore &&
                    gameState.player2.currentScore < RockPaperScissors.winScore
                ) {
                    const roundEndEvent: RockPaperScissors.RoundEndEvent = {
                        type: "round-end",
                        payload: gameState,
                    };
                    io.to(room_id).emit(
                        roundEndEvent.type,
                        roundEndEvent.payload,
                    );
                } else {
                    await setWinnerToGame(room_id, gameState.winner_id);

                    await RedisClient.hdel(room_id);

                    const gameEndEvent: RockPaperScissors.GameEndEvent = {
                        type: "game-end",
                        payload:
                            gameState as RockPaperScissors.GameEndEvent["payload"],
                    };
                    io.to(room_id).emit(
                        gameEndEvent.type,
                        gameEndEvent.payload,
                    );
                    updateGameState = false;
                }

                gameState.player1.currentMove = null;
                gameState.player2.currentMove = null;
            }

            if (updateGameState) {
                await RedisClient.hset(
                    room_id,
                    stringifyObjectValues<RockPaperScissors.ServerGameState>(
                        gameState,
                    ),
                );
            }
        },
    );
};
