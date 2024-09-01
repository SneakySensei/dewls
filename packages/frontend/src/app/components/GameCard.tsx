"use client";

import { MappedGame } from "@/utils/types";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

type Props = { data: MappedGame };

export default function GameCard({ data }: Props) {
  const { name, description, cover_image, slug } = data;
  return (
    <Link href="/games/rock-paper-scissors" className="block">
      <article className="rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <CldImage
            alt=""
            src={cover_image}
            aspectRatio="16:9"
            fill
            crop="auto"
          />
        </div>
        <div className="p-3 rounded-b-lg bg-neutral-700 border border-t-0 border-neutral-500">
          <h2 className="text-heading-3">{name}</h2>
          <p className="text-neutral-200 text-body-2 mt-1">{description}</p>
        </div>
      </article>
    </Link>
  );
}
