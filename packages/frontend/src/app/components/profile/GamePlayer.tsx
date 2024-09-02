import Crown from "@/shared/icons/Crown";
import { truncate } from "@/utils/functions/truncate";
import Image from "next/image";

export const GamePlayer: React.FC<{
  profile_photo: string;
  won: boolean;
  name: string;
  wallet_address: string;
}> = ({ profile_photo, won, name, wallet_address }) => {
  return (
    <div className="flex flex-col items-center w-full gap-2 relative">
      {won && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
          <Crown className="w-4 h-4" />
        </span>
      )}

      <figure
        className={`${
          won ? "border-semantic-launch" : "border-transparent"
        } border rounded-full`}
      >
        <Image
          alt=""
          src={profile_photo}
          height={80}
          width={80}
          className="rounded-full border-8 p-2 bg-neutral-500 border-neutral-500"
        />
      </figure>

      <div className="text-center">
        <h3
          className={`${won ? "text-brand-400" : ""} text-body-1 font-medium`}
        >
          {name}
        </h3>

        <p className="text-neutral-300 text-body-3">
          {truncate(wallet_address).toUpperCase()}
        </p>
      </div>
    </div>
  );
};
