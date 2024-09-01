"use client";

import CopyIcon from "@/shared/icons/CopyIcon";
import { TOKEN_CONTRACT_ADDRESS } from "@/utils/constants/contracts.constants";
import { getTokenBalance } from "@/utils/functions/ethers";
import { web3auth } from "@/utils/service/web3auth.service";
import { useEffect, useState } from "react";

export const WalletDetails: React.FC = () => {
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
      TOKEN_CONTRACT_ADDRESS[Number(web3auth.coreOptions.chainConfig?.chainId!)]
    );
    setCurrentBalance(balance);
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, []);

  if (!user) {
    return <></>;
  }

  console.log(currentBalance);

  return (
    <>
      <div className="flex flex-col justify-center items-center border border-neutral-400 mx-4 rounded-lg">
        <p className="text-body-1 text-neutral-100 bg-neutral-600 px-4 py-2 w-full rounded-t-lg">
          Connected Wallet
        </p>
        <div className="flex items-center gap-x-2 py-4 my-2 px-8 border-b border-neutral-500">
          <p className="text-body-2 text-neutral-200">{user.wallet_address}</p>
          <CopyIcon
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(user.wallet_address);
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
              {web3auth.coreOptions.chainConfig?.chainId}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
