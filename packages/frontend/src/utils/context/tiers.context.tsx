"use client";

import { MappedGameTier } from "../types";
import { createContext, ReactNode, useContext } from "react";

type TierContext = {
    tiers: MappedGameTier[];
};

const TierContext = createContext<TierContext>({ tiers: [] });

export default function TierContextProvider({
    children,
    tiers,
}: {
    children: ReactNode;
    tiers: MappedGameTier[];
}) {
    return (
        <TierContext.Provider value={{ tiers }}>
            {children}
        </TierContext.Provider>
    );
}

export function useTierContext() {
    return useContext(TierContext);
}
