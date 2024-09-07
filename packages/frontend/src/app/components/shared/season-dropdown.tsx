"use client";

import { timestampParser } from "../../../utils/functions/timestamp-parser";
import Dropdown from "./dropdown";
import ChevronDown from "@/shared/icons/Chevron-Down";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { MappedSeason, ResponseWithData } from "@/utils/types";
import { useEffect, useState } from "react";

const SeasonsDropdown: React.FC<{
    selectedSeason: MappedSeason | null;
    setSelectedSeason: React.Dispatch<
        React.SetStateAction<MappedSeason | null>
    >;
}> = ({ selectedSeason, setSelectedSeason }) => {
    const [seasons, setSeasons] = useState<MappedSeason[] | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                if (!seasons) {
                    const seasonsRes = await fetch(
                        `${API_REST_BASE_URL}/seasons`,
                        {
                            cache: "no-cache",
                        },
                    );
                    const seasonsResponse =
                        (await seasonsRes.json()) as ResponseWithData<
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
        <p className="mb-2 rounded-lg bg-neutral-600 py-2 text-center text-body-3 text-neutral-200">
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
                    className="mt-2 max-h-96 overflow-auto rounded-lg bg-neutral-600 px-4"
                >
                    {seasons.map((season, i) => (
                        <div
                            key={season.season_id}
                            className={`${
                                selectedSeason.season_id === season.season_id
                                    ? "bg-neutral-500 text-neutral-100"
                                    : ""
                            } my-4 flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-neutral-300 transition-all hover:text-neutral-100`}
                            onClick={() => {
                                setSelectedSeason(season);
                                setDropdownOpen(false);
                            }}
                        >
                            <p className="text-body-1 font-medium">
                                {season.name}
                            </p>

                            {season.ended_on > new Date().toISOString() ? (
                                <span className="rounded-2xl bg-status-success px-3 py-1 text-body-4 font-medium leading-none text-neutral-500">
                                    LIVE
                                </span>
                            ) : (
                                <p className="text-body-4">
                                    Ended on {timestampParser(season.ended_on)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>,
            ]}
            dropdownClassname="w-full"
        >
            <div className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-400 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span>{selectedSeason.name}</span>

                    {selectedSeason.ended_on > new Date().toISOString() && (
                        <span className="rounded-2xl bg-status-success px-3 py-1 text-body-4 font-medium leading-none text-neutral-500">
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
