"use client";

import BattleIcon from "@/shared/icons/BattleIcon";
import { MatchPlayer } from "./MatchPlayer";

export const MatchHistory: React.FC = () => {
  // const { user } = useWeb3AuthContext();
  const user = {
    email_id: "karanpargal007@gmail.com",
    name: "Karan Pargal",
    profile_photo:
      "https://lh3.googleusercontent.com/a/ACg8ocIJsSTDQXwXlpZTNdu0n6G-EySqxIwKJfUTewSoej7mbMF9ITIH=s96-c",
    wallet_address: "0xC1931B33dCb6E64da65D2F3c73bcDc42d2f9Ce98",
    won: 10,
    played: 20,
    score: 1000,
  };

  if (!user) {
    return <></>;
  }

  return (
    <div className="px-4">
      <h3 className="text-heading-3 text-neutral-300 my-2">Match History</h3>

      <div className="border border-neutral-400 rounded-lg w-full">
        <p className="text-body-1 text-neutral-100 bg-neutral-600 font-medium px-4 py-2 w-full rounded-t-lg">
          Game Name
        </p>

        <div className="flex justify-center items-center gap-x-6 max-w-80 pt-8 w-3/5 mx-auto">
          <MatchPlayer
            profile_photo={user.profile_photo}
            won={false}
            name="You"
            wallet_address={user.wallet_address}
          />

          <BattleIcon className="h-20 w-20" />

          <MatchPlayer
            profile_photo={user.profile_photo}
            won={true}
            name="Enemy"
            wallet_address={user.wallet_address}
          />
        </div>

        <div className="px-4 mt-4 text-body-3">
          <div className="flex items-center gap-x-2 justify-start py-4 border-t border-neutral-500">
            <p className="text-status-danger">Loss</p>

            <span className="text-neutral-500">|</span>

            <p className="text-neutral-100">
              <span className="text-neutral-300">Tier</span> Alpha
            </p>

            <span className="text-neutral-500">|</span>

            <p className="text-neutral-300">21 Aug 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
