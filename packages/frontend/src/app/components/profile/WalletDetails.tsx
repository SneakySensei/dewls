"use client";

import CopyIcon from "@/shared/icons/CopyIcon";
import { getTokenBalance } from "@/utils/functions/ethers";
import { web3auth } from "@/utils/service/web3auth.service";
import { CustomChainConfig } from "@web3auth/base";
import { useEffect, useState } from "react";
import { ChainSelector } from "./ChainSelector";
import { Contracts } from "common";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";

export const WalletDetails: React.FC<{
  selectedChain: CustomChainConfig;
  setSelectedChain: (chain: CustomChainConfig) => void;
}> = ({ selectedChain, setSelectedChain }) => {
  const { user } = useWeb3AuthContext();
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
          Contracts.TOKEN_CONTRACT_ADDRESS[Number(selectedChain.chainId)]
        );
        setCurrentBalance(balance);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedChain, user]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <h3 className="text-heading-3 text-neutral-300 my-2 mx-4">
        Wallet Details
      </h3>
      <ChainSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />
      <div className="flex flex-col justify-center items-center border border-neutral-400 mx-4 rounded-lg">
        <p className="text-body-1 text-neutral-100 bg-neutral-600 px-4 py-2 w-full rounded-t-lg">
          Connected Wallet
        </p>
        <div className="flex items-center gap-x-2 py-4 my-2 px-8 border-b border-neutral-500">
          <p className="text-body-2 text-neutral-200">
            {user.data.wallet_address.toUpperCase()}
          </p>
          <CopyIcon
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(user.data.wallet_address);
            }}
          />
        </div>
        <div className="flex justify-between gap-x-2 py-4 px-8 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-body-2 text-neutral-200">Balance</p>
            <p className="text-body-1 text-neutral-100">
              {currentBalance} USDT
            </p>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <p className="flex-1 text-body-2 text-neutral-200">Chain ID</p>
            <p className="flex-1 text-body-1 text-neutral-100">
              {selectedChain && selectedChain.chainId}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
