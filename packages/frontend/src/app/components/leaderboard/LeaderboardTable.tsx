"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { truncate } from "@/utils/functions/truncate";
import { MappedLeaderboard } from "@/utils/types";
import Image from "next/image";
import React from "react";

const LeaderboardTable: React.FC<{
  leaderboard: MappedLeaderboard[];
}> = ({ leaderboard }) => {
  const { user } = useWeb3AuthContext();

  const headings = ["#", "User", "Won", "Lost", "Score"];

  const rankingClasses: {
    score: [string, string, string];
    indicator: [string, string, string];
    wrapperBgImage: [string, string, string];
  } = {
    score: ["", "", ""],
    indicator: ["bg-[#F6D887]", "bg-[#CCCCCC]", "bg-[#D3A085]"],
    wrapperBgImage: [
      "linear-gradient(90deg, rgba(246, 216, 135, 0.2) 0.5%, rgba(246, 216, 135, 0) 50%)",
      "linear-gradient(90deg, rgba(204, 204, 204, 0.2) 0.5%, rgba(204, 204, 204, 0) 50%)",
      "linear-gradient(90deg, rgba(211, 160, 133, 0.2) 0.5%, rgba(211, 160, 133, 0) 50%)",
    ],
  };

  const rankingWreathImages: [string, string, string] = [
    "/rank-one-wreath.png",
    "/rank-two-wreath.png",
    "/rank-three-wreath.png",
  ];

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
            (
              {
                player_id,
                profile_photo,
                name,
                wallet_address,
                games_won,
                games_played,
                total_points,
              },
              i
            ) => {
              const you = user?.data.player_id === player_id;

              return (
                <div
                  key={player_id}
                  className={`${i < 3 ? "rankingClasses[i]" : ""} ${
                    you
                      ? "text-brand-400 border-brand-400"
                      : "border-neutral-600"
                  } grid grid-cols-12 gap-2 py-4 items-center text-center bg-neutral-600 mb-4 relative rounded-lg border`}
                  style={{
                    backgroundImage: rankingClasses.wrapperBgImage[i],
                  }}
                >
                  {i < 3 ? (
                    <>
                      <div
                        className={`${rankingClasses.indicator[i]} absolute h-3/4 w-0.5 rounded-full`}
                      />

                      <Image
                        alt=""
                        src={rankingWreathImages[i]}
                        height={22}
                        width={24}
                        className="col-span-2 mx-auto"
                      />
                    </>
                  ) : (
                    <p className="col-span-2">{i + 1}</p>
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
                    {games_won}
                  </p>

                  <p className="col-span-2 text-center text-neutral-200">
                    {games_played}
                  </p>

                  <p
                    className={`${
                      i < 3 ? rankingClasses.score[i] : ""
                    } col-span-2 text-center text-white`}
                  >
                    {total_points}
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
