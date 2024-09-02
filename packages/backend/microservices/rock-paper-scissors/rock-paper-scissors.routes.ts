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
                player_id,
            }: RockPaperScissors.JoinEvent["payload"]) => {
                try {
                    const roomKey: string = `${season_id}::${game_id}::${tier_id}`;
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

                    const { player1, player2, round } =
                        parseStringifiedValues<RockPaperScissors.ServerGameState>(
                            await RedisClient.hgetall(room_id),
                        );

                    if (player1 && player2) {
                        const stakingEvent: RockPaperScissors.StakingEvent = {
                            type: "staking",
                            payload: null,
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
                    } else if (gameState.player2.player_id === player_id) {
                        gameState.player2.staked = true;
                    } else {
                        throw Error(
                            `Player ${player_id} does not exist in room ${room_id}`,
                        );
                    }

                    if (gameState.player1.staked && gameState.player2.staked) {
                        await addMoneyToSeasonPool(season_id, tier_id);

                        const gameStartEvent: RockPaperScissors.GameStartEvent =
                            {
                                type: "game-start",
                                payload: {
                                    ...gameState,
                                    round: gameState.round as 0,
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
                        } else {
                            return;
                        }
                    } else if (gameState.player2.player_id === player_id) {
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

                    if (
                        gameState.player1.currentScore <
                            RockPaperScissors.winScore &&
                        gameState.player2.currentScore <
                            RockPaperScissors.winScore &&
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
                            gameState.winner_id = gameState.player1.player_id;
                            gameState.player1.currentScore =
                                gameState.player1.currentScore + 1;
                        } else {
                            gameState.winner_id = gameState.player2.player_id;
                            gameState.player2.currentScore =
                                gameState.player2.currentScore + 1;
                        }

                        if (
                            gameState.player1.currentScore <
                                RockPaperScissors.winScore &&
                            gameState.player2.currentScore <
                                RockPaperScissors.winScore
                        ) {
                            const roundEndEvent: RockPaperScissors.RoundEndEvent =
                                {
                                    type: "round-end",
                                    payload: gameState,
                                };
                            io.to(room_id).emit(
                                roundEndEvent.type,
                                roundEndEvent.payload,
                            );
                        } else {
                            await setWinnerToGame(room_id, gameState.winner_id);

                            await RedisClient.del(room_id);

                            const gameEndEvent: RockPaperScissors.GameEndEvent =
                                {
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
                        gameState.winner_id = null;
                        gameState.round = gameState.round + 1;
                    }

                    if (updateGameState) {
                        await RedisClient.hset(
                            room_id,
                            stringifyObjectValues<RockPaperScissors.ServerGameState>(
                                gameState,
                            ),
                        );
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
