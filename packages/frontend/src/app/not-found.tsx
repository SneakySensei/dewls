"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Side = "heads" | "tails";

const NotFound: React.FC = () => {
    const [result, setResult] = useState<Side | null>(null);
    const [choice, setChoice] = useState<Side | null>(null);
    const [won, setWon] = useState<boolean | null>(null);

    const flipCoin = (_choice: Side) => {
        setChoice(_choice);
        setWon(null);
        const _result = Math.random() <= 0.5 ? "heads" : "tails";
        setResult(_result);
        setTimeout(() => {
            setWon(_result === _choice);
            setChoice(null);
            setResult(null);
        }, 3 * 1000);
    };

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
                    You’ve found a hidden corner of the arcade.
                </figcaption>
            </div>

            <div className="mt-auto flex flex-col gap-4 p-4">
                <div
                    className={`${
                        result === "heads"
                            ? "animate-flip-heads"
                            : result === "tails"
                              ? "animate-flip-tails"
                              : ""
                    } relative m-auto h-32 w-32 transform-gpu cursor-pointer transition-all`}
                    style={{
                        transformStyle: "preserve-3d",
                        // @ts-ignore
                        "-webkit-backface-visibility": "hidden",
                    }}
                >
                    <div className="bg-coin-heads absolute z-10 flex h-full w-full rounded-full bg-contain bg-center" />

                    <div
                        className="bg-coin-tails absolute flex h-full w-full rounded-full bg-contain bg-center"
                        style={{
                            transform: "rotateY(-180deg)",
                        }}
                    />
                </div>

                <p className="my-2 text-center">
                    {won === null ? (
                        <span>&nbsp;</span>
                    ) : won ? (
                        "You Won!"
                    ) : (
                        "You Lost!"
                    )}
                </p>

                <div className="flex items-center justify-evenly gap-8">
                    <button
                        className="w-full rounded-lg bg-brand-400 px-2 py-2 transition-all disabled:opacity-50"
                        disabled={choice ? true : false}
                        onClick={() => {
                            flipCoin("heads");
                        }}
                    >
                        Heads
                    </button>
                    <button
                        className="w-full rounded-lg bg-brand-400 px-2 py-2 transition-all disabled:opacity-50"
                        disabled={choice ? true : false}
                        onClick={() => {
                            flipCoin("tails");
                        }}
                    >
                        Tails
                    </button>
                </div>

                <Link
                    href="/"
                    className="block w-full rounded-lg border border-brand-400 py-2 text-center"
                >
                    Take me Home!
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
