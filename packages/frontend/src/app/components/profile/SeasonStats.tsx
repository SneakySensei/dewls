import React from "react";
import SeasonDropdown from "../shared/season-dropdown";
import { MappedPlayedGame, MappedSeason } from "@/utils/types";
import { GameHistory } from "./GameHistory";

const SeasonStats: React.FC<{
  seasons: MappedSeason[];
  selectedSeason: MappedSeason;
  setSelectedSeason: React.Dispatch<
    React.SetStateAction<MappedSeason | undefined>
  >;
  selectedSeasonEnded: boolean;
  playedGames: MappedPlayedGame[];
}> = ({
  seasons,
  selectedSeason,
  setSelectedSeason,
  selectedSeasonEnded,
  playedGames,
}) => {
  return (
    <div className="mx-4">
      <h3 className="text-heading-3 text-neutral-300 my-2 mb-6">
        Season Stats
      </h3>

      <SeasonDropdown
        seasons={seasons}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        selectedSeasonEnded={selectedSeasonEnded}
      />

      <div className="flex justify-center items-center border border-neutral-400 p-4 rounded-lg mt-6 gap-x-2">
        {[
          {
            heading: "Won",
            value: 1,
          },
          {
            heading: "Played",
            value: 2,
          },
          {
            heading: "Score",
            value: 1,
          },
          {
            heading: "Rank",
            value: 1,
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
        <GameHistory key="" playedGame={game} />
      ))}
    </div>
  );
};

export default SeasonStats;
