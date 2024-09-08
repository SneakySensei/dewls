"use client";

import Button from "@/shared/Button";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

export default memo(function NotFound() {
    const [flipped, setFlipped] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const flipCoin = () => {
        setFlipped(flipped + 1);
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 3000);
    };

    const result = useMemo(
        () =>
            flipped ? (Math.random() <= 0.5 ? "heads" : "tails") : undefined,
        [flipped],
    );

    return (
        <main className="flex h-full w-full flex-col">
            <div className="my-20 flex flex-col items-center justify-center">
                <figure className="relative flex h-72 w-full">
                    <Image
                        alt=""
                        src={"/not-found/not-found-banner.png"}
                        fill
                        className="object-contain object-center"
                    />
                </figure>

                <figcaption className="mt-8 text-center text-body-2 text-neutral-200">
                    You've found a hidden corner of the arcade.
                </figcaption>
            </div>

            <div className="mt-auto flex flex-col gap-4 p-4">
                <div
                    key={flipped}
                    className={clsx(
                        "relative m-auto mb-2 size-20 transform-gpu cursor-pointer transition-all",
                        result
                            ? result === "heads"
                                ? "animate-flip-heads"
                                : "animate-flip-tails"
                            : "",
                    )}
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                    }}
                >
                    <div className="absolute z-10 flex h-full w-full rounded-full bg-coin-heads bg-contain bg-center" />

                    <div
                        className="absolute flex h-full w-full rounded-full bg-coin-tails bg-contain bg-center"
                        style={{
                            transform: "rotateY(-180deg)",
                        }}
                    />
                </div>

                <Button
                    disabled={isAnimating}
                    onClick={flipCoin}
                    className="block w-full"
                >
                    Flip for fun
                </Button>

                <Link href="/" className="block w-full">
                    <Button variant="outline" className="block w-full">
                        Take me Home!
                    </Button>
                </Link>
            </div>
        </main>
    );
});
