"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function Card() {
  return (
    <Link href="/games/rock-paper-scissors" className="block">
      <article className="rounded-lg overflow-hidden">
        <div className="aspect-video">
          <CldImage
            alt=""
            src="https://res.cloudinary.com/dotnn3ato/image/upload/v1725132173/mwanjxlrxg8e1rkeqpmh.png" // Use this sample image or upload your own via the Media Explorer
            width="1280" // Transform the image: auto-crop to square aspect_ratio
            height="720"
            crop={{
              type: "auto",
              source: true,
            }}
          />
        </div>
        <div className="p-3 rounded-b-lg bg-neutral-700 border border-t-0 border-neutral-500">
          <h2 className="text-heading-3">Rock Paper Scissors</h2>
          <p className="text-neutral-200 text-body-2 mt-1">
            Let’s settle it with rock, paper, scissors!
          </p>
        </div>
      </article>
    </Link>
  );
}
