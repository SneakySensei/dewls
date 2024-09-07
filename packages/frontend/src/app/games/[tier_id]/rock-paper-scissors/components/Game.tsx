"use client";

import EnemyScreen from "./EnemyScreen";
import PlayerScreen from "./PlayerScreen";
import useSocket from "@/hooks/useSocket";
import AttestModal from "@/shared/AttestModal";
import StakingModal from "@/shared/StakingModal";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useTierContext } from "@/utils/context/tiers.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedSeason, ResponseWithData } from "@/utils/types";
import { RockPaperScissors } from "common";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useState } from "react";

type Props = {
    tier_id: string;
};

type PlayerState = {
    currentMove: RockPaperScissors.Move;
    currentScore: number;
    player_id: string;
};
export type GameState =
    | { state: "initial"; player: PlayerState }
    | {
          state: "waiting";
          room_id: string;
          player?: PlayerState;
          enemy?: PlayerState;
      }
    | {
          state: "staking";
          room_id: string;
          round: number;
          player: PlayerState;
          enemy: PlayerState;
      }
    | {
          state: "ongoingRound";
          room_id: string;
          round: number;
          moveSubmitted?: boolean;
          player: PlayerState;
          enemy: PlayerState;
      }
    | {
          state: "roundEnd";
          room_id: string;
          round: number;
          player: PlayerState;
          enemy: PlayerState;
          winner_id: string | null;
      }
    | {
          state: "gameEnd";
          room_id: string;
          round: number;
          player: PlayerState;
          enemy: PlayerState;
          winner_id: string;
      };

export default dynamic(
    () =>
        Promise.resolve(function Game({ tier_id }: Props) {
            const { tiers } = useTierContext();
            const isFreeTier =
                tiers.find((tier) => tier.tier_id === tier_id)?.usd_amount ===
                0;
            const [currentSeason, setCurrentSeason] =
                useState<MappedSeason | null>(null);

            const { user } = useWeb3AuthContext();
            const { selectedChain } = useSelectedChainContext();

            const player_user_id = user!.data.player_id;
            const player_token = user!.token;

            const socket = useSocket({
                namespace: RockPaperScissors.slug,
                auth_token: player_token,
            });

            const reducer = (
                gameState: GameState,
                action:
                    | RockPaperScissors.SERVER_EVENTS
                    | { type: "next-round" }
                    | { type: "submit-move" },
            ): GameState => {
                switch (action.type) {
                    case "player-joined": {
                        const { room_id, player_id } = action.payload;
                        if (player_id === player_user_id) {
                            return {
                                ...gameState,
                                state: "waiting",
                                player: {
                                    currentMove: "rock",
                                    currentScore: 0,
                                    player_id,
                                },
                                room_id,
                            };
                        }
                        return gameState;
                        // since staking event is not fired for second player for some time
                        // and first player sees the second player as joined, first player might think the game is stuck
                        // return {
                        //   ...gameState,
                        //   state: "waiting",
                        //   room_id,
                        //   enemy: {
                        //     currentMove: "rock",
                        //     currentScore: 0,
                        //     player_id: player_id,
                        //   },
                        // };
                    }
                    case "staking": {
                        const { round, player1, player2 } = action.payload;
                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;

                        if (gameState.state === "waiting") {
                            if (isFreeTier) {
                                socket.handle.emit(
                                    "staked" satisfies RockPaperScissors.StakedEvent["type"],
                                    {
                                        player_id: player_user_id,
                                        tier_id: tier_id,
                                        room_id: gameState.room_id,
                                    } satisfies RockPaperScissors.StakedEvent["payload"],
                                );
                            }

                            return {
                                ...gameState,
                                state: "staking",
                                round,
                                player: {
                                    currentMove: "rock",
                                    currentScore: player.currentScore,
                                    player_id: player.player_id,
                                },
                                enemy: {
                                    currentMove: "rock",
                                    currentScore: enemy.currentScore,
                                    player_id: enemy.player_id,
                                },
                            };
                        }

                        break;
                    }

                    // ? Possible the game start fires before player joined event
                    case "game-start": {
                        const { round, player1, player2 } = action.payload;
                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;

                        if (gameState.state === "staking") {
                            return {
                                ...gameState,
                                state: "ongoingRound",
                                round,
                                player: {
                                    currentMove: "rock",
                                    currentScore: player.currentScore,
                                    player_id: player.player_id,
                                },
                                enemy: {
                                    currentMove: "rock",
                                    currentScore: enemy.currentScore,
                                    player_id: enemy.player_id,
                                },
                            };
                        }
                        break;
                    }
                    case "submit-move": {
                        if (gameState.state === "ongoingRound")
                            return { ...gameState, moveSubmitted: true };
                        break;
                    }
                    case "round-end": {
                        const { round, player1, player2, winner_id } =
                            action.payload;

                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;

                        if (
                            gameState.state === "ongoingRound" &&
                            player.currentMove &&
                            enemy.currentMove
                        ) {
                            return {
                                ...gameState,
                                state: "roundEnd",
                                round,
                                player: {
                                    ...player,
                                    currentMove: player.currentMove,
                                },
                                enemy: {
                                    ...enemy,
                                    currentMove: enemy.currentMove,
                                },
                                winner_id,
                            };
                        }
                        break;
                    }
                    case "next-round": {
                        if (gameState.state === "roundEnd") {
                            return {
                                state: "ongoingRound",
                                round: gameState.round + 1,
                                enemy: {
                                    ...gameState.enemy,
                                    currentMove: "rock",
                                },
                                player: {
                                    ...gameState.player,
                                    currentMove: "rock",
                                },
                                room_id: gameState.room_id,
                            };
                        }

                        break;
                    }
                    case "game-end": {
                        const { player1, player2, round, winner_id } =
                            action.payload;

                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;
                        if (
                            gameState.state === "ongoingRound" &&
                            player.currentMove &&
                            enemy.currentMove
                        ) {
                            return {
                                ...gameState,
                                state: "gameEnd",
                                round,
                                player: {
                                    ...player,
                                    currentMove: player.currentMove,
                                },
                                enemy: {
                                    ...enemy,
                                    currentMove: enemy.currentMove,
                                },
                                winner_id,
                            };
                        }
                        break;
                    }
                }

                return gameState;
            };
            const [gameState, dispatch] = useReducer(reducer, {
                state: "initial",
                player: {
                    currentMove: "rock",
                    currentScore: 0,
                    player_id: player_user_id,
                },
            });

            useEffect(() => {
                (async () => {
                    const seasonsRes = await fetch(
                        `${API_REST_BASE_URL}/seasons/current`,
                    );
                    const seasonsResponse =
                        (await seasonsRes.json()) as ResponseWithData<MappedSeason>;
                    if (seasonsResponse.success) {
                        setCurrentSeason(seasonsResponse.data);
                    }
                })();
            }, []);

            useEffect(() => {
                if (!socket.connected || !selectedChain) return;

                const handleConnectError = (err: Error) => {
                    console.log(err.message); // prints the message associated with the error
                };
                const handleError = (err: any) => {
                    console.error(err); // prints the message associated with the error
                };
                const handleAny = (event: any, ...args: any[]) => {
                    console.log("rx event", event, args);
                };
                const handleAnyOutgoing = (event: any, ...args: any[]) => {
                    console.log("tx event", event, args);
                };

                const handlePlayerJoined = (
                    payload: RockPaperScissors.PlayerJoinedEvent["payload"],
                ) => {
                    dispatch({ type: "player-joined", payload });
                };
                const handleStaking = (
                    payload: RockPaperScissors.StakingEvent["payload"],
                ) => {
                    dispatch({ type: "staking", payload });
                };
                const handleGameStart = (
                    payload: RockPaperScissors.GameStartEvent["payload"],
                ) => {
                    dispatch({ type: "game-start", payload });
                };
                const handleRoundEnd = (
                    payload: RockPaperScissors.RoundEndEvent["payload"],
                ) => {
                    dispatch({ type: "round-end", payload });
                    setTimeout(() => {
                        dispatch({ type: "next-round" });
                    }, 5000);
                };
                const handleGameEnd = (
                    payload: RockPaperScissors.GameEndEvent["payload"],
                ) => {
                    dispatch({ type: "game-end", payload });
                };

                socket.handle.on("connect_error", handleConnectError);
                socket.handle.on("error", handleError);
                socket.handle.onAny(handleAny);
                socket.handle.onAnyOutgoing(handleAnyOutgoing);
                socket.handle.on(
                    "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
                    handlePlayerJoined,
                );
                socket.handle.on(
                    "staking" satisfies RockPaperScissors.StakingEvent["type"],
                    handleStaking,
                );
                socket.handle.on(
                    "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
                    handleGameStart,
                );
                socket.handle.on(
                    "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
                    handleRoundEnd,
                );
                socket.handle.on(
                    "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
                    handleGameEnd,
                );

                socket.handle.emit(
                    "join" satisfies RockPaperScissors.JoinEvent["type"],
                    {
                        player_id: player_user_id,
                        game_id: RockPaperScissors.gameId,
                        tier_id: tier_id,
                        chain_id: parseInt(selectedChain.chainId, 16),
                    } satisfies RockPaperScissors.JoinEvent["payload"],
                );

                return () => {
                    socket.handle.off("connect_error", handleConnectError);
                    socket.handle.off("error", handleError);
                    socket.handle.offAny(handleAny);
                    socket.handle.offAnyOutgoing(handleAnyOutgoing);
                    socket.handle.off(
                        "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
                        handlePlayerJoined,
                    );
                    socket.handle.off(
                        "staking" satisfies RockPaperScissors.StakingEvent["type"],
                        handleStaking,
                    );
                    socket.handle.off(
                        "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
                        handleGameStart,
                    );
                    socket.handle.off(
                        "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
                        handleRoundEnd,
                    );
                    socket.handle.off(
                        "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
                        handleGameEnd,
                    );
                };
            }, [socket.connected]);

            return (
                <main className="relative flex h-full flex-col bg-neutral-100">
                    <EnemyScreen gameState={gameState} />
                    <PlayerScreen
                        gameState={gameState}
                        onMove={(move) => {
                            if (
                                gameState.state !== "ongoingRound" ||
                                gameState.moveSubmitted ||
                                !selectedChain ||
                                !socket.connected
                            )
                                return;
                            const moveEvent: RockPaperScissors.MoveEvent = {
                                type: "move",
                                payload: {
                                    room_id: gameState.room_id,
                                    player_id: gameState.player.player_id,
                                    move,
                                    chain_id: parseInt(
                                        selectedChain.chainId,
                                        16,
                                    ),
                                },
                            };

                            socket.handle.emit(
                                moveEvent.type,
                                moveEvent.payload,
                            );
                            dispatch({ type: "submit-move" });
                        }}
                    />

                    {/* Middle text banner */}
                    <section className="absolute left-0 top-1/2 w-full -translate-y-1/2 bg-neutral-500 p-1 text-center">
                        {gameState.state === "ongoingRound" && (
                            <h2 className="text-display-2">
                                Round {gameState.round + 1}
                            </h2>
                        )}
                        {gameState.state === "roundEnd" && (
                            <h2 className="text-display-2">
                                {gameState.winner_id
                                    ? gameState.winner_id ===
                                      gameState.player.player_id
                                        ? "You win the round!"
                                        : "Enemy wins the round!"
                                    : "Draw!"}
                            </h2>
                        )}
                        {gameState.state === "gameEnd" && (
                            <h2 className="text-display-2">
                                {gameState.winner_id ===
                                gameState.player.player_id
                                    ? "You win!"
                                    : "Enemy wins!"}
                            </h2>
                        )}
                    </section>

                    <StakingModal
                        open={gameState.state === "staking" && !isFreeTier}
                        tier_id={tier_id}
                        // ! Todo: Add game id to the staking modal
                        game_id={
                            gameState.state === "staking"
                                ? gameState.room_id
                                : ""
                        }
                        onSuccess={() => {
                            if (
                                gameState.state !== "staking" ||
                                !socket.connected
                            )
                                return;

                            socket.handle.emit(
                                "staked" satisfies RockPaperScissors.StakedEvent["type"],
                                {
                                    player_id: player_user_id,
                                    tier_id: tier_id,
                                    room_id: gameState.room_id,
                                } satisfies RockPaperScissors.StakedEvent["payload"],
                            );
                        }}
                    />
                    {currentSeason && (
                        <AttestModal
                            open={
                                gameState.state === "gameEnd" &&
                                player_user_id === gameState.winner_id
                            }
                            season_id={currentSeason?.season_id}
                            player_id={
                                gameState.state === "gameEnd"
                                    ? gameState.winner_id
                                    : undefined
                            }
                            room_id={
                                gameState.state === "gameEnd"
                                    ? gameState.room_id
                                    : undefined
                            }
                            tier_id={tier_id}
                        />
                    )}
                </main>
            );
        }),
    {
        ssr: false,
    },
);
