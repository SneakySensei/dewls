"use client";

import { GamePlayer } from "./GamePlayer";
import BattleIcon from "@/shared/icons/BattleIcon";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { timestampParser } from "@/utils/functions/timestamp-parser";
import { MappedPlayerGameHistory } from "@/utils/types";

export const GameHistory: React.FC<{
    playedGame: MappedPlayerGameHistory;
    won: boolean;
}> = ({ playedGame, won }) => {
    const { user } = useWeb3AuthContext();

    if (!user) return null;

    return (
        <div className="my-6 w-full rounded-lg border border-neutral-400">
            <p className="w-full rounded-t-lg bg-neutral-600 px-4 py-2 text-body-1 font-medium text-neutral-100">
                {playedGame.game_name}
            </p>

            <div className="mx-auto flex w-3/5 max-w-80 items-center justify-center gap-x-6 pt-8">
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

            <div className="mt-4 px-4 text-body-3">
                <div className="flex items-center justify-start gap-x-2 border-t border-neutral-500 py-4">
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

                    <p className="text-neutral-300">
                        {playedGame.created_at &&
                            timestampParser(playedGame.created_at)}
                    </p>
                </div>
            </div>
        </div>
    );
};
