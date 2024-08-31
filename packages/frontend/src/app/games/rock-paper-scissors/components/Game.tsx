import { useEffect, useReducer } from "react";

import { MappedUser } from "@/utils/types";
import { GAME_NAMESPACES, GAMES, TIERS } from "common";
import { getSocketManager } from "@/utils/websockets";

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

type Props = {
  tier: TIERS;
};

export default function Game({ tier }: Props) {
  const [gameState, dispatch] = useReducer(reducer, {
    state: "waitingForPlayers",
    round: 0,
  } as GameState);

  useEffect(() => {
    const socketManager = getSocketManager();
    const socket = socketManager.socket(
      `/${GAME_NAMESPACES.ROCK_PAPER_SCISSORS}`
    );
    socket.emit("waiting", {
      season_id: "season1",
      user_id: "sneakysensei",
      game_id: GAMES[GAME_NAMESPACES.ROCK_PAPER_SCISSORS].gameId,
      tier_id: tier,
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="h-full flex">
      <section className="flex-1 min-h-0">
        <h1>Player 1</h1>
        <button>Rock</button>
        <button>Paper</button>
        <button>Scissor</button>
      </section>
      <hr className="border-black" />
      <section className="flex-1 min-h-0">
        <h1>Player 2</h1>
        <button>Rock</button>
        <button>Paper</button>
        <button>Scissor</button>
      </section>
    </main>
  );
}
