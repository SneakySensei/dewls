"use client";

import { useState } from "react";
import {
  ProfileHero,
  WalletDetails,
  ChainSelector,
} from "../components/profile";
import { CustomChainConfig } from "@web3auth/base";
import { CHAINS } from "@/utils/constants/chain-config.constant";
import { web3auth } from "@/utils/service/web3auth.service";

const Profile: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<CustomChainConfig>(
    CHAINS.find(
      (chain: CustomChainConfig) =>
        // @ts-ignore
        chain.chainId === web3auth.walletAdapters.openlogin?.chainConfig.chainId
    )!
  );

  return (
    <main className="text-neutral-100 flex flex-col gap-y-4">
      <ProfileHero />
      <WalletDetails selectedChain={selectedChain} />
      <ChainSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />
    </main>
  );
};

export default Profile;
