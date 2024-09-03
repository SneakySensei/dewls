"use client";

import ChevronDown from "@/shared/icons/Chevron-Down";
import Dropdown from "./dropdown";
import { MappedSeason } from "@/utils/types";
import { useState } from "react";

const SeasonDropdown: React.FC<{
  seasons: MappedSeason[];
  selectedSeason: MappedSeason;
  setSelectedSeason: React.Dispatch<
    React.SetStateAction<MappedSeason | undefined>
  >;
  selectedSeasonEnded: boolean;
}> = ({ seasons, selectedSeason, setSelectedSeason, selectedSeasonEnded }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  return (
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

          {selectedSeasonEnded && (
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
  );
};

export default SeasonDropdown;
