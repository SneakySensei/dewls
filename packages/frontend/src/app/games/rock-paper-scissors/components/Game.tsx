"use client";

import { useEffect, useReducer, useRef } from "react";

import { RockPaperScissors, TIERS_IDS } from "common";
import { getSocketManager } from "@/utils/websockets";
import { Socket } from "socket.io-client";
import { getWalletClient } from "@/utils/functions/ethers";
import SignClient from "@/utils/service/sign-protocol.service";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import RockImage from "../assets/rock.png";
import PaperImage from "../assets/paper.png";
import ScissorsImage from "../assets/scissors.png";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

type Props = {
  user_id: string;
  tier: TIERS_IDS;
};

type PlayerState = {
  currentMove: RockPaperScissors.Move;
  currentScore: number;
  user_id: string;
};
export type GameState =
  | { state: "initial"; player: PlayerState }
  | {
      state: "waiting";
      room_id: string;
      player?: PlayerState;
      enemy?: PlayerState;
    }
  | {
      state: "ongoingRound";
      room_id: string;
      round: number;
      player: PlayerState;
      enemy: PlayerState;
    }
  | {
      state: "roundEnd";
      room_id: string;
      round: number;
      player: PlayerState;
      enemy: PlayerState;
      winner_id: string | null;
    }
  | {
      state: "gameEnd";
      room_id: string;
      round: number;
      player: PlayerState;
      enemy: PlayerState;
      winner_id: string;
    };

export default function Game({ tier, user_id: player_user_id }: Props) {
  const { provider } = useWeb3AuthContext();
  const reducer = (
    gameState: GameState,
    action: RockPaperScissors.SERVER_EVENTS | { type: "next-round" }
  ): GameState => {
    switch (action.type) {
      case "player-joined": {
        const { room_id, user_id } = action.payload;
        if (user_id === player_user_id) {
          return {
            ...gameState,
            state: "waiting",
            player: { currentMove: "rock", currentScore: 0, user_id },
            room_id,
          };
        }
        return {
          ...gameState,
          state: "waiting",
          room_id,
          enemy: { currentMove: "rock", currentScore: 0, user_id },
        };
      }

      // ? Possible the game start fires before player joined event
      case "game-start": {
        const { round, player1, player2 } = action.payload;
        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;

        if (gameState.state === "waiting") {
          return {
            ...gameState,
            state: "ongoingRound",
            round,
            player: {
              currentMove: "rock",
              currentScore: player.currentScore,
              user_id: player.user_id,
            },
            enemy: {
              currentMove: "rock",
              currentScore: enemy.currentScore,
              user_id: enemy.user_id,
            },
          };
        }
        break;
      }
      case "round-end": {
        const { round, player1, player2, winner_id } = action.payload;

        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;

        if (
          gameState.state === "ongoingRound" &&
          player.currentMove &&
          enemy.currentMove
        ) {
          return {
            ...gameState,
            state: "roundEnd",
            round,
            player: { ...player, currentMove: player.currentMove },
            enemy: { ...enemy, currentMove: enemy.currentMove },
            winner_id,
          };
        }
        break;
      }
      case "next-round": {
        if (gameState.state === "roundEnd") {
          return {
            state: "ongoingRound",
            round: gameState.round + 1,
            enemy: { ...gameState.enemy, currentMove: "rock" },
            player: { ...gameState.player, currentMove: "rock" },
            room_id: gameState.room_id,
          };
        }

        break;
      }
      case "game-end": {
        const { player1, player2, round, winner_id } = action.payload;

        const player = player1.user_id === player_user_id ? player1 : player2;
        const enemy = player1.user_id !== player_user_id ? player1 : player2;
        if (
          gameState.state === "ongoingRound" &&
          player.currentMove &&
          enemy.currentMove
        ) {
          return {
            ...gameState,
            state: "gameEnd",
            round,
            player: { ...player, currentMove: player.currentMove },
            enemy: { ...enemy, currentMove: enemy.currentMove },
            winner_id,
          };
        }
        break;
      }
    }

    return gameState;
  };
  const [gameState, dispatch] = useReducer(reducer, {
    state: "initial",
    player: { currentMove: "rock", currentScore: 0, user_id: player_user_id },
  });

  const socket = useRef<Socket>(
    getSocketManager().socket(`/${RockPaperScissors.slug}`)
  );

  useEffect(() => {
    socket.current.onAny((event, ...args) => {
      console.log("rx event", event, args);
    });
    socket.current.onAnyOutgoing((event, ...args) => {
      console.log("tx event", event, args);
    });
    socket.current.on(
      "player-joined" satisfies RockPaperScissors.PlayerJoinedEvent["type"],
      (payload: RockPaperScissors.PlayerJoinedEvent["payload"]) => {
        dispatch({ type: "player-joined", payload });
      }
    );
    socket.current.on(
      "game-start" satisfies RockPaperScissors.GameStartEvent["type"],
      (payload: RockPaperScissors.GameStartEvent["payload"]) => {
        dispatch({ type: "game-start", payload });
      }
    );
    socket.current.on(
      "round-end" satisfies RockPaperScissors.RoundEndEvent["type"],
      (payload: RockPaperScissors.RoundEndEvent["payload"]) => {
        dispatch({ type: "round-end", payload });
        setTimeout(() => {
          dispatch({ type: "next-round" });
        }, 5000);
      }
    );
    socket.current.on(
      "game-end" satisfies RockPaperScissors.GameEndEvent["type"],
      (payload: RockPaperScissors.GameEndEvent["payload"]) => {
        dispatch({ type: "game-end", payload });
      }
    );

    socket.current.emit(
      "join" satisfies RockPaperScissors.JoinEvent["type"],
      {
        season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
        user_id: player_user_id,
        game_id: RockPaperScissors.gameId,
        tier_id: tier,
      } satisfies RockPaperScissors.JoinEvent["payload"]
    );

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const player = gameState.player;
  const enemy = gameState.state === "initial" ? undefined : gameState.enemy;

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
    socket.current.emit(moveEvent.type, moveEvent.payload);
  };

  const handleAttest = async () => {
    if (gameState.state !== "gameEnd") return;

    const walletClient = await getWalletClient(provider!);
    const signClient = new SignClient(walletClient);
    const attestation = await signClient.attest({
      game_id: RockPaperScissors.gameId,
      season_id: "6dd7cc5f-45ab-42d8-84f9-9bc0a5ff2121",
      user_id: player_user_id,
      tier_id: tier,
      winner_id: player_user_id,
    });
    console.log(attestation);
  };

  return (
    <main className="relative h-full flex flex-col bg-neutral-100">
      <section className="flex-1 grid place-items-center relative z-0 min-h-0 bg-[radial-gradient(circle_at_center_bottom,_#f87171_0%,_#d71e1e_100%)]">
        <span className="absolute -z-10 bg-polkadots inset-0 bg-fixed" />
        {enemy && (
          <>
            <div className="absolute top-0 left-0 w-full h-auto">
              <h1>Player 2</h1>
              <pre>{JSON.stringify(gameState, null, 2)}</pre>
            </div>

            <MoveImage move={enemy.currentMove} isEnemy />
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
      <section className="flex-1 relative grid place-items-center z-0 min-h-0 bg-[radial-gradient(circle_at_center_top,_#60a5fa_0%,_#1d4ed8_100%)]">
        <span className="absolute -z-10 bg-polkadots inset-0 bg-fixed" />
        {player && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-auto">
              <h1>Player 1</h1>
              <pre>{JSON.stringify(player, null, 2)}</pre>
            </div>
            <MoveImage move={player.currentMove} />

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
                      className="block bg-black/50 border rounded-full size-14 p-2"
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
      </section>

      {/* Middle text banner */}
      <section className="absolute top-1/2 p-1 text-center left-0 w-full -translate-y-1/2 bg-neutral-500">
        {gameState.state === "ongoingRound" && (
          <h2 className="text-display-2">Round {gameState.round + 1}</h2>
        )}
        {gameState.state === "roundEnd" && (
          <h2 className="text-display-2">
            {gameState.winner_id
              ? gameState.winner_id === gameState.player.user_id
                ? "You win the round!"
                : "Enemy wins the round!"
              : "Draw!"}
          </h2>
        )}
        {gameState.state === "gameEnd" && (
          <h2 className="text-display-2">
            {gameState.winner_id === gameState.player.user_id
              ? "You win!"
              : "Enemy wins!"}
          </h2>
        )}
      </section>

      {gameState.state === "gameEnd" &&
        player?.user_id === gameState.winner_id && (
          <button onClick={handleAttest}>Attest</button>
        )}
    </main>
  );
}

type MoveProps = {
  deciding?: boolean;
  move: RockPaperScissors.Move;
  isEnemy?: boolean;
};
function MoveImage({ move, isEnemy }: MoveProps) {
  return (
    <div className="animate-shake">
      <Image
        src={MOVE_IMAGE_MAP[move]}
        alt={move}
        className={clsx("h-[30vh] max-h-[80%] w-auto", isEnemy && "rotate-180")}
      />
    </div>
  );
}

const MOVE_IMAGE_MAP = {
  rock: RockImage,
  paper: PaperImage,
  scissors: ScissorsImage,
};
