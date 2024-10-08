export const slug = "connect-four";
export const gameId = "94c14ce2-2110-4787-ab82-ec2945567f42";
export const rowCount = 6;
export const columnCount = 7;
export const winCount = 4;
export const moveTime = 30;

export type Move = {
  column: number;
};

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
  payload: Pick<
    ServerGameState,
    "active_player" | "board" | "player1" | "player2"
  >;
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
  | StakingEvent
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
  player_id: string;
  staked: boolean;
};

export const emptyBoard: Board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

const checkDirection = (
  user_id: string,
  [a, b, c, d]: [BoardCellState, BoardCellState, BoardCellState, BoardCellState]
): boolean => {
  return a === user_id && a == b && a == c && a == d;
};

export const getWinner = (
  board: Board,
  user_id: string
):
  | [
      {
        i: number;
        j: number;
      },
      {
        i: number;
        j: number;
      },
      {
        i: number;
        j: number;
      },
      {
        i: number;
        j: number;
      },
    ]
  | null => {
  // * INFO: check down
  for (let r = 0; r <= rowCount - winCount; r++)
    for (let c = 0; c < columnCount; c++)
      if (
        checkDirection(user_id, [
          board[r][c],
          board[r + 1][c],
          board[r + 2][c],
          board[r + 3][c],
        ])
      ) {
        return [
          { i: r, j: c },
          { i: r + 2, j: c },
          { i: r + 1, j: c },
          { i: r + 3, j: c },
        ];
      }

  // * INFO: check right
  for (let r = 0; r < rowCount; r++)
    for (let c = 0; c <= columnCount - winCount; c++)
      if (
        checkDirection(user_id, [
          board[r][c],
          board[r][c + 1],
          board[r][c + 2],
          board[r][c + 3],
        ])
      ) {
        return [
          { i: r, j: c },
          { i: r, j: c + 1 },
          { i: r, j: c + 2 },
          { i: r, j: c + 3 },
        ];
      }

  // * INFO: check down-right
  for (let r = 0; r <= rowCount - winCount; r++)
    for (let c = 0; c <= columnCount - winCount; c++)
      if (
        checkDirection(user_id, [
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ])
      ) {
        return [
          { i: r, j: c },
          { i: r + 1, j: c + 1 },
          { i: r + 2, j: c + 2 },
          { i: r + 3, j: c + 3 },
        ];
      }

  // * INFO: check down-left
  for (let r = winCount - 1; r < rowCount; r++)
    for (let c = 0; c <= columnCount - winCount; c++)
      if (
        checkDirection(user_id, [
          board[r][c],
          board[r - 1][c + 1],
          board[r - 2][c + 2],
          board[r - 3][c + 3],
        ])
      ) {
        return [
          { i: r, j: c },
          { i: r - 1, j: c + 1 },
          { i: r - 2, j: c + 2 },
          { i: r - 3, j: c + 3 },
        ];
      }

  return null;
};

export const checkTie = (board: Board): boolean => {
  for (let j = 0; j < columnCount; j++) {
    if (board[0][j] === null) {
      return false;
    }
  }

  return true;
};
