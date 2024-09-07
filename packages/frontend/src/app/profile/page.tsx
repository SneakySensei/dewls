"use client";

import { ProfileHero, WalletDetails } from "../components/profile";
import SeasonStats from "../components/profile/SeasonStats";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

const Profile: React.FC = () => {
    const { user } = useWeb3AuthContext();

    const router = useRouter();

    useEffect(() => {
        if (!user) router.replace("/");
    }, []);

    if (!user) return null;

    return (
        <main className="flex flex-col gap-y-4 pb-10 text-neutral-100">
            <ProfileHero />
            <WalletDetails />

            <SeasonStats />
        </main>
    );
};

export default Profile;
