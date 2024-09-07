import { GameState } from "./Game";
import Countdown from "@/shared/Countdown";
import EllipsisLoader from "@/shared/EllipsisLoader";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Announcements({ gameState }: { gameState: GameState }) {
    const [showActivePlayerAnnouncement, setShowActivePlayerAnnouncement] =
        useState(false);

    const activePlayer =
        gameState.state === "ongoingMove" ? gameState.active_player : undefined;
    useEffect(() => {
        if (activePlayer) {
            setShowActivePlayerAnnouncement(true);
        } else {
            setShowActivePlayerAnnouncement(false);
        }
    }, [activePlayer]);

    return (
        <div className="absolute left-1/2 top-1/2 z-50 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden p-2 text-center text-display-2">
            {gameState.state === "waiting" && (
                <div className="rounded-lg bg-black px-3 py-1">
                    Waiting for opponent
                    <EllipsisLoader />
                </div>
            )}
            {gameState.state === "gameEnd" && (
                <div className="rounded-lg bg-black px-3 py-1">
                    {gameState.winner_id === gameState.player.player_id ? (
                        <>
                            You win! Finalizing...
                            <Countdown timeSeconds={3} />
                        </>
                    ) : (
                        <>
                            Enemy wins! Finalizing...
                            <Countdown timeSeconds={3} />
                        </>
                    )}
                </div>
            )}

            {gameState.state === "tie" && (
                <div className="rounded-lg bg-black px-3 py-1">
                    Draw! Resetting board...
                    <Countdown timeSeconds={3} />
                </div>
            )}

            <AnimatePresence>
                {showActivePlayerAnnouncement && (
                    <motion.div
                        initial={{ x: "20%", opacity: 0 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            transition: { duration: 0.2 },
                        }}
                        exit={{
                            x: "-20%",
                            opacity: 0,
                            transition: { delay: 2, duration: 0.2 },
                        }}
                        onAnimationComplete={() =>
                            setShowActivePlayerAnnouncement(false)
                        }
                        className="rounded-lg bg-black px-3 py-1"
                    >
                        {gameState.state === "ongoingMove" && (
                            <h2>
                                {gameState.active_player ===
                                gameState.player.player_id
                                    ? "Your turn"
                                    : "Enemy's turn"}
                            </h2>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
