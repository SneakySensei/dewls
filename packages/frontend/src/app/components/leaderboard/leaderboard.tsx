"use client";

import coinsLottie from "../../../../public/leaderboard-coins.json";
import SeasonsDropdown from "../shared/season-dropdown";
import LeaderboardTable from "./LeaderboardTable";
import RankOne from "./rank-one";
import RankThree from "./rank-three";
import RankTwo from "./rank-two";
import StarIcon from "@/shared/icons/StarIcon";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { calculatePercentage } from "@/utils/functions/calculate-percentage";
import { timestampParser } from "@/utils/functions/timestamp-parser";
import { truncate } from "@/utils/functions/truncate";
import {
    MappedLeaderboard,
    MappedSeason,
    ResponseWithData,
} from "@/utils/types";
import {
    rankOwnRewardPercentage,
    rankThreeRewardPercentage,
    rankTwoRewardPercentage,
} from "common";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";

export const Leaderboard: React.FC = () => {
    const [selectedSeason, setSelectedSeason] = useState<MappedSeason | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [leaderboard, setLeaderboard] = useState<MappedLeaderboard[] | null>(
        null,
    );

    useEffect(() => {
        (async () => {
            try {
                if (!selectedSeason) {
                    return;
                }
                setLoading(true);
                setLeaderboard(null);

                const leaderboardRes = await fetch(
                    `${API_REST_BASE_URL}/leaderboard/${selectedSeason.season_id}`,
                    {
                        cache: "no-cache",
                    },
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
        <main className="gap-y-6 text-neutral-100">
            <h1 className="py-6 text-center font-display text-heading-1 font-bold tracking-widest">
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
                    } mb-4 mt-2 py-2 text-center text-body-3 font-light`}
                >
                    {selectedSeason &&
                        (selectedSeasonActive
                            ? `Season ends on ${timestampParser(selectedSeason.ended_on)}`
                            : `Season ended on ${timestampParser(selectedSeason.ended_on)}`)}
                </p>
            </div>

            {selectedSeason && leaderboard && (
                <>
                    <div className="mx-4 justify-center">
                        {!selectedSeasonActive ? (
                            <div className="grid h-80 grid-cols-3">
                                {leaderboard[1] ? (
                                    <div className="flex flex-col justify-end truncate text-ellipsis bg-[linear-gradient(0deg,_rgba(204,204,204,0.2)_0%,_rgba(204,204,204,0)_56.58%)] px-2 pb-6 pt-16 text-center">
                                        <RankTwo
                                            className="mx-auto h-24 w-24"
                                            profile_photo={
                                                leaderboard[1].profile_photo!
                                            }
                                        />

                                        <p className="w-full truncate text-ellipsis text-body-1 font-medium">
                                            {leaderboard[1].name}
                                        </p>

                                        <p className="w-full text-body-3 text-neutral-200">
                                            {truncate(
                                                leaderboard[1].wallet_address,
                                            ).toUpperCase()}
                                        </p>

                                        <div className="flex w-full items-center justify-center gap-1 text-body-3 text-neutral-200">
                                            <StarIcon solid />
                                            {leaderboard[1].total_points?.toLocaleString()}
                                        </div>

                                        <p
                                            className={`mt-4 bg-[linear-gradient(180deg,_#F1F8FF_0%,_#7C8186_100%)] bg-clip-text text-heading-2 font-semibold text-transparent`}
                                        >
                                            $
                                            {calculatePercentage(
                                                selectedSeason.reward_pool_usd,
                                                rankTwoRewardPercentage,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ) : (
                                    <span />
                                )}

                                {leaderboard[0] ? (
                                    <div className="flex flex-col justify-end truncate text-ellipsis bg-[linear-gradient(0deg,_rgba(246,216,135,0.24)_0%,_rgba(246,216,135,0)_95.04%)] px-2 pb-6 pt-16 text-center">
                                        <RankOne
                                            className="mx-auto h-28 w-28"
                                            profile_photo={
                                                leaderboard[0].profile_photo!
                                            }
                                        />

                                        <p className="w-full truncate text-ellipsis text-body-1 font-medium">
                                            {leaderboard[0].name}
                                        </p>

                                        <p className="w-full text-body-3 text-neutral-200">
                                            {truncate(
                                                leaderboard[0].wallet_address,
                                            ).toUpperCase()}
                                        </p>

                                        <div className="flex w-full items-center justify-center gap-1 text-body-3 text-neutral-200">
                                            <StarIcon solid />
                                            {leaderboard[0].total_points?.toLocaleString()}
                                        </div>

                                        <p
                                            className={`mt-12 bg-[linear-gradient(180deg,_#FCE19A_0%,_#BD9350_100%)] bg-clip-text text-heading-2 font-semibold text-transparent`}
                                        >
                                            $
                                            {calculatePercentage(
                                                selectedSeason.reward_pool_usd,
                                                rankOwnRewardPercentage,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ) : (
                                    <span />
                                )}

                                {leaderboard[2] ? (
                                    <div className="flex flex-col justify-end truncate text-ellipsis bg-[linear-gradient(0deg,_rgba(211,160,133,0.2)_0%,_rgba(211,160,133,0)_71.8%)] px-2 pb-6 pt-16 text-center">
                                        <RankThree
                                            className="mx-auto h-24 w-24"
                                            profile_photo={
                                                leaderboard[2].profile_photo!
                                            }
                                        />

                                        <p className="w-full truncate text-ellipsis text-body-1 font-medium">
                                            {leaderboard[2].name}
                                        </p>

                                        <p className="w-full text-body-3 text-neutral-200">
                                            {truncate(
                                                leaderboard[2].wallet_address,
                                            ).toUpperCase()}
                                        </p>

                                        <div className="flex w-full items-center justify-center gap-1 text-body-3 text-neutral-200">
                                            <StarIcon solid />
                                            {leaderboard[2].total_points?.toLocaleString()}
                                        </div>

                                        <p
                                            className={`mt-4 bg-[linear-gradient(180deg,_#FFDDC6_0%,_#9E7259_100%)] bg-clip-text text-heading-2 font-semibold text-transparent`}
                                        >
                                            $
                                            {calculatePercentage(
                                                selectedSeason.reward_pool_usd,
                                                rankThreeRewardPercentage,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ) : (
                                    <span />
                                )}
                            </div>
                        ) : (
                            <div className="mb-4 h-48 w-full overflow-hidden rounded-xl border border-purple-500 bg-active-leaderboard bg-cover bg-center">
                                <figure className="mx-auto h-28 scale-[2]">
                                    <Lottie
                                        options={{
                                            loop: false,
                                            autoplay: true,
                                            animationData: coinsLottie,
                                        }}
                                    />
                                </figure>

                                <div className="mt-4 text-center">
                                    <p className="text-heading-1 font-semibold text-neutral-100">
                                        {selectedSeason.reward_pool_usd.toLocaleString()}{" "}
                                        USDT
                                    </p>

                                    <p className="mt-1 text-body-3 font-normal text-neutral-200">
                                        Amount Pooled
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <p className="mb-2 rounded-lg bg-neutral-600 py-2 text-center text-body-3 text-neutral-200">
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
