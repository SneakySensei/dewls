"use client";

import { CHAINS } from "@/utils/constants/chain-config.constant";
import Dropdown from "../shared/dropdown";
import { useState } from "react";
import { CustomChainConfig } from "@web3auth/base";
import ChevronDown from "@/shared/icons/Chevron-Down";
import Image from "next/image";
import { web3auth } from "@/utils/service/web3auth.service";

export const ChainSelector: React.FC<{
  selectedChain: CustomChainConfig;
  setSelectedChain: (chain: CustomChainConfig) => void;
}> = ({ selectedChain, setSelectedChain }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleChainChange = async (chain: CustomChainConfig) => {
    await web3auth.addChain(chain);
    await web3auth.switchChain({ chainId: chain.chainId });
    setSelectedChain(chain);
    setDropdownOpen(false);
  };

  return (
    <div className="px-6">
      <Dropdown
        open={dropdownOpen}
        setOpen={setDropdownOpen}
        trigger="click"
        propagationStop
        options={[
          <div
            key="chains-dropdown"
            className="bg-neutral-600 mt-2 rounded-lg px-4 max-h-96 overflow-auto"
          >
            {CHAINS.map((chain, i) => {
              const isSelectedChain: boolean =
                // @ts-ignore
                web3auth.walletAdapters.openlogin?.chainConfig.chainId ===
                chain.chainId;
              return (
                <div
                  key={chain.chainId}
                  className={`${
                    isSelectedChain
                      ? "bg-neutral-500 text-neutral-100"
                      : "text-neutral-300"
                  } rounded-lg py-3 px-4 my-4 flex items-center gap-x-4 w-full hover:text-neutral-100 transition-all cursor-pointer`}
                  onClick={() => {
                    handleChainChange(chain);
                  }}
                >
                  <Image
                    src={chain.logo!}
                    alt={chain.displayName!}
                    width={28}
                    height={28}
                    className="rounded-full object-contain "
                  />
                  <p className="font-medium text-body-1">{chain.displayName}</p>
                </div>
              );
            })}
          </div>,
        ]}
        dropdownClassname="w-full"
      >
        <div className="cursor-pointer border-neutral-400 border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={selectedChain?.logo!}
              alt={selectedChain?.displayName!}
              width={28}
              height={28}
              className="rounded-full object-contain "
            />
            {selectedChain?.displayName}{" "}
          </div>

          <div
            className={`text-neutral-300 ${dropdownOpen ? "" : "rotate-180"} transition-all`}
          >
            <ChevronDown />
          </div>
        </div>
      </Dropdown>
    </div>
  );
};
