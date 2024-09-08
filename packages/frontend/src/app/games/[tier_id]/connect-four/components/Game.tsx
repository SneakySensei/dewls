"use client";

import Announcements from "./Announcements";
import Board from "./Board";
import useSocket from "@/hooks/useSocket";
import AttestModal from "@/shared/AttestModal";
import LoseModal from "@/shared/LoseModal";
import PlayerGameView from "@/shared/PlayerGameView";
import StakingModal from "@/shared/StakingModal";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useTierContext } from "@/utils/context/tiers.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { ResponseWithData, MappedSeason } from "@/utils/types";
import { ConnectFour } from "common";
import { emptyBoard } from "common/connect-four";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useState } from "react";

type Props = {
    tier_id: string;
};

type PlayerState = {
    currentMove: ConnectFour.Move | null;
    player_id: string;
};

export type GameState =
    | { state: "initial"; player: PlayerState; board: ConnectFour.Board }
    | {
          state: "waiting";
          room_id: string;
          board: ConnectFour.Board;
          player: PlayerState;
          enemy?: PlayerState;
      }
    | {
          state: "staking";
          room_id: string;
          board: ConnectFour.Board;
          player: PlayerState;
          enemy: PlayerState;
      }
    | {
          state: "ongoingMove";
          room_id: string;
          active_player: string;
          moveSubmitted?: boolean;
          board: ConnectFour.Board;
          player: PlayerState;
          enemy: PlayerState;
      }
    | {
          state: "tie";
          room_id: string;
          active_player: string;
          board: ConnectFour.Board;
          player: PlayerState;
          enemy: PlayerState;
      }
    | {
          state: "gameEnd";
          room_id: string;
          active_player: string;
          board: ConnectFour.Board;
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
                namespace: ConnectFour.slug,
                auth_token: player_token,
            });

            const reducer = (
                gameState: GameState,
                action:
                    | ConnectFour.SERVER_EVENTS
                    | { type: "submit-move" }
                    | { type: "restart" },
            ): GameState => {
                switch (action.type) {
                    case "player-joined": {
                        const { room_id, player_id } = action.payload;
                        if (player_id === player_user_id) {
                            return {
                                ...gameState,
                                state: "waiting",
                                player: {
                                    currentMove: null,
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
                        const { player1, player2, board } = action.payload;
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
                                    "staked" satisfies ConnectFour.StakedEvent["type"],
                                    {
                                        player_id: player_user_id,
                                        tier_id: tier_id,
                                        room_id: gameState.room_id,
                                    } satisfies ConnectFour.StakedEvent["payload"],
                                );
                            }

                            return {
                                ...gameState,
                                state: "staking",
                                player: {
                                    currentMove: null,
                                    player_id: player.player_id,
                                },
                                enemy: {
                                    currentMove: null,
                                    player_id: enemy.player_id,
                                },
                                board,
                            };
                        }

                        break;
                    }

                    // ? Possible the game start fires before player joined event
                    case "game-start": {
                        const { player1, player2, active_player, board } =
                            action.payload;
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
                                state: "ongoingMove",
                                player,
                                enemy,
                                moveSubmitted: false,
                                active_player,
                                board,
                            };
                        }
                        break;
                    }
                    case "submit-move": {
                        if (gameState.state === "ongoingMove")
                            return { ...gameState, moveSubmitted: true };
                        break;
                    }
                    case "move-end": {
                        const { player1, player2, active_player, board } =
                            action.payload;

                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;

                        if (gameState.state === "ongoingMove") {
                            return {
                                ...gameState,
                                state: "ongoingMove",
                                player,
                                enemy,
                                active_player,
                                board,
                                moveSubmitted: false,
                            };
                        }
                        break;
                    }
                    case "tie": {
                        const { player1, player2, active_player, board } =
                            action.payload;

                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;

                        if (gameState.state === "ongoingMove") {
                            setTimeout(() => {
                                dispatch({ type: "restart" });
                            }, 3000);
                            return {
                                state: "tie",
                                room_id: gameState.room_id,
                                player,
                                enemy,
                                active_player,
                                board: gameState.board,
                            };
                        }

                        break;
                    }
                    case "restart": {
                        if (gameState.state === "tie") {
                            return {
                                state: "ongoingMove",
                                room_id: gameState.room_id,
                                board: ConnectFour.emptyBoard,
                                active_player: gameState.active_player,
                                moveSubmitted: false,
                                enemy: gameState.enemy,
                                player: gameState.player,
                            };
                        }
                        break;
                    }
                    case "game-end": {
                        const {
                            player1,
                            player2,
                            winner_id,
                            active_player,
                            board,
                        } = action.payload;

                        const player =
                            player1.player_id === player_user_id
                                ? player1
                                : player2;
                        const enemy =
                            player1.player_id !== player_user_id
                                ? player1
                                : player2;
                        if (gameState.state === "ongoingMove") {
                            return {
                                ...gameState,
                                state: "gameEnd",
                                player,
                                enemy,
                                winner_id,
                                active_player,
                                board,
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
                    currentMove: null,
                    player_id: player_user_id,
                },
                board: emptyBoard,
            } satisfies GameState);

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
                    payload: ConnectFour.PlayerJoinedEvent["payload"],
                ) => {
                    dispatch({ type: "player-joined", payload });
                };
                const handleStaking = (
                    payload: ConnectFour.StakingEvent["payload"],
                ) => {
                    dispatch({ type: "staking", payload });
                };
                const handleGameStart = (
                    payload: ConnectFour.GameStartEvent["payload"],
                ) => {
                    dispatch({ type: "game-start", payload });
                };
                const handleMoveEnd = (
                    payload: ConnectFour.MoveEndEvent["payload"],
                ) => {
                    dispatch({ type: "move-end", payload });
                };
                const handleTie = (
                    payload: ConnectFour.TieEvent["payload"],
                ) => {
                    dispatch({ type: "tie", payload });
                };
                const handleGameEnd = (
                    payload: ConnectFour.GameEndEvent["payload"],
                ) => {
                    dispatch({ type: "game-end", payload });
                };

                socket.handle.on("connect_error", handleConnectError);
                socket.handle.on("error", handleError);
                socket.handle.onAny(handleAny);
                socket.handle.onAnyOutgoing(handleAnyOutgoing);
                socket.handle.on(
                    "player-joined" satisfies ConnectFour.PlayerJoinedEvent["type"],
                    handlePlayerJoined,
                );
                socket.handle.on(
                    "staking" satisfies ConnectFour.StakingEvent["type"],
                    handleStaking,
                );
                socket.handle.on(
                    "game-start" satisfies ConnectFour.GameStartEvent["type"],
                    handleGameStart,
                );
                socket.handle.on(
                    "move-end" satisfies ConnectFour.MoveEndEvent["type"],
                    handleMoveEnd,
                );
                socket.handle.on(
                    "tie" satisfies ConnectFour.TieEvent["type"],
                    handleTie,
                );

                socket.handle.on(
                    "game-end" satisfies ConnectFour.GameEndEvent["type"],
                    handleGameEnd,
                );

                socket.handle.emit(
                    "join" satisfies ConnectFour.JoinEvent["type"],
                    {
                        player_id: player_user_id,
                        game_id: ConnectFour.gameId,
                        tier_id: tier_id,
                        chain_id: parseInt(selectedChain.chainId, 16),
                    } satisfies ConnectFour.JoinEvent["payload"],
                );

                return () => {
                    socket.handle.off("connect_error", handleConnectError);
                    socket.handle.off("error", handleError);
                    socket.handle.offAny(handleAny);
                    socket.handle.offAnyOutgoing(handleAnyOutgoing);
                    socket.handle.off(
                        "player-joined" satisfies ConnectFour.PlayerJoinedEvent["type"],
                        handlePlayerJoined,
                    );
                    socket.handle.off(
                        "staking" satisfies ConnectFour.StakingEvent["type"],
                        handleStaking,
                    );
                    socket.handle.off(
                        "game-start" satisfies ConnectFour.GameStartEvent["type"],
                        handleGameStart,
                    );
                    socket.handle.off(
                        "move-end" satisfies ConnectFour.MoveEndEvent["type"],
                        handleMoveEnd,
                    );
                    socket.handle.off(
                        "tie" satisfies ConnectFour.TieEvent["type"],
                        handleTie,
                    );

                    socket.handle.off(
                        "game-end" satisfies ConnectFour.GameEndEvent["type"],
                        handleGameEnd,
                    );
                };
            }, [socket.connected]);

            const handleMove = (column: number) => {
                if (
                    gameState.state !== "ongoingMove" ||
                    gameState.moveSubmitted ||
                    gameState.active_player !== player.player_id ||
                    !socket.connected ||
                    !selectedChain
                )
                    return;

                const moveEvent: ConnectFour.MoveEvent = {
                    type: "move",
                    payload: {
                        room_id: gameState.room_id,
                        player_id: gameState.player.player_id,
                        move: { column },
                        chain_id: parseInt(selectedChain.chainId, 16),
                    },
                };
                socket.handle.emit(moveEvent.type, moveEvent.payload);
                dispatch({ type: "submit-move" });
            };

            const player = gameState.player;
            const enemy =
                gameState.state === "initial" ? undefined : gameState.enemy;
            return (
                <main className="relative flex h-full flex-col justify-center bg-[radial-gradient(#ABABFC,#8B81F8,#7863F1,#3F2E81)] p-4">
                    <Board gameState={gameState} onMove={handleMove} />
                    {enemy && (
                        <section className="absolute left-0 top-0 p-2">
                            <PlayerGameView
                                timerSeconds={ConnectFour.moveTime}
                                showTimer={
                                    gameState.state === "ongoingMove" &&
                                    gameState.active_player === enemy.player_id
                                }
                                user_id={enemy.player_id}
                            />
                        </section>
                    )}
                    {player && (
                        <section className="absolute bottom-0 right-0 p-2">
                            <PlayerGameView
                                timerSeconds={ConnectFour.moveTime}
                                showTimer={
                                    gameState.state === "ongoingMove" &&
                                    gameState.active_player ===
                                        player.player_id &&
                                    !gameState.moveSubmitted
                                }
                                onTimerEnd={() => handleMove(-1)}
                                user_id={player.player_id}
                            />
                        </section>
                    )}

                    <Announcements gameState={gameState} />

                    {/* Middle text banner */}
                    {/* <section className="absolute left-0 top-1/2 w-full -translate-y-1/2 bg-neutral-500 p-1 text-center">
                        
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
                            gameState.state === "staking"
                                ? gameState.room_id
                                : ""
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
                    {currentSeason && (
                        <AttestModal
                            open={
                                gameState.state === "gameEnd" &&
                                player_user_id === gameState.winner_id
                            }
                            season_id={currentSeason?.season_id}
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
                    )}
                    <LoseModal
                        open={
                            gameState.state === "gameEnd" &&
                            player_user_id !== gameState.winner_id
                        }
                    />
                </main>
            );
        }),
    {
        ssr: false,
    },
);
