"use client";

import { ChainSelector } from "./ChainSelector";
import CopyIcon from "@/shared/icons/CopyIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { getTokenBalance } from "@/utils/functions/ethers";
import { web3auth } from "@/utils/service/web3auth.service";
import { Contracts } from "common";
import { useEffect, useState } from "react";

export function WalletDetails() {
    const { user } = useWeb3AuthContext();
    const { selectedChain } = useSelectedChainContext();
    const [currentBalance, setCurrentBalance] = useState<string>("0");

    useEffect(() => {
        (async () => {
            try {
                if (!user) {
                    return;
                }

                const balance = await getTokenBalance(
                    web3auth.provider!,
                    user.data.wallet_address,
                    Contracts.TOKEN_CONTRACT_ADDRESS[
                        Number(selectedChain.chainId)
                    ],
                );
                setCurrentBalance(balance);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [selectedChain, user]);

    if (!user) return null;

    return (
        <>
            <h3 className="mx-4 my-2 text-heading-3 text-neutral-300">
                Wallet Details
            </h3>
            <ChainSelector />
            <div className="mx-4 flex flex-col items-center justify-center rounded-lg border border-neutral-400">
                <p className="w-full rounded-t-lg bg-neutral-600 px-4 py-2 text-body-1 text-neutral-100">
                    Connected Wallet
                </p>
                <div className="my-2 flex items-center gap-x-2 border-b border-neutral-500 px-8 py-4">
                    <p className="text-body-2 text-neutral-200">
                        {user.data.wallet_address.toUpperCase()}
                    </p>
                    <CopyIcon
                        className="cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                user.data.wallet_address,
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between gap-x-2 px-8 py-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-body-2 text-neutral-200">Balance</p>
                        <p className="text-body-1 text-neutral-100">
                            {currentBalance} USDT
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                        <p className="flex-1 text-body-2 text-neutral-200">
                            Chain ID
                        </p>
                        <p className="flex-1 text-body-1 text-neutral-100">
                            {selectedChain && selectedChain.chainId}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
