"use client";

import Wordmark from "@/assets/branding/wordmark.svg";
import { SparklesCore } from "@/shared/Sparkles";
import { useActiveSeasonContext } from "@/utils/context/season.context";
import { useTierContext } from "@/utils/context/tiers.context";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";

export default function Header() {
    const { tiers } = useTierContext();
    const { activeSeason } = useActiveSeasonContext();
    const pathname = usePathname();

    const isGamesListingPage = pathname === "/";
    const isGamesPage = pathname.startsWith("/games");
    const params = useParams();
    console.log(params);

    if (!isGamesListingPage && !isGamesPage) return null;

    const tier = params.tier_id
        ? tiers.find((tier) => tier.tier_id === params.tier_id)
        : undefined;

    return (
        <header
            className={clsx(
                "relative flex items-center justify-center px-4 text-center",
                isGamesPage ? "py-4" : "py-6",
            )}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-logo-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            ></motion.div>
            <Image
                src={Wordmark}
                alt="Logo"
                className={clsx(
                    "block h-7 w-auto",
                    isGamesPage ? "mr-auto" : "mx-auto",
                )}
            />
            {isGamesPage && tier && (
                <div className="ml-auto text-right text-body-3">
                    <div>
                        <span className="mr-0.5 text-neutral-200">Season:</span>{" "}
                        {activeSeason?.name}
                    </div>
                    <div>
                        <span className="mr-0.5 text-neutral-200">Tier:</span>{" "}
                        {tier.name}
                        {tier.usd_amount > 0
                            ? ` (${tier.usd_amount} USDT)`
                            : ""}
                    </div>
                </div>
            )}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.2}
                    maxSize={0.8}
                    particleDensity={200}
                    className="absolute inset-0"
                    particleColor="#FFFFFF"
                />
            </motion.div>
        </header>
    );
}
