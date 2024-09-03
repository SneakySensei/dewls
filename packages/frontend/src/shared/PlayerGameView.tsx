"use client";

import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { MappedPlayer, ResponseWithData } from "@/utils/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import anonImage from "@/assets/anon.png";
import clsx from "clsx";
import { cn } from "@/utils/cn";
import { animate } from "framer-motion";

type Props = {
  user_id: string;
  timerSeconds: number;
};
export default function PlayerGameView({ user_id, timerSeconds }: Props) {
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

  return (
    <article>
      <div className="relative block p-1 size-10 overflow-hidden">
        <Progress
          onTimerEnd={() => console.log("MOVE SKIPPED LOGIC!")}
          timerSeconds={timerSeconds}
          className="absolute inset-0 size-full"
        />
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
          svgRef.current.dataset.progress = latest.toString();
        }
      },
      onComplete: onTimerEnd,
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="250"
      height="250"
      viewBox="0 0 250 250"
      className={cn("circular-progress", className)}
      data-progress={0}
    >
      <circle className="bg"></circle>
      <circle className="fg"></circle>
    </svg>
  );
};
