export const slug = "rock-paper-scissors";
export const gameId = "ef392e1a-673c-4f6c-a259-20cff47d1dd9" as const;

export const winScore = 3;

export type Move = "rock" | "paper" | "scissors";

export type CLIENT_EVENTS =
  | {
      type: "join";
      payload: {
        season_id: string;
        user_id: string;
        game_id: string;
        tier_id: string;
      };
    }
  | {
      type: "move";
      payload: {
        user_id: string;
        room_id: string;
        move: Move;
      };
    };

export type SERVER_EVENTS =
  | {
      type: "player-joined";
      payload: {
        user_id: string;
        room_id: string;
      };
    }
  | {
      type: "game-start";
      payload: {
        round: 0;
        player1: IdlePlayerServerState;
        player2: IdlePlayerServerState;
      };
    }
  | {
      // clear moves on redis when sending this event to prepare for next round
      type: "round-end";
      payload: {
        round: number;
        winner_id: string | null;
        player1: MovedPlayerServerState;
        player2: MovedPlayerServerState;
      };
    }
  | {
      type: "game-end";
      payload: {
        round: number;
        winner_id: string;
        player1: MovedPlayerServerState;
        player2: MovedPlayerServerState;
      };
    };

export type ServerGameState = {
  round: number;
  winnner_id: string | null;
  player1: IdlePlayerServerState | MovedPlayerServerState;
  player2: IdlePlayerServerState | MovedPlayerServerState;
};

export type IdlePlayerServerState = {
  currentMove: null;
  currentScore: number;
  user_id: string;
};

export type MovedPlayerServerState = {
  currentMove: Move;
  currentScore: number;
  user_id: string;
};
