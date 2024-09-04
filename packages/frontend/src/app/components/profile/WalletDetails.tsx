"use client";

import { ChainSelector } from "./ChainSelector";
import CopyIcon from "@/shared/icons/CopyIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";

export function WalletDetails() {
    const { user } = useWeb3AuthContext();
    const { selectedChain, chainBalance } = useSelectedChainContext();

    if (!user) return null;

    return (
        <>
            <h3 className="mx-4 my-2 text-heading-3 text-neutral-300">
                Wallet Details
            </h3>

            <div className="px-4">
                <ChainSelector />
            </div>

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
                            {!selectedChain || chainBalance === null
                                ? "..."
                                : `${chainBalance} USDT`}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                        <p className="flex-1 text-body-2 text-neutral-200">
                            Chain ID
                        </p>
                        <p className="flex-1 text-body-1 text-neutral-100">
                            {selectedChain ? selectedChain.chainId : "..."}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
