"use client";

import { API_REST_BASE_URL } from "../constants/api.constant";
import { MappedSeason, ResponseWithData } from "../types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type ActiveSeasonContext = {
    activeSeason?: MappedSeason;
};

const ActiveSeasonContext = createContext<ActiveSeasonContext>({});

export default function ActiveSeasonProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [activeSeason, setActiveSeason] = useState<MappedSeason>();
    useEffect(() => {
        (async () => {
            const seasonsRes = await fetch(
                `${API_REST_BASE_URL}/seasons/current`,
            );
            const seasonsResponse =
                (await seasonsRes.json()) as ResponseWithData<MappedSeason>;
            if (seasonsResponse.success) {
                setActiveSeason(seasonsResponse.data);
            }
        })();
    }, []);

    return (
        <ActiveSeasonContext.Provider value={{ activeSeason: activeSeason }}>
            {children}
        </ActiveSeasonContext.Provider>
    );
}

export function useActiveSeasonContext() {
    return useContext(ActiveSeasonContext);
}
