"use client";

import { ChainSelector } from "./profile";
import Drawer from "@/shared/Drawer";
import SparkleIcon from "@/shared/icons/SparkleIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { MappedGame, MappedGameTier } from "@/utils/types";
import { clamp } from "@tsparticles/engine";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const MotionLink = motion(Link);

type Props = {
    open: boolean;
    selectedGame?: MappedGame;
    tiers: MappedGameTier[];
    onClose: () => void;
};
export default function TierSelector({
    open,
    onClose,
    selectedGame,
    tiers,
}: Props) {
    const { selectedChain, chainBalance } = useSelectedChainContext();

    const slug = selectedGame?.slug;
    const maxPointWeight = Math.max(...tiers.map((t) => t.point_weight));
    return (
        <Drawer
            shouldScaleBackground
            open={open}
            onOpenChange={(open) => !open && onClose()}
        >
            <Drawer.DrawerContent>
                <Drawer.DrawerHeader>
                    <Drawer.DrawerTitle>
                        {selectedGame?.name}
                    </Drawer.DrawerTitle>

                    <div className="mt-4 space-y-1">
                        <div className="space-y-1">
                            <p className="text-body-1 font-medium text-neutral-300">
                                Choose tier
                            </p>
                            <ChainSelector />
                        </div>
                        <div className="flex items-baseline justify-center gap-x-2 text-center text-body-2 font-medium text-neutral-300">
                            <span>Balance</span>
                            <span className="text-body-1 text-neutral-100">
                                {!selectedChain || chainBalance === null
                                    ? "..."
                                    : `${chainBalance} USDT`}
                            </span>
                        </div>
                    </div>
                    <motion.section
                        initial="hidden"
                        animate="show"
                        transition={{
                            delayChildren: 0.2,
                            staggerChildren: 0.075,
                        }}
                        className="mt-6 flex flex-col gap-y-3 overflow-hidden"
                    >
                        {tiers.map(
                            ({
                                name,
                                tier_id,
                                usd_amount,
                                icon,
                                popular,
                                point_weight,
                            }) => (
                                <MotionLink
                                    variants={{
                                        hidden: { x: "100%", opacity: 0 },
                                        show: {
                                            x: 0,
                                            opacity: 1,
                                        },
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        type: "tween",
                                        ease: [0, 0.55, 0.45, 1],
                                    }}
                                    key={tier_id}
                                    href={`/games/${tier_id}/${slug}`}
                                    className="tier-card-rounded-gradient-border relative h-full w-full rounded-lg bg-gradient-to-r from-brand-600/20 to-brand-200/0"
                                >
                                    {popular && (
                                        <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-neutral-100/0 via-neutral-100/[8%] to-neutral-100/0 py-1 text-center text-body-4">
                                            <SparkleIcon className="size-4" />
                                            <span>Most Popular</span>
                                        </div>
                                    )}
                                    <div
                                        className={clsx(
                                            "flex w-full items-center gap-4 p-4 px-3 py-2",
                                            popular && "pt-1",
                                        )}
                                    >
                                        <Image
                                            alt=""
                                            src={icon}
                                            height={48}
                                            width={48}
                                            style={{
                                                filter: `drop-shadow(0 0 15px rgb(42, 88, 198, ${clamp(10, (point_weight * 100) / maxPointWeight, 100)}%))`,
                                            }}
                                            className="size-12"
                                        />

                                        <span className="text-display-3 uppercase text-brand-300">
                                            {name}
                                        </span>

                                        <span className="ml-auto text-display-3 uppercase text-neutral-200">
                                            ${usd_amount}
                                        </span>
                                    </div>
                                </MotionLink>
                            ),
                        )}
                    </motion.section>
                </Drawer.DrawerHeader>
            </Drawer.DrawerContent>
        </Drawer>
    );
}
