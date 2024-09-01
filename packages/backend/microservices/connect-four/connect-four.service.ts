import { ConnectFour } from "common";
import { Board } from "common/connect-four";

const checkDirection = (
    user_id: string,
    [a, b, c, d]: [
        ConnectFour.BoardCellState,
        ConnectFour.BoardCellState,
        ConnectFour.BoardCellState,
        ConnectFour.BoardCellState,
    ],
): boolean => {
    return a === user_id && a == b && a == c && a == d;
};

export const checkWinner = (
    board: ConnectFour.Board,
    user_id: string,
): boolean => {
    // * INFO: check down
    for (let r = 0; r <= ConnectFour.rowCount - ConnectFour.winCount; r++)
        for (let c = 0; c < ConnectFour.columnCount; c++)
            if (
                checkDirection(user_id, [
                    board[r][c],
                    board[r + 1][c],
                    board[r + 2][c],
                    board[r + 3][c],
                ])
            ) {
                return true;
            }

    // * INFO: check right
    for (let r = 0; r < ConnectFour.rowCount; r++)
        for (
            let c = 0;
            c <= ConnectFour.columnCount - ConnectFour.winCount;
            c++
        )
            if (
                checkDirection(user_id, [
                    board[r][c],
                    board[r][c + 1],
                    board[r][c + 2],
                    board[r][c + 3],
                ])
            ) {
                return true;
            }

    // * INFO: check down-right
    for (let r = 0; r <= ConnectFour.rowCount - ConnectFour.winCount; r++)
        for (
            let c = 0;
            c <= ConnectFour.columnCount - ConnectFour.winCount;
            c++
        )
            if (
                checkDirection(user_id, [
                    board[r][c],
                    board[r + 1][c + 1],
                    board[r + 2][c + 2],
                    board[r + 3][c + 3],
                ])
            ) {
                return true;
            }

    // * INFO: check down-left
    for (let r = ConnectFour.winCount - 1; r < ConnectFour.rowCount; r++)
        for (
            let c = 0;
            c <= ConnectFour.columnCount - ConnectFour.winCount;
            c++
        )
            if (
                checkDirection(user_id, [
                    board[r][c],
                    board[r - 1][c + 1],
                    board[r - 2][c + 2],
                    board[r - 3][c + 3],
                ])
            ) {
                return true;
            }

    return false;
};

export const checkTie = (board: Board): boolean => {
    for (let j = 0; j < ConnectFour.columnCount; j++) {
        if (board[0][j] === null) {
            return false;
        }
    }

    return true;
};
