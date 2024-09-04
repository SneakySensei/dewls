import { GameState } from "./Game";
import MoveImage from "./MoveImage";
import EllipsisLoader from "@/shared/EllipsisLoader";
import PlayerGameView from "@/shared/PlayerGameView";
import StarIcon from "@/shared/icons/StarIcon";
import { RockPaperScissors } from "common";
import { motion } from "framer-motion";

type EnemyScreenProps = {
    gameState: GameState;
};

export default function EnemyScreen({ gameState }: EnemyScreenProps) {
    const enemy = gameState.state === "initial" ? undefined : gameState.enemy;

    const moveState =
        (gameState.state === "roundEnd" || gameState.state === "gameEnd") &&
        gameState.winner_id
            ? gameState.winner_id === gameState.player.player_id
                ? "lose"
                : "win"
            : "idle";

    return (
        <section className="relative z-0 grid min-h-0 flex-1 items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_center_bottom,_#f87171_0%,_#d71e1e_100%)]">
            <span className="absolute inset-0 -z-10 bg-polkadots bg-fixed" />
            {enemy && (
                <>
                    <div className="mt-12">
                        <MoveImage
                            move={enemy.currentMove}
                            isEnemy
                            state={moveState}
                            deciding={gameState.state === "ongoingRound"}
                        />
                    </div>
                    <div className="absolute bottom-0 left-1/2 mb-12 flex -translate-x-1/2 items-center justify-center gap-x-1">
                        {Array.from(
                            Array(RockPaperScissors.winScore),
                            (_, index) => index,
                        ).map((scoreThreshold) => (
                            <StarIcon
                                key={scoreThreshold}
                                className="size-6"
                                solid={enemy.currentScore > scoreThreshold}
                            />
                        ))}
                    </div>

                    <section className="absolute left-0 top-0 flex flex-col items-end gap-y-6 p-2">
                        <PlayerGameView
                            user_id={enemy.player_id}
                            timerSeconds={RockPaperScissors.roundTime}
                            showTimer={gameState.state === "ongoingRound"}
                        />
                    </section>
                </>
            )}

            {!enemy && (
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
                    Waiting for <br />
                    opponent
                    <EllipsisLoader />
                </motion.h2>
            )}
        </section>
    );
}
