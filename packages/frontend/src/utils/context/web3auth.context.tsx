// context/Web3AuthContext/stateProvider.context.js
"use client";
import { IProvider } from "@web3auth/base";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Web3AuthContextProps {
  provider: IProvider | null;
  setProvider: React.Dispatch<React.SetStateAction<IProvider | null>>;
}

const Web3AuthContext = createContext({} as Web3AuthContextProps);

export const Web3AuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [provider, setProvider] = useState<IProvider | null>(null);

  return (
    <Web3AuthContext.Provider value={{ provider, setProvider }}>
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3AuthContext = () => useContext(Web3AuthContext);
