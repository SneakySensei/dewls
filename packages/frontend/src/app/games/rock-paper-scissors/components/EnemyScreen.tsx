import { GameState } from "./Game";
import { motion } from "framer-motion";
import MoveImage from "./MoveImage";
import PlayerGameView from "@/shared/PlayerGameView";

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
    <section className="flex-1 grid place-items-center relative z-0 min-h-0 bg-[radial-gradient(circle_at_center_bottom,_#f87171_0%,_#d71e1e_100%)]">
      <span className="absolute -z-10 bg-polkadots inset-0 bg-fixed" />
      {enemy && (
        <>
          <MoveImage move={enemy.currentMove} isEnemy state={moveState} />

          <section className="p-2 top-0 absolute left-0 flex flex-col gap-y-6 items-end">
            <PlayerGameView user_id={enemy.player_id} timerSeconds={10} />
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
          className="text-display-1 z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          Waiting for <br />
          opponent...
        </motion.h2>
      )}
    </section>
  );
}
