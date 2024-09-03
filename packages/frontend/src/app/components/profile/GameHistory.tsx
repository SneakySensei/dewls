"use client";

import BattleIcon from "@/shared/icons/BattleIcon";
import { GamePlayer } from "./GamePlayer";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedPlayerGameHistory } from "@/utils/types";

export const GameHistory: React.FC<{
  playedGame: MappedPlayerGameHistory;
  won: boolean;
}> = ({ playedGame, won }) => {
  const { user } = useWeb3AuthContext();

  if (!user) {
    return <></>;
  }

  return (
    <div className="border border-neutral-400 rounded-lg w-full my-6">
      <p className="text-body-1 text-neutral-100 bg-neutral-600 font-medium px-4 py-2 w-full rounded-t-lg">
        {playedGame.game_name}
      </p>

      <div className="flex justify-center items-center gap-x-6 max-w-80 pt-8 w-3/5 mx-auto">
        <GamePlayer
          you={true}
          profile_photo={user.data.profile_photo}
          won={won}
          name="You"
          wallet_address={user.data.wallet_address}
        />

        <BattleIcon className="h-20 w-20" />

        <GamePlayer
          you={false}
          profile_photo={playedGame.enemy_profile_photo}
          won={!won}
          name={playedGame.enemy_name!}
          wallet_address={playedGame.enemy_wallet_address!}
        />
      </div>

      <div className="px-4 mt-4 text-body-3">
        <div className="flex items-center gap-x-2 justify-start py-4 border-t border-neutral-500">
          <p
            className={`${won ? "text-status-success" : "text-status-danger"}`}
          >
            {won ? "Win" : "Loss"}
          </p>

          <span className="text-neutral-500">|</span>

          <p className="text-neutral-100">
            <span className="text-neutral-300">Tier</span>{" "}
            {playedGame.tier_name}
          </p>

          <span className="text-neutral-500">|</span>

          <p className="text-neutral-300">{playedGame.created_at}</p>
        </div>
      </div>
    </div>
  );
};
