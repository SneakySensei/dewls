"use client";

import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { MappedPlayer, ResponseWithData } from "@/utils/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import anonImage from "@/assets/anon.png";
import clsx from "clsx";
import { cn } from "@/utils/cn";
import { animate } from "framer-motion";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { truncate } from "@/utils/functions/truncate";

type Props = {
  user_id: string;
  timerSeconds: number;
  showTimer?: boolean;
};
export default function PlayerGameView({
  user_id,
  timerSeconds,
  showTimer,
}: Props) {
  const { user: authUser } = useWeb3AuthContext();
  const [userResponse, setUserResponse] =
    useState<ResponseWithData<MappedPlayer>>();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_REST_BASE_URL}/players/${user_id}`, {
        cache: "no-cache",
      });
      const userResponse = (await res.json()) as ResponseWithData<MappedPlayer>;
      setUserResponse(userResponse);
    })();
  }, [user_id]);

  const user = userResponse?.success ? userResponse.data : undefined;
  const playerName = user
    ? user.player_id === authUser?.data.player_id
      ? "You"
      : user.name
    : undefined;
  return (
    <article className="bg-black/50 rounded-lg px-2 py-1 flex gap-x-2">
      <div className="relative block p-1.5 size-11 overflow-hidden">
        {showTimer && (
          <Progress
            onTimerEnd={() => console.log("MOVE SKIPPED LOGIC!")}
            timerSeconds={timerSeconds}
            className="absolute inset-0 size-full"
          />
        )}
        <figure className="size-8 rounded-full relative overflow-hidden">
          <Image
            src={user?.profile_photo ? user?.profile_photo : anonImage.src}
            fill
            alt="Profile image"
            className={clsx(
              !user?.profile_photo && "[image-rendering:pixelated]"
            )}
          />
        </figure>
      </div>
      <div>
        <p className={clsx("text-body-1 font-medium", !playerName && "italic")}>
          {playerName ?? "Loading..."}
        </p>
        <p className="text-body-3">
          {user?.wallet_address
            ? truncate(user.wallet_address).toUpperCase()
            : "Loading..."}
        </p>
      </div>
    </article>
  );
}

const Progress = ({
  timerSeconds,
  className,
  onTimerEnd,
  ...props
}: {
  timerSeconds: number;
  onTimerEnd: () => void;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    animate(0, 100, {
      duration: timerSeconds,
      ease: "linear",
      type: "tween",
      onUpdate(latest) {
        if (svgRef.current) {
          // @ts-ignore
          svgRef.current.style.setProperty("--progress", latest);
        }
      },
      onComplete: onTimerEnd,
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className={cn("circular-progress", className)}
      {...props}
    >
      <circle className="bg"></circle>
      <circle className="fg"></circle>
    </svg>
  );
};
