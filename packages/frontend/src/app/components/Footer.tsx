"use client";

import anonImage from "@/assets/anon.png";
import EllipsisLoader from "@/shared/EllipsisLoader";
import { GamesIcon, TrophyIcon } from "@/shared/icons";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const { user, login, isAuthenticating } = useWeb3AuthContext();

    const pathname = usePathname();

    const isGamesListingPage = pathname === "/";
    const isLeaderboardPage = pathname === "/leaderboard";
    const isProfilePage = pathname === "/profile";

    if (!(isGamesListingPage || isLeaderboardPage || isProfilePage))
        return null;

    const profileImage = (
        <figure className="relative size-7">
            <Image
                src={
                    user?.data.profile_photo
                        ? user?.data.profile_photo
                        : anonImage.src
                }
                fill
                alt="Profile image"
                className={clsx(
                    "size-full rounded-full",
                    !user?.data.profile_photo && "[image-rendering:pixelated]",
                )}
            />
            {isAuthenticating && (
                <div className="absolute bottom-full left-full -translate-x-1/3 translate-y-1/3 rounded-full border-2 border-neutral-900 bg-neutral-100 px-1 leading-none text-neutral-900">
                    <EllipsisLoader char="·" />
                </div>
            )}
        </figure>
    );

    return (
        <footer className="flex h-16 justify-evenly rounded-t-3xl bg-neutral-700">
            <Link
                href="/"
                className={clsx(
                    "relative grid place-items-center px-6 transition-all",
                    isGamesListingPage
                        ? "text-neutral-100"
                        : "text-neutral-400",
                )}
            >
                <AnimatePresence>
                    {isGamesListingPage && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-active-tab"
                        />
                    )}
                </AnimatePresence>
                <GamesIcon className="size-7" />
            </Link>
            <Link
                href="/leaderboard"
                className={clsx(
                    "relative grid place-items-center px-6 transition-all",
                    isLeaderboardPage ? "text-neutral-100" : "text-neutral-400",
                )}
            >
                <AnimatePresence>
                    {isLeaderboardPage && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-active-tab"
                        />
                    )}
                </AnimatePresence>
                <TrophyIcon className="size-7" />
            </Link>
            {user ? (
                <Link
                    href="/profile"
                    className="relative grid place-items-center px-6"
                >
                    <AnimatePresence>
                        {isProfilePage && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-active-tab"
                            />
                        )}
                    </AnimatePresence>
                    {profileImage}
                </Link>
            ) : (
                <button
                    className="grid place-items-center px-6"
                    onClick={() => login()}
                >
                    {profileImage}
                </button>
            )}
        </footer>
    );
}
