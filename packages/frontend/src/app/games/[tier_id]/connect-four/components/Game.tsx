"use client";

import AttestModal from "@/shared/AttestModal";
import StakingModal from "@/shared/StakingModal";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useTierContext } from "@/utils/context/tiers.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { getSocketManager } from "@/utils/websockets";
import { ConnectFour } from "common";
import dynamic from "next/dynamic";
import { useReducer, useRef } from "react";
import { Socket } from "socket.io-client";

type Props = {
    tier_id: string;
};

type PlayerState = {
    currentMove: ConnectFour.Move;
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

            const { user } = useWeb3AuthContext();
            const { selectedChain } = useSelectedChainContext();

            const player_user_id = user!.data.player_id;
            const player_token = user!.token;

            const socketRef = useRef<Socket>(
                getSocketManager().socket(`/${ConnectFour.slug}`, {
                    auth: {
                        token: player_token,
                    },
                }),
            );

            const reducer = (
                gameState: GameState,
                action:
                    | ConnectFour.SERVER_EVENTS
                    | { type: "next-round" }
                    | { type: "submit-move" },
            ): GameState => {
                // switch (action.type) {
                //     case "player-joined": {
                //         const { room_id, player_id } = action.payload;
                //         if (player_id === player_user_id) {
                //             return {
                //                 ...gameState,
                //                 state: "waiting",
                //                 player: {
                //                     currentMove: "rock",
                //                     currentScore: 0,
                //                     player_id,
                //                 },
                //                 room_id,
                //             };
                //         }
                //         return gameState;
                //         // since staking event is not fired for second player for some time
                //         // and first player sees the second player as joined, first player might think the game is stuck
                //         // return {
                //         //   ...gameState,
                //         //   state: "waiting",
                //         //   room_id,
                //         //   enemy: {
                //         //     currentMove: "rock",
                //         //     currentScore: 0,
                //         //     player_id: player_id,
                //         //   },
                //         // };
                //     }
                //     case "staking": {
                //         const { round, player1, player2 } = action.payload;
                //         const player =
                //             player1.player_id === player_user_id
                //                 ? player1
                //                 : player2;
                //         const enemy =
                //             player1.player_id !== player_user_id
                //                 ? player1
                //                 : player2;

                //         if (gameState.state === "waiting") {
                //             if (isFreeTier) {
                //                 socketRef.current.emit(
                //                     "staked" satisfies ConnectFour.StakedEvent["type"],
                //                     {
                //                         player_id: player_user_id,
                //                         tier_id: tier_id,
                //                         room_id: gameState.room_id,
                //                     } satisfies ConnectFour.StakedEvent["payload"],
                //                 );
                //             }

                //             return {
                //                 ...gameState,
                //                 state: "staking",
                //                 round,
                //                 player: {
                //                     currentMove: "rock",
                //                     currentScore: player.currentScore,
                //                     player_id: player.player_id,
                //                 },
                //                 enemy: {
                //                     currentMove: "rock",
                //                     currentScore: enemy.currentScore,
                //                     player_id: enemy.player_id,
                //                 },
                //             };
                //         }

                //         break;
                //     }

                //     // ? Possible the game start fires before player joined event
                //     case "game-start": {
                //         const { round, player1, player2 } = action.payload;
                //         const player =
                //             player1.player_id === player_user_id
                //                 ? player1
                //                 : player2;
                //         const enemy =
                //             player1.player_id !== player_user_id
                //                 ? player1
                //                 : player2;

                //         if (gameState.state === "staking") {
                //             return {
                //                 ...gameState,
                //                 state: "ongoingRound",
                //                 round,
                //                 player: {
                //                     currentMove: "rock",
                //                     currentScore: player.currentScore,
                //                     player_id: player.player_id,
                //                 },
                //                 enemy: {
                //                     currentMove: "rock",
                //                     currentScore: enemy.currentScore,
                //                     player_id: enemy.player_id,
                //                 },
                //             };
                //         }
                //         break;
                //     }
                //     case "submit-move": {
                //         if (gameState.state === "ongoingRound")
                //             return { ...gameState, moveSubmitted: true };
                //         break;
                //     }
                //     case "round-end": {
                //         const { round, player1, player2, winner_id } =
                //             action.payload;

                //         const player =
                //             player1.player_id === player_user_id
                //                 ? player1
                //                 : player2;
                //         const enemy =
                //             player1.player_id !== player_user_id
                //                 ? player1
                //                 : player2;

                //         if (
                //             gameState.state === "ongoingRound" &&
                //             player.currentMove &&
                //             enemy.currentMove
                //         ) {
                //             return {
                //                 ...gameState,
                //                 state: "roundEnd",
                //                 round,
                //                 player: {
                //                     ...player,
                //                     currentMove: player.currentMove,
                //                 },
                //                 enemy: {
                //                     ...enemy,
                //                     currentMove: enemy.currentMove,
                //                 },
                //                 winner_id,
                //             };
                //         }
                //         break;
                //     }
                //     case "next-round": {
                //         if (gameState.state === "roundEnd") {
                //             return {
                //                 state: "ongoingRound",
                //                 round: gameState.round + 1,
                //                 enemy: {
                //                     ...gameState.enemy,
                //                     currentMove: "rock",
                //                 },
                //                 player: {
                //                     ...gameState.player,
                //                     currentMove: "rock",
                //                 },
                //                 room_id: gameState.room_id,
                //             };
                //         }

                //         break;
                //     }
                //     case "game-end": {
                //         const { player1, player2, round, winner_id } =
                //             action.payload;

                //         const player =
                //             player1.player_id === player_user_id
                //                 ? player1
                //                 : player2;
                //         const enemy =
                //             player1.player_id !== player_user_id
                //                 ? player1
                //                 : player2;
                //         if (
                //             gameState.state === "ongoingRound" &&
                //             player.currentMove &&
                //             enemy.currentMove
                //         ) {
                //             return {
                //                 ...gameState,
                //                 state: "gameEnd",
                //                 round,
                //                 player: {
                //                     ...player,
                //                     currentMove: player.currentMove,
                //                 },
                //                 enemy: {
                //                     ...enemy,
                //                     currentMove: enemy.currentMove,
                //                 },
                //                 winner_id,
                //             };
                //         }
                //         break;
                //     }
                // }

                return gameState;
            };
            const [gameState, dispatch] = useReducer(reducer, {
                state: "initial",
                player: {
                    currentMove: { column: 0 },
                    currentScore: 0,
                    player_id: player_user_id,
                },
            });

            // useEffect(() => {
            //     const socket = socketRef.current;
            //     socket.on("connect_error", (err) => {
            //         console.log(err.message); // prints the message associated with the error
            //     });

            //     socket.on("error", (err) => {
            //         console.error(err); // prints the message associated with the error
            //     });

            //     socket.onAny((event, ...args) => {
            //         console.log("rx event", event, args);
            //     });
            //     socket.onAnyOutgoing((event, ...args) => {
            //         console.log("tx event", event, args);
            //     });
            //     socket.on(
            //         "player-joined" satisfies ConnectFour.PlayerJoinedEvent["type"],
            //         (
            //             payload: ConnectFour.PlayerJoinedEvent["payload"],
            //         ) => {
            //             dispatch({ type: "player-joined", payload });
            //         },
            //     );
            //     socket.on(
            //         "staking" satisfies ConnectFour.StakingEvent["type"],
            //         (payload: ConnectFour.StakingEvent["payload"]) => {
            //             dispatch({ type: "staking", payload });
            //         },
            //     );
            //     socket.on(
            //         "game-start" satisfies ConnectFour.GameStartEvent["type"],
            //         (payload: ConnectFour.GameStartEvent["payload"]) => {
            //             dispatch({ type: "game-start", payload });
            //         },
            //     );
            //     socket.on(
            //         "round-end" satisfies ConnectFour.RoundEndEvent["type"],
            //         (payload: ConnectFour.RoundEndEvent["payload"]) => {
            //             dispatch({ type: "round-end", payload });
            //             setTimeout(() => {
            //                 dispatch({ type: "next-round" });
            //             }, 5000);
            //         },
            //     );
            //     socket.on(
            //         "game-end" satisfies ConnectFour.GameEndEvent["type"],
            //         (payload: ConnectFour.GameEndEvent["payload"]) => {
            //             dispatch({ type: "game-end", payload });
            //         },
            //     );
            //     if (selectedChain) {
            //         socket.emit(
            //             "join" satisfies RockPaperScissors.JoinEvent["type"],
            //             {
            //                 player_id: player_user_id,
            //                 game_id: RockPaperScissors.gameId,
            //                 tier_id: tier_id,
            //                 chain_id: parseInt(selectedChain.chainId, 16),
            //             } satisfies RockPaperScissors.JoinEvent["payload"],
            //         );
            //     }
            //     return () => {
            //         socket.disconnect();
            //     };
            // }, []);
            return (
                <main className="relative flex h-full flex-col bg-neutral-100">
                    {/* Middle text banner */}
                    {/* <section className="absolute left-0 top-1/2 w-full -translate-y-1/2 bg-neutral-500 p-1 text-center">
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
                    </section> */}

                    <StakingModal
                        open={gameState.state === "staking" && !isFreeTier}
                        tier_id={tier_id}
                        // ! Todo: Add game id to the staking modal
                        game_id={
                            "0xbca4cc033c6fc7a4eebc355a0473e863ef63427291fb322d24139fd430f87e4e"
                        }
                        onSuccess={() => {
                            if (gameState.state !== "staking") return;

                            // socketRef.current.emit(
                            //     "staked" satisfies ConnectFour.StakedEvent["type"],
                            //     {
                            //         player_id: player_user_id,
                            //         tier_id: tier_id,
                            //         room_id: gameState.room_id,
                            //     } satisfies ConnectFour.StakedEvent["payload"],
                            // );
                        }}
                    />
                    <AttestModal
                        open={
                            gameState.state === "gameEnd" &&
                            player_user_id === gameState.winner_id
                        }
                        player_id={
                            gameState.state === "gameEnd"
                                ? gameState.player.player_id
                                : undefined
                        }
                        room_id={
                            gameState.state === "gameEnd"
                                ? gameState.room_id
                                : undefined
                        }
                        tier_id={tier_id}
                    />
                </main>
            );
        }),
    {
        ssr: false,
    },
);
