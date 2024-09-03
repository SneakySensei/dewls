"use client";

import { IProvider } from "@web3auth/base";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { MappedPlayer } from "../types";

export type AuthUser = { data: MappedPlayer; token: string };

interface Web3AuthContextProps {
  provider: IProvider | null;
  setProvider: React.Dispatch<React.SetStateAction<IProvider | null>>;
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const Web3AuthContext = createContext({} as Web3AuthContextProps);

export const Web3AuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <Web3AuthContext.Provider
      value={{
        provider,
        setProvider,
        user,
        setUser,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3AuthContext = () => useContext(Web3AuthContext);
