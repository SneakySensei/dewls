"use client";

import { ProfileHero, WalletDetails } from "../components/profile";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import SeasonStats from "../components/profile/SeasonStats";

const Profile: React.FC = () => {
  const { selectedChain, setSelectedChain } = useSelectedChainContext();

  return (
    <main className="text-neutral-100 flex flex-col gap-y-4 pb-10">
      <ProfileHero />
      <WalletDetails
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />

      <SeasonStats />
    </main>
  );
};

export default Profile;
