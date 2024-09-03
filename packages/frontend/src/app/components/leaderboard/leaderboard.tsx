"use client";

import {
  MappedLeaderboard,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import LeaderboardTable from "./LeaderboardTable";
import { useEffect, useState } from "react";
import coinsLottie from "../../../../public/leaderboard-coins.json";
import Lottie from "react-lottie";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { truncate } from "@/utils/functions/truncate";
import StarIcon from "@/shared/icons/StarIcon";
import RankOne from "./rank-one";
import RankTwo from "./rank-two";
import RankThree from "./rank-three";
import { calculatePercentage } from "@/utils/functions/calculate-percentage";
import {
  rankOwnRewardPercentage,
  rankThreeRewardPercentage,
  rankTwoRewardPercentage,
} from "common";
import SeasonsDropdown from "../shared/season-dropdown";

export const Leaderboard: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<MappedSeason | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<MappedLeaderboard[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!selectedSeason) {
          return;
        }
        setLoading(true);

        const leaderboardRes = await fetch(
          `${API_REST_BASE_URL}/leaderboard/${selectedSeason.season_id}`,
          {
            cache: "no-cache",
          }
        );
        const leaderboardResponse =
          (await leaderboardRes.json()) as ResponseWithData<
            MappedLeaderboard[]
          >;
        if (leaderboardResponse.success) {
          setLeaderboard(leaderboardResponse.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedSeason]);

  const selectedSeasonActive = selectedSeason
    ? selectedSeason.ended_on > new Date().toISOString()
    : false;

  return (
    <main className="text-neutral-100 gap-y-6">
      <h1 className="text-heading-1 font-bold text-center tracking-widest font-display">
        Leaderboard
      </h1>

      <div className="px-4">
        <SeasonsDropdown
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />

        <p
          className={`${
            selectedSeasonActive
              ? "bg-[linear-gradient(90deg,_rgba(18,18,21,0.2)_0%,_rgba(232,157,15,0.2)_30%,_rgba(232,157,15,0.2)_60%,_rgba(18,18,21,0.2)_100%)]"
              : "bg-[linear-gradient(90deg,_rgba(18,18,21,0.2)_0%,_#1F1F24_30%,_#1F1F24_60%,_rgba(18,18,21,0.2)_100%)] text-neutral-200"
          } text-center py-2 mt-2 mb-4`}
        >
          Season ends
        </p>
      </div>

      {selectedSeason && (
        <>
          <div className="justify-center mx-4">
            {!selectedSeasonActive ? (
              <div className="grid grid-cols-3 h-80">
                <div className="flex flex-col justify-end pb-6 text-center px-2 text-ellipsis truncate pt-16 bg-[linear-gradient(0deg,_rgba(204,204,204,0.2)_0%,_rgba(204,204,204,0)_56.58%)]">
                  <RankTwo
                    className="w-24 h-24 mx-auto"
                    profile_photo={leaderboard[1].profile_photo!}
                  />

                  <p className="text-body-1 w-full font-medium text-ellipsis truncate">
                    {leaderboard[1].name}
                  </p>

                  <p className="w-full text-body-3 text-neutral-200">
                    {truncate(leaderboard[1].wallet_address).toUpperCase()}
                  </p>

                  <div className="w-full text-body-3 text-neutral-200 flex items-center gap-1 justify-center">
                    <StarIcon />
                    {leaderboard[1].total_points?.toLocaleString()}
                  </div>

                  <p
                    className={`mt-4 text-heading-2 font-semibold bg-[linear-gradient(180deg,_#F1F8FF_0%,_#7C8186_100%)] text-transparent bg-clip-text`}
                  >
                    $
                    {calculatePercentage(
                      selectedSeason.reward_pool_usd,
                      rankTwoRewardPercentage
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col justify-end pb-6 text-center px-2 text-ellipsis truncate pt-16 bg-[linear-gradient(0deg,_rgba(246,216,135,0.24)_0%,_rgba(246,216,135,0)_95.04%)]">
                  <RankOne
                    className="w-28 h-28 mx-auto"
                    profile_photo={leaderboard[0].profile_photo!}
                  />

                  <p className="text-body-1 w-full font-medium text-ellipsis truncate">
                    {leaderboard[0].name}
                  </p>

                  <p className="w-full text-body-3 text-neutral-200">
                    {truncate(leaderboard[0].wallet_address).toUpperCase()}
                  </p>

                  <div className="w-full text-body-3 text-neutral-200 flex items-center gap-1 justify-center">
                    <StarIcon />
                    {leaderboard[0].total_points?.toLocaleString()}
                  </div>

                  <p
                    className={`mt-12 text-heading-2 font-semibold bg-[linear-gradient(180deg,_#FCE19A_0%,_#BD9350_100%)] text-transparent bg-clip-text`}
                  >
                    $
                    {calculatePercentage(
                      selectedSeason.reward_pool_usd,
                      rankOwnRewardPercentage
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col justify-end pb-6 text-center px-2 text-ellipsis truncate pt-16 bg-[linear-gradient(0deg,_rgba(211,160,133,0.2)_0%,_rgba(211,160,133,0)_71.8%)]">
                  <RankThree
                    className="w-24 h-24 mx-auto"
                    profile_photo={leaderboard[2].profile_photo!}
                  />

                  <p className="text-body-1 w-full font-medium text-ellipsis truncate">
                    {leaderboard[2].name}
                  </p>

                  <p className="w-full text-body-3 text-neutral-200">
                    {truncate(leaderboard[2].wallet_address).toUpperCase()}
                  </p>

                  <div className="w-full text-body-3 text-neutral-200 flex items-center gap-1 justify-center">
                    <StarIcon />
                    {leaderboard[2].total_points?.toLocaleString()}
                  </div>

                  <p
                    className={`mt-4 text-heading-2 font-semibold bg-[linear-gradient(180deg,_#FFDDC6_0%,_#9E7259_100%)] text-transparent bg-clip-text`}
                  >
                    $
                    {calculatePercentage(
                      selectedSeason.reward_pool_usd,
                      rankThreeRewardPercentage
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="border mb-4 border-purple-800 rounded-xl h-72 w-full bg-active-leaderboard bg-cover bg-center overflow-hidden">
                <figure className="h-48 scale-[2] mx-auto">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: coinsLottie,
                    }}
                  />
                </figure>

                <div className="gap-y-2 text-center mt-6">
                  <p className="text-heading-1 text-neutral-100 font-semibold">
                    ${selectedSeason.reward_pool_usd.toLocaleString()}
                  </p>

                  <p className="text-body-3 text-neutral-200 font-normal mt-2">
                    Amount Pooled
                  </p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
              Curating the leaderboard...
            </p>
          ) : (
            <LeaderboardTable
              activeSeason={selectedSeasonActive}
              leaderboard={leaderboard}
            />
          )}
        </>
      )}
    </main>
  );
};
