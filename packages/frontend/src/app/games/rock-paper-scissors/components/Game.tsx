"use client";

import { useEffect, useReducer, useRef } from "react";

import { RockPaperScissors, TIERS_IDS } from "common";
import { getSocketManager } from "@/utils/websockets";
import { Socket } from "socket.io-client";
import EnemyScreen from "./EnemyScreen";
import PlayerScreen from "./PlayerScreen";

type Props = {
  user_id: string;
  tier: TIERS_IDS;
};

type PlayerState = {
  currentMove: RockPaperScissors.Move;
  currentScore: number;
  user_id: string;
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

export default function Game({ tier, user_id: player_user_id }: Props) {
  const reducer = (
    gameState: GameState,
    action: RockPaperScissors.SERVER_EVENTS | { type: "next-round" }
  ): GameState => {
    switch (action.type) {
      case "player-joined": {
        const { room_id, user_id } = action.payload;
        if (user_id === player_user_id) {
          return {
            ...gameState,
            state: "waiting",
            player: { currentMove: "rock", currentScore: 0, user_id },
            room_id,
          };
        }
        return {
          ...gameState,
          state: "waiting",
          room_id,
          enemy: { currentMove: "rock", currentScore: 0, user_id },
        };
      }

      // ? Possible the game start fires before player joined event
      case "game-start": {
        const { round, player1, player2 } = action.payload;
        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;

        if (gameState.state === "waiting") {
          return {
            ...gameState,
            state: "ongoingRound",
            round,
            player: {
              currentMove: "rock",
              currentScore: player.currentScore,
              user_id: player.user_id,
            },
            enemy: {
              currentMove: "rock",
              currentScore: enemy.currentScore,
              user_id: enemy.user_id,
            },
          };
        }
        break;
      }
      case "round-end": {
        const { round, player1, player2, winner_id } = action.payload;

        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;

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

        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;
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
    player: { currentMove: "rock", currentScore: 0, user_id: player_user_id },
  });

  const socketRef = useRef<Socket>(
    getSocketManager().socket(`/${RockPaperScissors.slug}`, {
      auth: {
        // token,
      },
    })
  );

  useEffect(() => {
    socketRef.current.on("connect_error", (err) => {
      console.log(err.message); // prints the message associated with the error
    });

    socketRef.current.on("error", (err) => {
      console.error(err); // prints the message associated with the error
    });

    socketRef.current.onAny((event, ...args) => {
      console.log("rx event", event, args);
    });
    socketRef.current.onAnyOutgoing((event, ...args) => {
      console.log("tx event", event, args);
    });
    socketRef.current.on(
      "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
      (payload: RockPaperScissors.PlayerJoinedEvent["payload"]) => {
        dispatch({ type: "player-joined", payload });
      }
    );
    socketRef.current.on(
      "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
      (payload: RockPaperScissors.GameStartEvent["payload"]) => {
        dispatch({ type: "game-start", payload });
      }
    );
    socketRef.current.on(
      "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
      (payload: RockPaperScissors.RoundEndEvent["payload"]) => {
        dispatch({ type: "round-end", payload });
        setTimeout(() => {
          dispatch({ type: "next-round" });
        }, 5000);
      }
    );
    socketRef.current.on(
      "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
      (payload: RockPaperScissors.GameEndEvent["payload"]) => {
        dispatch({ type: "game-end", payload });
      }
    );

    socketRef.current.emit(
      "join" satisfies RockPaperScissors.JoinEvent["type"],
      {
        season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
        user_id: player_user_id,
        game_id: RockPaperScissors.gameId,
        tier_id: tier,
      } satisfies RockPaperScissors.JoinEvent["payload"]
    );

    return () => {
      socketRef.current.disconnect();
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
              ? gameState.winner_id === gameState.player.user_id
                ? "You win the round!"
                : "Enemy wins the round!"
              : "Draw!"}
          </h2>
        )}
        {gameState.state === "gameEnd" && (
          <h2 className="text-display-2">
            {gameState.winner_id === gameState.player.user_id
              ? "You win!"
              : "Enemy wins!"}
          </h2>
        )}
      </section>
    </main>
  );
}
