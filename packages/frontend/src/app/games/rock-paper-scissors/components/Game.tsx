import { useEffect, useReducer } from "react";

import { RockPaperScissors, TIERS_IDS } from "common";
import { getSocketManager } from "@/utils/websockets";

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
      state: "ongoingRound" | "roundEnd" | "gameEnd";
      room_id: string;
      round: number;
      player: PlayerState;
      enemy: PlayerState;
    };

export default function Game({ tier, user_id: player_user_id }: Props) {
  const reducer = (
    state: GameState,
    action: RockPaperScissors.SERVER_EVENTS
  ): GameState => {
    switch (action.type) {
      case "player-joined":
        const { room_id, user_id } = action.payload;
        if (user_id === player_user_id) {
          return {
            ...state,
            state: "waiting",
            player: { currentMove: "rock", currentScore: 0, user_id },
            room_id,
          };
        } else {
          return {
            ...state,
            state: "waiting",
            room_id,
            enemy: { currentMove: "rock", currentScore: 0, user_id },
          };
        }

      case "game-start":
        const {} = action.payload;
      default:
        return state;
    }
  };
  const [gameState, dispatch] = useReducer(reducer, {
    state: "initial",
    player: { currentMove: "rock", currentScore: 0, user_id: player_user_id },
  });

  useEffect(() => {
    const socketManager = getSocketManager();
    const socket = socketManager.socket(`/${RockPaperScissors.slug}`);

    socket.on(
      "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
      (args: RockPaperScissors.PlayerJoinedEvent["payload"]) => {
        const { room_id, user_id } = args;
        if (user_id !== player_user_id) {
        }
      }
    );
    socket.on(
      "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
      (args: RockPaperScissors.GameStartEvent["payload"]) => {}
    );
    socket.on(
      "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
      (args: RockPaperScissors.RoundEndEvent["payload"]) => {}
    );
    socket.on(
      "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
      (args: RockPaperScissors.GameEndEvent["payload"]) => {}
    );

    socket.emit(
      "join" satisfies RockPaperScissors.JoinEvent["type"],
      {
        season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
        user_id: player_user_id,
        game_id: RockPaperScissors.gameId,
        tier_id: tier,
      } satisfies RockPaperScissors.JoinEvent["payload"]
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="h-full flex bg-neutral-100">
      User: {player_user_id}
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
