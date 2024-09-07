import { GameState } from "./Game";
import clsx from "clsx";
import { ConnectFour } from "common";
import { motion } from "framer-motion";
import {
    Dispatch,
    memo,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

type Props = {
    gameState: GameState;
    onMove: (columnIndex: number) => void;
};
export default memo(function Board({ gameState, onMove }: Props) {
    const [isAnimating, setIsAnimating] = useState(false);

    const previousBoardState = useRef(ConnectFour.emptyBoard);

    const player = gameState.player;

    useEffect(() => {
        previousBoardState.current = gameState.board;
    }, [gameState.board]);

    const newlyAddedPosition = findDifference(
        previousBoardState.current,
        gameState.board,
    );

    console.log("boardUpdate", newlyAddedPosition);

    const winningSet =
        gameState.state === "gameEnd"
            ? ConnectFour.getWinner(gameState.board, gameState.winner_id)?.map(
                  ({ i, j }) => `${i},${j}` as const,
              )
            : null;

    return (
        <>
            <section className="grid w-full grid-cols-7 px-2">
                {Array(ConnectFour.columnCount)
                    .fill(0)
                    .map((_, index) => (
                        <button
                            key={index}
                            disabled={
                                gameState.state !== "ongoingMove" ||
                                gameState.active_player !== player.player_id ||
                                gameState.moveSubmitted
                            }
                            className="block aspect-square w-full bg-blue-200/30 odd:bg-blue-200/25 disabled:opacity-0"
                            onClick={() => onMove(index)}
                        ></button>
                    ))}
            </section>
            <section className="relative grid w-full grid-cols-7 grid-rows-6 p-2 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:border-8 after:border-blue-700 after:shadow-[inset_0_0_0_1px_#1d4ed8]">
                {gameState.board.flatMap((row, i) =>
                    row.map((cell, j) => (
                        <Cell
                            gameState={gameState}
                            value={cell}
                            position={{ i, j }}
                            key={`${i},${j}`}
                            animate={
                                !!(
                                    newlyAddedPosition &&
                                    i === newlyAddedPosition.i &&
                                    j === newlyAddedPosition.j
                                )
                            }
                            isWinningCell={
                                !!(
                                    winningSet &&
                                    winningSet.includes(`${i},${j}`)
                                )
                            }
                            isAnimating={isAnimating}
                            setIsAnimating={setIsAnimating}
                        />
                    )),
                )}
            </section>
        </>
    );
});

function Cell({
    value,
    gameState,
    animate,
    isWinningCell,
    position,
    isAnimating,
    setIsAnimating,
}: {
    value: ConnectFour.BoardCellState;
    gameState: GameState;
    animate: boolean;
    isWinningCell: boolean;
    position: { i: number; j: number };
    isAnimating: boolean;
    setIsAnimating: Dispatch<SetStateAction<boolean>>;
}) {
    const isPlayerOccupied = gameState.player.player_id === value;
    const isEnemyOccupied =
        gameState.state !== "initial" && gameState.enemy?.player_id === value;
    return (
        <article className="relative aspect-square size-full">
            <div className="connect-four-cell-mask absolute inset-0 scale-[85%] bg-blue-800" />
            {(isPlayerOccupied || isEnemyOccupied) && (
                <motion.div
                    initial={
                        animate ? { y: `${-100 * position.i + 2}%` } : false
                    }
                    animate={{ y: 0 }}
                    onAnimationStart={() => setIsAnimating(true)}
                    onAnimationComplete={() => setIsAnimating(false)}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.5,
                        velocity: 2,
                    }}
                    className={clsx(
                        "connect-four-coin-mask absolute inset-0",
                        isEnemyOccupied &&
                            "bg-[linear-gradient(145deg,#a71919,#c61e1e)]",
                        isPlayerOccupied &&
                            "bg-[linear-gradient(145deg,#e2ac20,#ffcc27)]",
                        !isAnimating && isWinningCell && "animate-blink",
                    )}
                />
            )}
            <div className="connect-four-cell-mask absolute inset-0 z-10 bg-blue-700" />
        </article>
    );
}

function findDifference(
    previous: ConnectFour.Board,
    current: ConnectFour.Board,
): { i: number; j: number } | null {
    const rows = previous.length;
    const cols = previous[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (previous[i][j] !== current[i][j]) {
                return { i, j };
            }
        }
    }

    return null; // Boards are identical
}
