"use client";

import BattleIcon from "@/shared/icons/BattleIcon";
import { GamePlayer } from "./GamePlayer";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedPlayedGame } from "@/utils/types";

export const GameHistory: React.FC<{ playedGame: MappedPlayedGame }> = async ({
  playedGame,
}) => {
  const { user } = useWeb3AuthContext();

  if (!user) {
    return <></>;
  }

  const won = playedGame.winner_id === user.data.player_id;

  return (
    <div className="px-4">
      <h3 className="text-heading-3 text-neutral-300 my-2">Match History</h3>

      <div className="border border-neutral-400 rounded-lg w-full">
        <p className="text-body-1 text-neutral-100 bg-neutral-600 font-medium px-4 py-2 w-full rounded-t-lg">
          {playedGame.game_id}
        </p>

        <div className="flex justify-center items-center gap-x-6 max-w-80 pt-8 w-3/5 mx-auto">
          <GamePlayer
            profile_photo={user.data.profile_photo}
            won={won}
            name="You"
            wallet_address={user.data.wallet_address}
          />

          <BattleIcon className="h-20 w-20" />

          <GamePlayer
            profile_photo={user.data.profile_photo}
            won={won}
            name="Enemy"
            wallet_address={user.data.wallet_address}
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
