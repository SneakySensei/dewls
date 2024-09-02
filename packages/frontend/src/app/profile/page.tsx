"use client";

import { useEffect, useState } from "react";
import {
  ProfileHero,
  WalletDetails,
  ChainSelector,
  GameHistory,
} from "../components/profile";
import { CustomChainConfig } from "@web3auth/base";
import { CHAINS } from "@/utils/constants/chain-config.constant";
import { web3auth } from "@/utils/service/web3auth.service";
import { MappedPlayedGame, ResponseWithData } from "@/utils/types";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { API_BASE_URL } from "@/utils/constants/api.constant";

const Profile: React.FC = () => {
  const { user } = useWeb3AuthContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [playedGames, setPlayedGames] = useState<MappedPlayedGame[]>([]);
  const [selectedChain, setSelectedChain] = useState<CustomChainConfig>(
    CHAINS.find(
      (chain: CustomChainConfig) =>
        // @ts-expect-error
        chain.chainId === web3auth.walletAdapters.openlogin?.chainConfig.chainId
    )!
  );

  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          return;
        }

        setLoading(true);

        const gamesRes = await fetch(
          `${API_BASE_URL}/played-games/${user.data.player_id}`,
          {
            cache: "no-cache",
          }
        );
        const gamesResponse = (await gamesRes.json()) as ResponseWithData<
          MappedPlayedGame[]
        >;

        if (gamesResponse.success) {
          setPlayedGames(gamesResponse.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="text-neutral-100 flex flex-col gap-y-4 pb-10">
      <ProfileHero />
      <WalletDetails selectedChain={selectedChain} />
      <ChainSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />

      {loading ? (
        <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
          Curating the leaderboard...
        </p>
      ) : (
        <div>
          {playedGames.map((game) => (
            <GameHistory key="" playedGame={game} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Profile;
