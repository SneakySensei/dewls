"use client";

import ChevronDown from "@/shared/icons/Chevron-Down";
import Dropdown from "./dropdown";
import { MappedSeason, ResponseWithData } from "@/utils/types";
import { useEffect, useState } from "react";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";

const SeasonsDropdown: React.FC<{
  selectedSeason: MappedSeason | null;
  setSelectedSeason: React.Dispatch<React.SetStateAction<MappedSeason | null>>;
}> = ({ selectedSeason, setSelectedSeason }) => {
  const [seasons, setSeasons] = useState<MappedSeason[] | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        if (!seasons) {
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
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return !seasons || !selectedSeason ? (
    <p className="text-center py-2 text-body-3 text-neutral-200 bg-neutral-600 rounded-lg mb-2">
      Curating the seasons...
    </p>
  ) : (
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
  );
};

export default SeasonsDropdown;
