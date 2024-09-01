"use client";

import { TOKEN_CONTRACT_ADDRESS } from "@/utils/constants/contracts.constants";
import { getTokenBalance } from "@/utils/functions/ethers";
import { web3auth } from "@/utils/service/web3auth.service";
import { CustomChainConfig } from "@web3auth/base";
import { useEffect, useState } from "react";
import BattleIcon from "@/shared/icons/BattleIcon";
import Image from "next/image";
import { minifyAddress } from "@/utils/functions/minify-address";

export const MatchHistory: React.FC<{
  selectedChain: CustomChainConfig;
}> = ({ selectedChain }) => {
  // const { user } = useWeb3AuthContext();
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const user = {
    email_id: "karanpargal007@gmail.com",
    name: "Karan Pargal",
    profile_photo:
      "https://lh3.googleusercontent.com/a/ACg8ocIJsSTDQXwXlpZTNdu0n6G-EySqxIwKJfUTewSoej7mbMF9ITIH=s96-c",
    wallet_address: "0xC1931B33dCb6E64da65D2F3c73bcDc42d2f9Ce98",
    won: 10,
    played: 20,
    score: 1000,
  };

  const fetchBalance = async () => {
    const balance = await getTokenBalance(
      web3auth.provider!,
      user.wallet_address,
      TOKEN_CONTRACT_ADDRESS[Number(selectedChain.chainId)]
    );
    setCurrentBalance(balance);
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [selectedChain, user]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <h3 className="text-heading-3 text-neutral-300 px-4">Match History</h3>
      <div className="flex flex-col justify-center items-center border border-neutral-400 mx-4 rounded-lg">
        <p className="text-body-1 text-neutral-100 bg-neutral-600 px-4 py-2 w-full rounded-t-lg">
          Game Name
        </p>
        <div className="flex justify-center items-center gap-x-6 pt-8 pb-2 border-b w-96 border-neutral-500">
          <div className="flex flex-col items-center w-full gap-y-2">
            <figure className="relative object-cover w-12 h-12">
              <Image
                alt=""
                src={user.profile_photo}
                fill
                className="rounded-full"
              />
            </figure>

            <div className="flex flex-col items-center">
              <h3 className="text-body-1 text-brand-400">You</h3>
              <p className="text-neutral-300 text-body-3">
                {minifyAddress(user.wallet_address)}
              </p>
            </div>
          </div>
          <BattleIcon className="h-20 w-20" />
          <div className="flex flex-col items-center w-full gap-y-2">
            <figure className="relative object-cover w-12 h-12">
              <Image
                alt=""
                src={user.profile_photo}
                fill
                className="rounded-full ring-semantic-launch ring-offset-6 ring-2"
              />
            </figure>

            <div className="flex flex-col items-center">
              <h3 className="text-body-1 text-neutral-100">You</h3>
              <p className="text-neutral-300 text-body-3">
                {minifyAddress(user.wallet_address)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-2 justify-start w-96 mx-2 py-2">
          <p className="text-body-3 text-status-danger border-r border-neutral-500 pr-2">
            Loss
          </p>
          <p className="text-body-3 text-neutral-100 border-r border-neutral-500 pr-2">
            <span className="text-neutral-300">Tier</span> Alpha
          </p>
          <p className="text-body-3 text-neutral-300">21 Aug 2024</p>
        </div>
      </div>
    </>
  );
};
