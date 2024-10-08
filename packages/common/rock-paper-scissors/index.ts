export const slug = "rock-paper-scissors";
export const gameId = "ef392e1a-673c-4f6c-a259-20cff47d1dd9";
export const winScore = 3;
export const roundTime = 10;

export type Move = "rock" | "paper" | "scissors" | "skipped";

export type JoinEvent = {
  type: "join";
  payload: {
    player_id: string;
    game_id: string;
    tier_id: string;
    chain_id: number;
  };
};

export type StakedEvent = {
  type: "staked";
  payload: {
    player_id: string;
    room_id: string;
    tier_id: string;
  };
};

export type MoveEvent = {
  type: "move";
  payload: {
    player_id: string;
    room_id: string;
    move: Move;
    chain_id: number;
  };
};

export type CLIENT_EVENTS = JoinEvent | StakedEvent | MoveEvent;

export type PlayerJoinedEvent = {
  type: "player-joined";
  payload: {
    player_id: string;
    room_id: string;
  };
};

export type StakingEvent = {
  type: "staking";
  payload: {
    round: 0;
    player1: PlayerServerState;
    player2: PlayerServerState;
  };
};

export type GameStartEvent = {
  type: "game-start";
  payload: {
    round: 0;
    player1: PlayerServerState;
    player2: PlayerServerState;
  };
};

export type RoundEndEvent = {
  type: "round-end";
  payload: {
    round: number;
    winner_id: string | null;
    player1: PlayerServerState;
    player2: PlayerServerState;
  };
};

export type GameEndEvent = {
  type: "game-end";
  payload: {
    round: number;
    winner_id: string;
    player1: PlayerServerState;
    player2: PlayerServerState;
  };
};

export type SERVER_EVENTS =
  | PlayerJoinedEvent
  | StakingEvent
  | GameStartEvent
  | RoundEndEvent
  | GameEndEvent;

export type ServerGameState = {
  round: number;
  winner_id: string | null;
  player1: PlayerServerState;
  player2: PlayerServerState;
};

export type PlayerServerState = {
  currentMove: Move | null;
  currentScore: number;
  player_id: string;
  staked: boolean;
};
