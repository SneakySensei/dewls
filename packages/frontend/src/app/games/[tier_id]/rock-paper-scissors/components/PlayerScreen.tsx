import { GameState } from "./Game";
import MoveImage, { MOVE_IMAGE_MAP } from "./MoveImage";
import EllipsisLoader from "@/shared/EllipsisLoader";
import PlayerGameView from "@/shared/PlayerGameView";
import StarIcon from "@/shared/icons/StarIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { RockPaperScissors } from "common";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Socket } from "socket.io-client";

type PlayerScreenProps = {
    gameState: GameState;
    socket: Socket;
    onSubmitMove: () => void;
};

export default function PlayerScreen({
    gameState,
    socket,
    onSubmitMove,
}: PlayerScreenProps) {
    const { selectedChain } = useSelectedChainContext();

    const handleMove = (move: RockPaperScissors.Move) => {
        if (
            gameState.state !== "ongoingRound" ||
            gameState.moveSubmitted ||
            !selectedChain
        )
            return;
        const moveEvent: RockPaperScissors.MoveEvent = {
            type: "move",
            payload: {
                room_id: gameState.room_id,
                player_id: gameState.player.player_id,
                move,
                chain_id: parseInt(selectedChain.chainId, 16),
            },
        };
        socket.emit(moveEvent.type, moveEvent.payload);
        onSubmitMove();
    };

    const handleTimerEnd = () => {
        // Player didn't perform move on time
        handleMove("skipped");
    };

    const player = gameState.player;

    const moveState =
        (gameState.state === "roundEnd" || gameState.state === "gameEnd") &&
        gameState.winner_id
            ? gameState.winner_id === gameState.player.player_id
                ? "win"
                : "lose"
            : "idle";

    return (
        <section className="relative z-0 grid min-h-0 flex-1 items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_center_top,_#60a5fa_0%,_#1d4ed8_100%)]">
            <span className="absolute inset-0 -z-10 bg-polkadots bg-fixed" />
            {player && (
                <>
                    {/* <div className="absolute left-0 top-0 h-auto w-full">
                        <pre>{JSON.stringify(gameState, null, 2)}</pre>
                    </div> */}
                    <div className="mb-12">
                        <MoveImage
                            move={player.currentMove}
                            state={moveState}
                            deciding={gameState.state === "ongoingRound"}
                        />
                    </div>

                    <div className="absolute left-1/2 top-0 mt-12 flex -translate-x-1/2 items-center justify-center gap-x-1">
                        {Array.from(
                            Array(RockPaperScissors.winScore),
                            (_, index) => index,
                        ).map((scoreThreshold) => (
                            <StarIcon
                                key={scoreThreshold}
                                className="size-6"
                                solid={player.currentScore > scoreThreshold}
                            />
                        ))}
                    </div>

                    <section className="absolute bottom-0 right-0 items-end space-y-6 p-2">
                        {/* CONTROLS */}
                        <AnimatePresence>
                            {gameState.state === "ongoingRound" &&
                                !gameState.moveSubmitted && (
                                    <motion.section
                                        initial="hidden"
                                        animate="show"
                                        exit="hidden"
                                        transition={{ staggerChildren: 0.1 }}
                                        className="flex w-auto flex-col-reverse items-end gap-y-3 overflow-x-hidden"
                                    >
                                        {(
                                            [
                                                "scissors",
                                                "paper",
                                                "rock",
                                            ] satisfies RockPaperScissors.Move[]
                                        ).map((action) => (
                                            <motion.button
                                                variants={{
                                                    hidden: {
                                                        x: "100%",
                                                        opacity: 0,
                                                    },
                                                    show: { x: 0, opacity: 1 },
                                                }}
                                                key={action}
                                                className="block size-14 rounded-full border border-neutral-400 bg-black/50 p-2 shadow-md"
                                                onClick={() =>
                                                    handleMove(action)
                                                }
                                            >
                                                <Image
                                                    alt={action}
                                                    src={MOVE_IMAGE_MAP[action]}
                                                />
                                            </motion.button>
                                        ))}
                                    </motion.section>
                                )}
                        </AnimatePresence>
                        <PlayerGameView
                            user_id={player.player_id}
                            timerSeconds={RockPaperScissors.roundTime}
                            showTimer={
                                gameState.state === "ongoingRound" &&
                                !gameState.moveSubmitted
                            }
                            onTimerEnd={handleTimerEnd}
                        />
                    </section>
                </>
            )}
            {!player && (
                <motion.h2
                    animate={{
                        opacity: [0, 1, 0],
                        transition: {
                            type: "tween",
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear",
                        },
                    }}
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-display-1"
                >
                    Joining game
                    <EllipsisLoader />
                </motion.h2>
            )}
        </section>
    );
}
