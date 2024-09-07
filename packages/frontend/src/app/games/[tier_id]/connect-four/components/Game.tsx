"use client";

import AttestModal from "@/shared/AttestModal";
import PlayerGameView from "@/shared/PlayerGameView";
import StakingModal from "@/shared/StakingModal";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useTierContext } from "@/utils/context/tiers.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { ResponseWithData, MappedSeason } from "@/utils/types";
import { getSocketManager } from "@/utils/websockets";
import { ConnectFour } from "common";
import { emptyBoard } from "common/connect-four";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState } from "react";
import { Socket } from "socket.io-client";

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

            const socketRef = useRef<Socket>(
                getSocketManager().socket(`/${ConnectFour.slug}`, {
                    auth: {
                        token: player_token,
                    },
                }),
            );

            const reducer = (
                gameState: GameState,
                action: ConnectFour.SERVER_EVENTS | { type: "submit-move" },
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
                                socketRef.current.emit(
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
                            return {
                                ...gameState,
                                state: "tie",
                                player,
                                enemy,
                                active_player,
                                board,
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
                const socket = socketRef.current;
                socket.on("connect_error", (err) => {
                    console.log(err.message); // prints the message associated with the error
                });

                socket.on("error", (err) => {
                    console.error(err); // prints the message associated with the error
                });

                socket.onAny((event, ...args) => {
                    console.log("rx event", event, args);
                });
                socket.onAnyOutgoing((event, ...args) => {
                    console.log("tx event", event, args);
                });
                socket.on(
                    "player-joined" satisfies ConnectFour.PlayerJoinedEvent["type"],
                    (payload: ConnectFour.PlayerJoinedEvent["payload"]) => {
                        dispatch({ type: "player-joined", payload });
                    },
                );
                socket.on(
                    "staking" satisfies ConnectFour.StakingEvent["type"],
                    (payload: ConnectFour.StakingEvent["payload"]) => {
                        dispatch({ type: "staking", payload });
                    },
                );
                socket.on(
                    "game-start" satisfies ConnectFour.GameStartEvent["type"],
                    (payload: ConnectFour.GameStartEvent["payload"]) => {
                        dispatch({ type: "game-start", payload });
                    },
                );
                socket.on(
                    "move-end" satisfies ConnectFour.MoveEndEvent["type"],
                    (payload: ConnectFour.MoveEndEvent["payload"]) => {
                        dispatch({ type: "move-end", payload });
                    },
                );
                socket.on(
                    "tie" satisfies ConnectFour.TieEvent["type"],
                    (payload: ConnectFour.TieEvent["payload"]) => {
                        dispatch({ type: "tie", payload });
                    },
                );

                socket.on(
                    "game-end" satisfies ConnectFour.GameEndEvent["type"],
                    (payload: ConnectFour.GameEndEvent["payload"]) => {
                        dispatch({ type: "game-end", payload });
                    },
                );
                if (selectedChain) {
                    socket.emit(
                        "join" satisfies ConnectFour.JoinEvent["type"],
                        {
                            player_id: player_user_id,
                            game_id: ConnectFour.gameId,
                            tier_id: tier_id,
                            chain_id: parseInt(selectedChain.chainId, 16),
                        } satisfies ConnectFour.JoinEvent["payload"],
                    );
                }
                return () => {
                    socket.disconnect();
                };
            }, []);

            const handleMove = (column: number) => () => {
                if (
                    gameState.state !== "ongoingMove" ||
                    gameState.moveSubmitted ||
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
                socketRef.current.emit(moveEvent.type, moveEvent.payload);
                dispatch({ type: "submit-move" });
            };

            const player = gameState.player;
            const enemy =
                gameState.state === "initial" ? undefined : gameState.enemy;
            console.dir(gameState);
            return (
                <main className="relative flex h-full flex-col justify-center bg-[radial-gradient(#ABABFC,#8B81F8,#7863F1,#3F2E81)] p-4">
                    <section className="grid w-full grid-cols-7 px-2">
                        {Array(ConnectFour.columnCount)
                            .fill(0)
                            .map((_, index) => (
                                <button
                                    key={index}
                                    className="block aspect-square w-full bg-blue-200/30 odd:bg-blue-200/25"
                                    onClick={handleMove(index)}
                                ></button>
                            ))}
                    </section>
                    <section className="relative grid w-full grid-cols-7 grid-rows-6 p-2 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:border-8 after:border-blue-700 after:shadow-[inset_0_0_0_1px_#1d4ed8]">
                        {gameState.board.flatMap((row, i) =>
                            row.map((cell) => <Cell value={cell} key={i} />),
                        )}
                    </section>
                    {enemy && (
                        <section className="absolute left-0 top-0 p-2">
                            <PlayerGameView
                                timerSeconds={ConnectFour.moveTime}
                                user_id={enemy.player_id}
                            />
                        </section>
                    )}
                    {player && (
                        <section className="absolute bottom-0 right-0 p-2">
                            <PlayerGameView
                                timerSeconds={ConnectFour.moveTime}
                                user_id={player.player_id}
                            />
                        </section>
                    )}

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
                </main>
            );
        }),
    {
        ssr: false,
    },
);

function Cell({ value }: { value: string | null }) {
    return (
        <article className="relative aspect-square size-full">
            <div className="connect-four-coin-mask absolute inset-0 bg-[linear-gradient(145deg,#a71919,#c61e1e)]" />
            <div className="connect-four-cell-mask absolute inset-0 bg-blue-700" />
        </article>
    );
}
