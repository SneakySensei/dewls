"use client";

import {
  MappedLeaderboard,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import LeaderboardTable from "./LeaderboardTable";
import Dropdown from "../shared/dropdown";
import { useState } from "react";
import ChevronDown from "@/shared/icons/Chevron-Down";
import coinsLottie from "../../../../public/leaderboard-coins.json";
import Lottie from "react-lottie";
import { API_BASE_URL } from "@/utils/constants/api.constant";

export const Leaderboard: React.FC<{
  seasons: MappedSeason[];
  leaderboard: MappedLeaderboard[];
}> = ({ leaderboard: initialLeaderboard, seasons }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<MappedSeason>(
    seasons[0]
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] =
    useState<MappedLeaderboard[]>(initialLeaderboard);

  const updateLeaderboardHandler = async (season_id: string) => {
    try {
      setLoading(true);

      const leaderboardRes = await fetch(
        `${API_BASE_URL}/leaderboard/${season_id}`,
        {
          cache: "no-cache",
        }
      );
      const leaderboardResponse =
        (await leaderboardRes.json()) as ResponseWithData<MappedLeaderboard[]>;

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="text-neutral-100 gap-y-6">
      <h1 className="text-heading-1 font-bold text-center tracking-widest font-display">
        Leaderboard
      </h1>

      <div className="px-4">
        <Dropdown
          open={dropdownOpen}
          setOpen={setDropdownOpen}
          trigger="click"
          propagationStop
          options={[
            <div
              key="seasons-dropdown"
              className="bg-neutral-600 mt-2 rounded-lg px-4 max-h-96 overflow-auto"
            >
              {seasons.map((season, i) => (
                <div
                  key={season.season_id}
                  className={`${
                    selectedSeason.season_id === season.season_id
                      ? "bg-neutral-500"
                      : ""
                  } rounded-lg py-3 px-4 my-4 flex items-center justify-between w-full text-neutral-300 hover:text-neutral-100 transition-all cursor-pointer`}
                  onClick={() => {
                    setSelectedSeason(season);
                    setDropdownOpen(false);
                    updateLeaderboardHandler(season.season_id);
                  }}
                >
                  <p className="font-medium text-body-1">{season.name}</p>

                  {season.ended_on > new Date().toISOString() ? (
                    <span className="px-3 py-2 font-medium leading-none text-body-4 text-neutral-500 bg-status-success rounded-2xl">
                      LIVE
                    </span>
                  ) : (
                    <p className="text-body-4">
                      Ended on {new Date(season.ended_on).getDate()}
                    </p>
                  )}
                </div>
              ))}
            </div>,
          ]}
          dropdownClassname="w-full"
        >
          <div className="cursor-pointer border-neutral-400 border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>{selectedSeason.name}</span>

              {selectedSeason.ended_on > new Date().toISOString() && (
                <span className="px-3 py-2 font-medium leading-none text-body-4 text-neutral-500 bg-status-success rounded-2xl">
                  LIVE
                </span>
              )}
            </div>

            <div
              className={`text-neutral-300 ${dropdownOpen ? "rotate-180" : ""} transition-all`}
            >
              <ChevronDown />
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="justify-center m-4 bg-reward-pool-banner">
        <div className="border border-purple-800 rounded-xl p-4">
          <figure className="w-40 mx-auto">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: coinsLottie,
              }}
            />
          </figure>

          <div className="gap-y-2 text-center">
            <p className="text-heading-1 text-neutral-100 font-semibold">
              ${selectedSeason.reward_pool_usd.toLocaleString()}
            </p>

            <p className="text-body-3 text-neutral-200 font-normal mt-2">
              Amount Pooled
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
          Curating the leaderboard...
        </p>
      ) : (
        <LeaderboardTable leaderboard={leaderboard} />
      )}
    </main>
  );
};
