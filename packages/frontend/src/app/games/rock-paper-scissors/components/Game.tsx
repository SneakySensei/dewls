import { useEffect, useReducer } from "react";
import { Manager } from "socket.io-client";

import { MappedUser } from "@/utils/types";

export type Moves = "rock" | "paper" | "scissors";

export type GameState = {
  state: "waitingForPlayers" | "ongoingRound" | "roundEnd" | "gameEnd";
  round: number;
  player1?: { currentMove: Moves; currentScore: number } & MappedUser;
  player2?: { currentMove: Moves; currentScore: number } & MappedUser;
};

type Action = { type: "join" };

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "join":
      return state;

    default:
      return state;
  }
};

const socketManager = new Manager("localhost:8080", { withCredentials: true });
export default function Game() {
  const [gameState, dispatch] = useReducer(reducer, {
    state: "waitingForPlayers",
    round: 0,
  } as GameState);

  useEffect(() => {
    const socket = socketManager.socket("tic-tac-toe");
    socket.emit("waiting", { sessionId: "session1", userId: "sneakysensei" });
  }, []);
  return (
    <main className="h-full flex">
      <section className="flex-1 min-h-0">
        <button></button>
        <button></button>
        <button></button>
      </section>
      <hr className="border-black" />
      <section className="flex-1 min-h-0"></section>
    </main>
  );
}
