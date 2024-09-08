"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedGame } from "@/utils/types";
import { CldImage } from "next-cloudinary";

type Props = { data: MappedGame; onClick: (data: MappedGame) => void };

export default function GameCard({ data, onClick }: Props) {
    const { name, description, cover_image, published } = data;
    const { user, login, isAuthenticating } = useWeb3AuthContext();

    return (
        <button
            disabled={!published || isAuthenticating}
            onClick={() => {
                if (user) {
                    onClick(data);
                } else {
                    login();
                }
            }}
            className="block w-full text-left"
        >
            <article className="overflow-hidden rounded-lg">
                <div className="relative aspect-video after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1/2 after:bg-gradient-to-t after:from-black/50 after:to-black/0">
                    <CldImage
                        alt=""
                        src={cover_image}
                        aspectRatio="16:9"
                        fill
                        crop="auto"
                        className={!published ? "grayscale" : ""}
                    />
                    {!published && (
                        <div className="absolute left-0 top-0 m-3 whitespace-nowrap rounded-full bg-semantic-launch px-2 py-0.5 text-body-4 font-medium text-neutral-500">
                            COMING SOON
                        </div>
                    )}
                </div>
                <div className="rounded-b-lg border border-t-0 border-neutral-400 bg-neutral-700 p-3">
                    <h2 className="text-heading-3">{name}</h2>
                    <p className="mt-1 text-body-2 text-neutral-200">
                        {description}
                    </p>
                </div>
            </article>
        </button>
    );
}
