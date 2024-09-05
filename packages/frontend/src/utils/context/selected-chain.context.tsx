"use client";

import { getTokenBalance } from "../functions/ethers";
import { web3auth } from "../service/web3auth.service";
import { useWeb3AuthContext } from "./web3auth.context";
import { CustomChainConfig } from "@web3auth/base";
import { Contracts } from "common";
import { CHAINS } from "common/contracts";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface SelectedChainPropsContext {
    selectedChain: CustomChainConfig | null;
    chainBalance: string | null;
    chainChangeHandler: (chain: CustomChainConfig) => Promise<void>;
}

const SelectedChainContext = createContext({} as SelectedChainPropsContext);

export const SelectedChainContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useWeb3AuthContext();

    const [selectedChain, setSelectedChain] =
        useState<CustomChainConfig | null>(CHAINS[0]);
    const [chainBalance, setChainBalance] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                if (!user || !selectedChain) {
                    return;
                }
                setChainBalance(null);
                const balance = await getTokenBalance(
                    web3auth.provider!,
                    user.data.wallet_address,
                    Contracts.TOKEN_CONTRACT_ADDRESS[
                        Number(selectedChain.chainId)
                    ],
                );
                setChainBalance(balance);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [selectedChain, user]);

    const chainChangeHandler = async (chain: CustomChainConfig) => {
        setSelectedChain(null);
        await web3auth.addChain(chain);
        await web3auth.switchChain({ chainId: chain.chainId });
        setSelectedChain(chain);
    };

    return (
        <SelectedChainContext.Provider
            value={{
                selectedChain,
                chainBalance,
                chainChangeHandler,
            }}
        >
            {children}
        </SelectedChainContext.Provider>
    );
};

export const useSelectedChainContext = () => useContext(SelectedChainContext);
