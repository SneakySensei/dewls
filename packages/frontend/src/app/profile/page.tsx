"use client";

import { useEffect, useState } from "react";
import { ProfileHero, WalletDetails } from "../components/profile";
import { CustomChainConfig } from "@web3auth/base";
import { CHAINS } from "@/utils/constants/chain-config.constant";
import { web3auth } from "@/utils/service/web3auth.service";
import {
  MappedPlayedGame,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import SeasonStats from "../components/profile/SeasonStats";

const Profile: React.FC = () => {
  const { user } = useWeb3AuthContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [playedGames, setPlayedGames] = useState<MappedPlayedGame[]>([]);
  const [seasons, setSeasons] = useState<MappedSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<MappedSeason>();
  const [selectedSeasonEnded, setSelectedSeasonEnded] =
    useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<CustomChainConfig>(
    CHAINS.find(
      (chain: CustomChainConfig) =>
        // @ts-expect-error
        chain.chainId === web3auth.walletAdapters.openlogin?.chainConfig.chainId
    )!
  );

  const handleFetchPlayedGames = async () => {
    try {
      if (!user) {
        return;
      }

      setLoading(true);

      const gamesRes = await fetch(
        `${API_REST_BASE_URL}/played-games/${user.data.player_id}`,
        {
          cache: "no-cache",
        }
      );
      const gamesResponse: ResponseWithData<MappedPlayedGame[]> =
        await gamesRes.json();

      console.log(gamesResponse);
      if (gamesResponse.success) {
        setPlayedGames(gamesResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSeasons = async () => {
    try {
      const seasonsRes = await fetch(`${API_REST_BASE_URL}/seasons`, {
        cache: "no-cache",
      });
      const seasonsResponse = (await seasonsRes.json()) as ResponseWithData<
        MappedSeason[]
      >;
      if (seasonsResponse.success) {
        setSeasons(seasonsResponse.data);
        setSelectedSeason(seasonsResponse.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetchPlayedGames();
    handleFetchSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      setSelectedSeasonEnded(
        selectedSeason.ended_on > new Date().toISOString()
      );
    }
  }, [selectedSeason]);

  return (
    <main className="text-neutral-100 flex flex-col gap-y-4 pb-10">
      <ProfileHero />
      <WalletDetails
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />

      {loading || !selectedSeason ? (
        <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
          Curating the leaderboard...
        </p>
      ) : (
        <SeasonStats
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          selectedSeasonEnded={selectedSeasonEnded}
          playedGames={playedGames}
        />
      )}
    </main>
  );
};

export default Profile;
