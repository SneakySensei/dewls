"use client";

import { ChainSelector } from "./ChainSelector";
import BalanceIcon from "@/shared/icons/BalanceIcon";
import CopyIcon from "@/shared/icons/CopyIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { toast } from "sonner";

export function WalletDetails() {
    const { user } = useWeb3AuthContext();
    const { selectedChain, chainBalance, nativeBalance } =
        useSelectedChainContext();

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
                <p className="w-full rounded-t-lg bg-neutral-600 px-4 py-3 text-body-1 text-neutral-100">
                    Connected Wallet
                </p>
                <div className="my-2 flex w-[90%] items-center justify-between gap-x-2 border-b border-neutral-500 py-4">
                    <p className="text-body-2 text-neutral-200">
                        {user.data.wallet_address.toUpperCase()}
                    </p>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                user.data.wallet_address,
                            );
                            toast("Copied to clipboard");
                        }}
                    >
                        <CopyIcon className="cursor-pointer" />
                    </button>
                </div>
                <div className="flex w-full justify-between gap-x-2 px-8 py-4">
                    <div className="flex flex-col gap-2">
                        <p className="flex items-center gap-1 text-body-2 text-neutral-200">
                            <BalanceIcon />
                            Balance
                        </p>
                        <p className="text-body-1 text-neutral-100">
                            {!selectedChain || chainBalance === null
                                ? "..."
                                : `${chainBalance} USDT`}{" "}
                            <span className="text-neutral-300">|</span>{" "}
                            {nativeBalance} {selectedChain?.ticker}
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
