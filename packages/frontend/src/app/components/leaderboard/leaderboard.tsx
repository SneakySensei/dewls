"use client";

import { MappedLeaderboard, MappedSeason } from "@/utils/types";
import LeaderboardTable from "./LeaderboardTable";
import Image from "next/image";
import Dropdown from "../shared/dropdown";
import { useState } from "react";
import ChevronDown from "@/shared/icons/Chevron-Down";

export const Leaderboard: React.FC<{
  seasons: MappedSeason[];
  leaderboard: MappedLeaderboard[];
}> = ({ leaderboard, seasons }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<MappedSeason>(
    seasons[0]
  );
  const liveSeason = seasons[0];

  const columns = [
    { header: "#", key: "rank" },
    { header: "User", key: "user" },
    { header: "Won", key: "games_won" },
    { header: "Lost", key: "games_lost" },
    { header: "Score", key: "total_score" },
  ];

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <main className="text-neutral-100 flex flex-col gap-y-6">
      <h1 className="text-heading-1 font-bold text-center tracking-widest font-display">
        Leaderboard
      </h1>

      <div className="px-6">
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
              {seasons.map((season, i) => {
                const isActive: boolean =
                  liveSeason.season_id === season.season_id;
                return (
                  <div
                    key={season.season_id}
                    className={`${
                      isActive ? "bg-neutral-500" : ""
                    } rounded-lg py-3 px-4 my-4 flex items-center justify-between w-full text-neutral-300 hover:text-neutral-100 transition-all cursor-pointer`}
                    onClick={() => {
                      setSelectedSeason(season);
                      setDropdownOpen(false);
                    }}
                  >
                    <p className="font-medium text-body-1">
                      Season {seasons.length - i}
                    </p>

                    {isActive ? (
                      <span className="px-3 py-2 font-medium leading-none text-body-4 text-neutral-500 bg-status-success rounded-2xl">
                        LIVE
                      </span>
                    ) : (
                      <p className="text-body-4">
                        Ended on {new Date(season.ended_on).getDate()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>,
          ]}
          dropdownClassname="w-full"
        >
          <div className="cursor-pointer border-neutral-400 border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              Season{" "}
              {seasons.length -
                seasons.findIndex(
                  ({ season_id }) => selectedSeason.season_id === season_id
                )}
              {liveSeason.season_id === selectedSeason.season_id && (
                <span className="px-3 py-2 font-medium leading-none text-body-4 text-neutral-500 bg-status-success rounded-2xl">
                  LIVE
                </span>
              )}
            </div>

            <div
              className={`text-neutral-300 ${dropdownOpen ? "" : "rotate-180"} transition-all`}
            >
              <ChevronDown />
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="h-48 w-full flex flex-col items-center justify-center gap-y-4 bg-reward-pool-banner">
        <Image
          src="/leaderboard-coin.svg"
          alt="Leaderboard Coins"
          width={116}
          height={96}
        />
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-heading-1 text-neutral-100 font-semibold">
            $34,000
          </p>
          <p className="text-body-3 text-neutral-200 font-normal">
            Amount Collected
          </p>
        </div>
      </div>
      <div>
        <LeaderboardTable columns={columns} data={[]} />
      </div>
    </main>
  );
};
