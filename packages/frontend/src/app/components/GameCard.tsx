"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedGame } from "@/utils/types";
import { CldImage } from "next-cloudinary";

type Props = { data: MappedGame; onClick: (data: MappedGame) => void };

export default function GameCard({ data, onClick }: Props) {
    const { name, description, cover_image } = data;
    const { user, login, isAuthenticating } = useWeb3AuthContext();

    return (
        <button
            disabled={isAuthenticating}
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
                <div className="relative aspect-video">
                    <CldImage
                        alt=""
                        src={cover_image}
                        aspectRatio="16:9"
                        fill
                        crop="auto"
                    />
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
