export const slug = "connect-four";
export const gameId = "94c14ce2-2110-4787-ab82-ec2945567f42";
export const rowCount = 6;
export const columnCount = 7;
export const winCount = 4;

export type Move = {
  column: number;
};

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
  payload: Pick<
    ServerGameState,
    "active_player" | "board" | "player1" | "player2"
  >;
};

export type MoveEndEvent = {
  type: "move-end";
  payload: Pick<
    ServerGameState,
    "active_player" | "board" | "player1" | "player2"
  >;
};

export type TieEvent = {
  type: "tie";
  payload: Pick<
    ServerGameState,
    "active_player" | "board" | "player1" | "player2"
  >;
};

export type GameEndEvent = {
  type: "game-end";
  payload: ServerGameState & {
    winner_id: string;
  };
};

export type SERVER_EVENTS =
  | PlayerJoinedEvent
  | GameStartEvent
  | MoveEndEvent
  | TieEvent
  | GameEndEvent;

export type ServerGameState = {
  winner_id: string | null;
  active_player: string;
  player1: PlayerServerState;
  player2: PlayerServerState;
  board: Board;
};

export type BoardCellState = string | null;

export type BoardRow = [
  BoardCellState,
  BoardCellState,
  BoardCellState,
  BoardCellState,
  BoardCellState,
  BoardCellState,
  BoardCellState,
];

export type Board = [
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
];

export type PlayerServerState = {
  currentMove: Move | null;
  user_id: string;
};

export const emptyBoard: Board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];
