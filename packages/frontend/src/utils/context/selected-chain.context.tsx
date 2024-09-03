"use client";

import { CustomChainConfig } from "@web3auth/base";
import { CHAINS } from "common/contracts";
import { createContext, ReactNode, useContext, useState } from "react";

interface SelectedChainPropsContext {
  selectedChain: CustomChainConfig;
  setSelectedChain: React.Dispatch<React.SetStateAction<CustomChainConfig>>;
}

const SelectedChainContext = createContext({} as SelectedChainPropsContext);

export const SelectedChainContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedChain, setSelectedChain] = useState<CustomChainConfig>(
    CHAINS[0]
  );

  return (
    <SelectedChainContext.Provider
      value={{
        selectedChain,
        setSelectedChain,
      }}
    >
      {children}
    </SelectedChainContext.Provider>
  );
};

export const useSelectedChainContext = () => useContext(SelectedChainContext);
