export const slug = "rock-paper-scissors";
export const gameId = "ef392e1a-673c-4f6c-a259-20cff47d1dd9";
export const winScore = 3;

export type Move = "rock" | "paper" | "scissors";

export type JoinEvent = {
  type: "join";
  payload: {
    season_id: string;
    user_id: string;
    game_id: string;
    tier_id: string;
  };
};

export type MoveEvent = {
  type: "move";
  payload: {
    user_id: string;
    room_id: string;
    move: Move;
  };
};

export type CLIENT_EVENTS = JoinEvent | MoveEvent;

export type PlayerJoinedEvent = {
  type: "player-joined";
  payload: {
    user_id: string;
    room_id: string;
  };
};

export type GameStartEvent = {
  type: "game-start";
  payload: {
    round: 0;
    player1: IdlePlayerServerState;
    player2: IdlePlayerServerState;
  };
};

export type RoundEndEvent = {
  type: "round-end";
  payload: {
    round: number;
    winner_id: string | null;
    player1: MovedPlayerServerState;
    player2: MovedPlayerServerState;
  };
};

export type GameEndEvent = {
  type: "game-end";
  payload: {
    round: number;
    winner_id: string;
    player1: MovedPlayerServerState;
    player2: MovedPlayerServerState;
  };
};

export type SERVER_EVENTS =
  | PlayerJoinedEvent
  | GameStartEvent
  | RoundEndEvent
  | GameEndEvent;

export type ServerGameState = {
  round: number;
  winner_id: string | null;
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
