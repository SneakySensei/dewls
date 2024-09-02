"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { truncate } from "@/utils/functions/truncate";
import { MappedLeaderboard } from "@/utils/types";
import Image from "next/image";
import React from "react";

const LeaderboardTable: React.FC<{
  activeSeason: boolean;
  leaderboard: MappedLeaderboard[];
}> = ({ activeSeason, leaderboard: initialLeaderboard }) => {
  const { user } = useWeb3AuthContext();

  const leaderboard = activeSeason
    ? initialLeaderboard
    : initialLeaderboard.slice(3);

  const headings = ["#", "User", "Won", "Played", "Score"];

  const rankingClasses: {
    score: [string, string, string];
    indicator: [string, string, string];
    wrapper: [string, string, string];
  } = {
    score: [
      "bg-[linear-gradient(180deg,_#FCE19A_0%,_#BD9350_100%)] text-transparent bg-clip-text",
      "bg-[linear-gradient(180deg,_#F1F8FF_0%,_#7C8186_100%)] text-transparent bg-clip-text",
      "bg-[linear-gradient(180deg,_#FFDDC6_0%,_#9E7259_100%)] text-transparent bg-clip-text",
    ],
    indicator: ["bg-[#F6D887]", "bg-[#CCCCCC]", "bg-[#D3A085]"],
    wrapper: [
      "bg-[linear-gradient(90deg,_rgba(246,216,135,0.2)_0.5%,_rgba(246,216,135,0)_50%)]",
      "bg-[linear-gradient(90deg,_rgba(204,204,204,0.2)_0.5%,_rgba(204,204,204,0)_50%)]",
      "bg-[linear-gradient(90deg,_rgba(211,160,133,0.2)_0.5%,_rgba(211,160,133,0)_50%)]",
    ],
  };

  const rankingWreathImages: [string, string, string] = [
    "/rank-one-wreath.png",
    "/rank-two-wreath.png",
    "/rank-three-wreath.png",
  ];

  const yourIndex = leaderboard.findIndex(
    ({ player_id }) => user?.data.player_id === player_id
  );

  return (
    <div className="w-full bg-neutral-700 rounded-lg text-left mb-4 pb-2">
      <div className="grid grid-cols-12 text-neutral-300 font-normal text-body-2 p-4 gap-2">
        {headings.map((heading, i) => (
          <div
            key={heading}
            className={`${
              i === 1 ? "col-span-4 text-left" : `col-span-2 text-center`
            }`}
          >
            {heading}
          </div>
        ))}
      </div>

      <div className="px-4">
        {!leaderboard.length ? (
          <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
            The first game of this season awaits!
          </p>
        ) : (
          leaderboard.map(
            ({
              player_id,
              profile_photo,
              name,
              wallet_address,
              games_won,
              games_played,
              total_points,
              rank,
            }) => {
              const you = user?.data.player_id === player_id;
              const rankStyles = rank && rank <= 3 && activeSeason;

              return (
                <div
                  key={player_id}
                  className={`${
                    you
                      ? "text-brand-400 border-brand-400"
                      : "border-neutral-600"
                  } ${
                    rankStyles ? rankingClasses.wrapper[rank - 1] : ""
                  } grid grid-cols-12 gap-2 py-4 items-center text-center bg-neutral-600 mb-4 relative rounded-lg border`}
                >
                  {rankStyles ? (
                    <>
                      <div
                        className={`${rankingClasses.indicator[rank - 1]} absolute h-3/4 w-0.5 rounded-full`}
                      />

                      <Image
                        alt=""
                        src={rankingWreathImages[rank - 1]}
                        height={22}
                        width={24}
                        className="col-span-2 mx-auto"
                      />
                    </>
                  ) : (
                    <p className="col-span-2">{rank}</p>
                  )}

                  <div className="col-span-4 flex items-center text-left">
                    {profile_photo && (
                      <Image
                        alt=""
                        src={profile_photo}
                        height={36}
                        width={36}
                        className="rounded-full mr-4"
                      />
                    )}

                    <div className="text-ellipsis truncate w-full">
                      <p
                        className={`${you ? "text-brand-400" : ""} font-medium text-ellipsis w-full truncate`}
                      >
                        {name}
                      </p>

                      <p className="text-body-3 text-neutral-300">
                        {truncate(wallet_address).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <p className="col-span-2 text-center text-neutral-200">
                    {games_won?.toLocaleString()}
                  </p>

                  <p className="col-span-2 text-center text-neutral-200">
                    {games_played?.toLocaleString()}
                  </p>

                  <p className="col-span-2 text-center text-white">
                    <span
                      className={`${rankStyles ? rankingClasses.score[rank - 1] : ""}`}
                    >
                      {total_points?.toLocaleString()}
                    </span>
                  </p>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
};

export default LeaderboardTable;
