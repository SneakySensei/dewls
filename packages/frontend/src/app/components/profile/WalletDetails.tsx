"use client";

import { ChainSelector } from "./ChainSelector";
import BalanceIcon from "@/shared/icons/BalanceIcon";
import CopyIcon from "@/shared/icons/CopyIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { truncate } from "@/utils/functions/truncate";
import { toast } from "sonner";

export function WalletDetails() {
    const { user } = useWeb3AuthContext();
    const { selectedChain, chainBalance, nativeBalance } =
        useSelectedChainContext();

    if (!user) return null;

    return (
        <section className="mt-6">
            <h3 className="mb-4 text-heading-3 text-neutral-300">
                Wallet Details
            </h3>
            <ChainSelector />

            <article className="mt-4 rounded-lg border border-neutral-400">
                <header className="w-full rounded-t-lg bg-neutral-600 px-3 py-2 text-body-1 font-medium">
                    Connected Wallet
                </header>
                <div className="px-3 py-4">
                    <div className="flex items-center justify-between gap-x-2 border-b border-neutral-500 px-1 pb-3">
                        <p className="text-body-2 text-neutral-200">
                            {truncate(user.data.wallet_address).toUpperCase()}
                        </p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    user.data.wallet_address,
                                );
                                toast("Copied to clipboard");
                            }}
                        >
                            <CopyIcon className="size-4" />
                        </button>
                    </div>
                    <div className="mt-4 flex w-full justify-between gap-x-2">
                        <div>
                            <p className="flex items-center gap-x-0.5 text-body-2 font-medium text-neutral-200">
                                <BalanceIcon className="size-4" />
                                Balance
                            </p>
                            <p className="mt-0.5 text-body-1 font-medium">
                                {!selectedChain || chainBalance === null
                                    ? "..."
                                    : `${chainBalance} USDT`}{" "}
                                <span className="text-neutral-300">|</span>{" "}
                                {nativeBalance} {selectedChain?.ticker}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-body-2 font-medium text-neutral-200">
                                Chain ID
                            </p>
                            <p className="mt-0.5 text-body-1 font-medium">
                                {selectedChain ? selectedChain.chainId : "..."}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}
