"use client";

import Dropdown from "../shared/dropdown";
import ChevronDown from "@/shared/icons/Chevron-Down";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { web3auth } from "@/utils/service/web3auth.service";
import { CustomChainConfig } from "@web3auth/base";
import { Contracts } from "common";
import Image from "next/image";
import { useState } from "react";

export function ChainSelector() {
    const { selectedChain, chainChangeHandler } = useSelectedChainContext();
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChainChange = async (chain: CustomChainConfig) => {
        try {
            setLoading(true);
            await chainChangeHandler(chain);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dropdown
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            trigger="click"
            propagationStop
            options={[
                <div
                    key="chains-dropdown"
                    className="mt-2 max-h-96 overflow-auto rounded-lg bg-neutral-600 px-4"
                >
                    {Contracts.CHAINS.map((chain, i) => {
                        const isSelectedChain: boolean =
                            // @ts-expect-error
                            web3auth.walletAdapters.openlogin?.chainConfig
                                .chainId === chain.chainId;
                        return (
                            <div
                                key={chain.chainId}
                                className={`${
                                    isSelectedChain
                                        ? "bg-neutral-500 text-neutral-100"
                                        : "text-neutral-300"
                                } my-2 flex w-full cursor-pointer items-center gap-x-4 rounded-lg px-4 py-3 transition-all hover:text-neutral-100`}
                                onClick={() => {
                                    handleChainChange(chain);
                                }}
                            >
                                <Image
                                    src={chain.logo!}
                                    alt={chain.displayName!}
                                    width={28}
                                    height={28}
                                    className="rounded-full object-contain"
                                />
                                <p className="text-body-1 font-medium">
                                    {chain.displayName}
                                </p>
                            </div>
                        );
                    })}
                </div>,
            ]}
            dropdownClassname="w-full"
        >
            <div className="flex cursor-pointer items-center justify-between rounded-lg border border-neutral-400 px-4 py-3">
                {loading ? (
                    <p className="py-1 text-body-2 text-neutral-200">
                        Updating the chain...
                    </p>
                ) : (
                    <>
                        <div className="flex items-center gap-4">
                            <Image
                                src={selectedChain?.logo!}
                                alt={selectedChain?.displayName!}
                                width={28}
                                height={28}
                                className="rounded-full object-contain"
                            />
                            {selectedChain?.displayName}{" "}
                        </div>

                        <div
                            className={`text-neutral-300 ${dropdownOpen ? "rotate-180" : ""} transition-all`}
                        >
                            <ChevronDown />
                        </div>
                    </>
                )}
            </div>
        </Dropdown>
    );
}
