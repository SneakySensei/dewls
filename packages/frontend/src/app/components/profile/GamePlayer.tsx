import Crown from "@/shared/icons/Crown";
import { truncate } from "@/utils/functions/truncate";
import Image from "next/image";

export const GamePlayer: React.FC<{
    profile_photo: string | null;
    won: boolean;
    name: string;
    wallet_address: string;
    you: boolean;
}> = ({ profile_photo, won, name, wallet_address, you }) => {
    return (
        <div className="relative flex w-full flex-col items-center gap-2">
            {won && (
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full">
                    <Crown className="h-4 w-4" />
                </span>
            )}

            <figure
                className={`${
                    won
                        ? "border-semantic-launch shadow-md shadow-semantic-launch"
                        : "border-transparent"
                } rounded-full border`}
            >
                {profile_photo && (
                    <Image
                        alt=""
                        src={profile_photo}
                        height={64}
                        width={64}
                        className="border-6 rounded-full border-neutral-500 bg-neutral-500 p-2"
                    />
                )}
            </figure>

            <div className="text-center">
                <h3
                    className={`${you ? "text-brand-400" : ""} text-body-1 font-medium`}
                >
                    {name}
                </h3>

                <p className="text-body-3 text-neutral-300">
                    {truncate(wallet_address).toUpperCase()}
                </p>
            </div>
        </div>
    );
};
