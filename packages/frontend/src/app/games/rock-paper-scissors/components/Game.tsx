import { useEffect, useReducer } from "react";

import { RockPaperScissors, TIERS_IDS } from "common";
import { getSocketManager } from "@/utils/websockets";

type Props = {
  user_id: string;
  tier: TIERS_IDS;
};

export default function Game({ tier, user_id }: Props) {
  const [gameState, dispatch] = useReducer(reducer, {
    state: "waiting",
    player: {},
  } as GameState);

  useEffect(() => {
    const socketManager = getSocketManager();
    const socket = socketManager.socket(`/${RockPaperScissors.slug}`);
    socket.onAny((event, ...args) => {
      console.log("rx event", event, args);
    });
    socket.on("player-joined", (args: { user_id: string }) => {
      console.log(args);
    });

    socket.emit("join", {
      season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
      user_id,
      game_id: RockPaperScissors.gameId,
      tier_id: tier,
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="h-full flex">
      User: {user_id}
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

type PlayerState = {
  currentMove: RockPaperScissors.Move;
  currentScore: number;
  user_id: string;
};
export type GameState =
  | {
      state: "waiting";
      player: PlayerState;
    }
  | {
      room_id: string;
      state: "ongoingRound" | "roundEnd" | "gameEnd";
      round: number;
      player: PlayerState;
      enemy: PlayerState;
    };

type Action =
  | { type: "player-joined"; payload: { room_id: string } }
  | { type: "enemy-joined"; payload: { user_id: string } };

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "player-joined":

    case "enemy-joined":
    default:
      return state;
  }
};
