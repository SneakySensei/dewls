"use client";

import { useEffect, useReducer, useRef } from "react";

import { RockPaperScissors, TIERS_IDS } from "common";
import { getSocketManager } from "@/utils/websockets";
import { Socket } from "socket.io-client";
import EnemyScreen from "./EnemyScreen";
import PlayerScreen from "./PlayerScreen";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import dynamic from "next/dynamic";

type Props = {
  tier: TIERS_IDS;
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
      state: "ongoingRound";
      room_id: string;
      round: number;
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
    Promise.resolve(function Game({ tier }: Props) {
      const { user } = useWeb3AuthContext();

      const player_user_id = user!.data.player_id;
      const player_token = user!.token;

      const reducer = (
        gameState: GameState,
        action: RockPaperScissors.SERVER_EVENTS | { type: "next-round" }
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
            return {
              ...gameState,
              state: "waiting",
              room_id,
              enemy: {
                currentMove: "rock",
                currentScore: 0,
                player_id: player_id,
              },
            };
          }

          // ? Possible the game start fires before player joined event
          case "game-start": {
            const { round, player1, player2 } = action.payload;
            const player =
              player1.player_id === player_user_id ? player1 : player2;
            const enemy =
              player1.player_id !== player_user_id ? player1 : player2;

            if (gameState.state === "waiting") {
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
          case "round-end": {
            const { round, player1, player2, winner_id } = action.payload;

            const player =
              player1.player_id === player_user_id ? player1 : player2;
            const enemy =
              player1.player_id !== player_user_id ? player1 : player2;

            if (
              gameState.state === "ongoingRound" &&
              player.currentMove &&
              enemy.currentMove
            ) {
              return {
                ...gameState,
                state: "roundEnd",
                round,
                player: { ...player, currentMove: player.currentMove },
                enemy: { ...enemy, currentMove: enemy.currentMove },
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
                enemy: { ...gameState.enemy, currentMove: "rock" },
                player: { ...gameState.player, currentMove: "rock" },
                room_id: gameState.room_id,
              };
            }

            break;
          }
          case "game-end": {
            const { player1, player2, round, winner_id } = action.payload;

            const player =
              player1.player_id === player_user_id ? player1 : player2;
            const enemy =
              player1.player_id !== player_user_id ? player1 : player2;
            if (
              gameState.state === "ongoingRound" &&
              player.currentMove &&
              enemy.currentMove
            ) {
              return {
                ...gameState,
                state: "gameEnd",
                round,
                player: { ...player, currentMove: player.currentMove },
                enemy: { ...enemy, currentMove: enemy.currentMove },
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

      const socketRef = useRef<Socket>(
        getSocketManager().socket(`/${RockPaperScissors.slug}`, {
          auth: {
            token: player_token,
          },
        })
      );

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
          "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
          (payload: RockPaperScissors.PlayerJoinedEvent["payload"]) => {
            dispatch({ type: "player-joined", payload });
          }
        );
        socket.on(
          "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
          (payload: RockPaperScissors.GameStartEvent["payload"]) => {
            dispatch({ type: "game-start", payload });
          }
        );
        socket.on(
          "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
          (payload: RockPaperScissors.RoundEndEvent["payload"]) => {
            dispatch({ type: "round-end", payload });
            setTimeout(() => {
              dispatch({ type: "next-round" });
            }, 5000);
          }
        );
        socket.on(
          "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
          (payload: RockPaperScissors.GameEndEvent["payload"]) => {
            dispatch({ type: "game-end", payload });
          }
        );

        socket.emit(
          "join" satisfies RockPaperScissors.JoinEvent["type"],
          {
            player_id: player_user_id,
            game_id: RockPaperScissors.gameId,
            tier_id: tier,
          } satisfies RockPaperScissors.JoinEvent["payload"]
        );

        return () => {
          socket.disconnect();
        };
      }, []);

      return (
        <main className="relative h-full flex flex-col bg-neutral-100">
          <EnemyScreen gameState={gameState} />
          <PlayerScreen
            gameState={gameState}
            socket={socketRef.current}
            tier={tier}
          />

          {/* Middle text banner */}
          <section className="absolute top-1/2 p-1 text-center left-0 w-full -translate-y-1/2 bg-neutral-500">
            {gameState.state === "ongoingRound" && (
              <h2 className="text-display-2">Round {gameState.round + 1}</h2>
            )}
            {gameState.state === "roundEnd" && (
              <h2 className="text-display-2">
                {gameState.winner_id
                  ? gameState.winner_id === gameState.player.player_id
                    ? "You win the round!"
                    : "Enemy wins the round!"
                  : "Draw!"}
              </h2>
            )}
            {gameState.state === "gameEnd" && (
              <h2 className="text-display-2">
                {gameState.winner_id === gameState.player.player_id
                  ? "You win!"
                  : "Enemy wins!"}
              </h2>
            )}
          </section>
        </main>
      );
    }),
  {
    ssr: false,
  }
);
