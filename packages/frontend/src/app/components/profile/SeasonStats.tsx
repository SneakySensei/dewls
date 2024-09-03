import React, { useEffect, useState } from "react";
import SeasonsDropdown from "../shared/season-dropdown";
import {
  MappedLeaderboard,
  MappedPlayerGameHistory,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import { GameHistory } from "./GameHistory";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";

const SeasonStats: React.FC = () => {
  const { user } = useWeb3AuthContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [playedGames, setPlayedGames] = useState<MappedPlayerGameHistory[]>([]);
  const [stats, setStats] = useState<{
    games_played: MappedLeaderboard["games_played"];
    games_won: MappedLeaderboard["games_won"];
    rank: MappedLeaderboard["rank"];
    total_points: MappedLeaderboard["total_points"];
  } | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<MappedSeason | null>(
    null
  );

  useEffect(() => {
    (async () => {
      try {
        if (!user || !selectedSeason) {
          return;
        }

        setLoading(true);

        const gamesRes = await fetch(
          `${API_REST_BASE_URL}/player-game-history`,
          {
            cache: "no-cache",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              player_id: user.data.player_id,
              season_id: selectedSeason.season_id,
            }),
          }
        );
        const gamesResponse: ResponseWithData<{
          player_game_history: MappedPlayerGameHistory[];
          season_statistics: {
            games_played: MappedLeaderboard["games_played"];
            games_won: MappedLeaderboard["games_won"];
            rank: MappedLeaderboard["rank"];
            total_points: MappedLeaderboard["total_points"];
          };
        }> = await gamesRes.json();

        if (gamesResponse.success) {
          setPlayedGames(gamesResponse.data.player_game_history);
          setStats(gamesResponse.data.season_statistics);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedSeason, user]);

  return (
    <div className="mx-4">
      <h3 className="text-heading-3 text-neutral-300 my-2 mb-6">
        Season Stats
      </h3>

      <SeasonsDropdown
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />

      {loading ? (
        <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
          Curating the statistics...
        </p>
      ) : (
        <>
          <div className="flex justify-center items-center border border-neutral-400 p-4 rounded-lg mt-6 gap-x-2">
            {[
              {
                heading: "Won",
                value: stats?.games_won,
              },
              {
                heading: "Played",
                value: stats?.games_played,
              },
              {
                heading: "Score",
                value: stats?.total_points,
              },
              {
                heading: "Rank",
                value: stats?.rank,
              },
            ].map(({ heading, value }) => (
              <div
                key={heading}
                className="flex-1 flex-col gap-y-1 text-center border-r last:border-r-0 px-1"
              >
                <p className="text-neutral-300 text-body-3">{heading}</p>
                <p className="text-neutral-100 text-body-1">{value}</p>
              </div>
            ))}
          </div>

          {playedGames.map((game) => (
            <GameHistory
              key={game.played_game_id}
              playedGame={game}
              won={game.winner_id === user?.data.player_id}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SeasonStats;
