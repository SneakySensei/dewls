import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { getWalletClient } from "@/utils/functions/ethers";
import SignClient from "@/utils/service/sign-protocol.service";
import { RockPaperScissors, TIERS_IDS } from "common";
import { AnimatePresence, motion } from "framer-motion";
import { Socket } from "socket.io-client";
import { GameState } from "./Game";
import Image from "next/image";
import MoveImage, { MOVE_IMAGE_MAP } from "./MoveImage";

type PlayerScreenProps = {
  gameState: GameState;
  socket: Socket;
  tier: TIERS_IDS;
};

export default function PlayerScreen({
  gameState,
  socket,
  tier,
}: PlayerScreenProps) {
  const { provider } = useWeb3AuthContext();

  const handleMove = (move: RockPaperScissors.Move) => {
    if (gameState.state !== "ongoingRound") return;
    const moveEvent: RockPaperScissors.MoveEvent = {
      type: "move",
      payload: {
        room_id: gameState.room_id,
        user_id: gameState.player.user_id,
        move,
      },
    };
    socket.emit(moveEvent.type, moveEvent.payload);
  };

  const handleAttest = async () => {
    if (gameState.state !== "gameEnd") return;

    const walletClient = await getWalletClient(provider!);
    const signClient = new SignClient(walletClient);

    const attestation = await signClient.attest({
      game_id: RockPaperScissors.gameId,
      season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
      user_id: gameState.player.user_id,
      tier_id: tier,
      winner_id: gameState.player.user_id,
    });
    console.log(attestation);
  };

  const player = gameState.player;

  const moveState =
    (gameState.state === "roundEnd" || gameState.state === "gameEnd") &&
    gameState.winner_id
      ? gameState.winner_id === gameState.player.user_id
        ? "win"
        : "lose"
      : "idle";

  return (
    <section className="flex-1 relative grid place-items-center z-0 min-h-0 bg-[radial-gradient(circle_at_center_top,_#60a5fa_0%,_#1d4ed8_100%)]">
      <span className="absolute -z-10 bg-polkadots inset-0 bg-fixed" />
      {player && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-auto">
            <h1>Player 1</h1>
            <pre>{JSON.stringify(player, null, 2)}</pre>
          </div>
          <MoveImage move={player.currentMove} state={moveState} />

          {/* CONTROLS */}
          <AnimatePresence>
            {gameState.state === "ongoingRound" && (
              <motion.section
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ staggerChildren: 0.1 }}
                className="p-2 space-y-3 absolute w-auto overflow-x-hidden right-0 top-1/2 -translate-y-1/2"
              >
                {(
                  [
                    "rock",
                    "paper",
                    "scissors",
                  ] satisfies RockPaperScissors.Move[]
                ).map((action) => (
                  <motion.button
                    variants={{
                      hidden: { x: "100%", opacity: 0 },
                      show: { x: 0, opacity: 1 },
                    }}
                    key={action}
                    className="block bg-black/50 border border-neutral-400 shadow-md rounded-full size-14 p-2"
                    onClick={() => handleMove(action)}
                  >
                    <Image alt={action} src={MOVE_IMAGE_MAP[action]} />
                  </motion.button>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
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
          className="text-display-1 z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          Joining game...
        </motion.h2>
      )}

      {gameState.state === "gameEnd" &&
        player?.user_id === gameState.winner_id && (
          <button onClick={handleAttest}>Attest</button>
        )}
    </section>
  );
}
