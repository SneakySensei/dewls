"use client";

import { GamesIcon, TrophyIcon } from "@/shared/icons";
import Image from "next/image";
import Link from "next/link";
import anonImage from "@/assets/anon.png";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export default function Footer() {
  const isAuthenticated = true;

  const pathname = usePathname();

  const isGamesListingPage = pathname === "/";
  const isLeaderboardPage = pathname === "/leaderboard";
  const isProfilePage = pathname === "/profile";

  const profileImage = (
    <div className="size-7 overflow-hidden rounded-full">
      <Image
        src={anonImage}
        alt="Profile image"
        className="size-full [image-rendering:pixelated]"
      />
    </div>
  );

  return (
    <footer className="h-16 flex justify-evenly bg-neutral-700 rounded-t-3xl">
      <Link
        href="/"
        className={clsx(
          "px-6 grid place-items-center relative transition-all",
          isGamesListingPage ? "text-neutral-100" : "text-neutral-400"
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
          "px-6 grid place-items-center relative transition-all",
          isLeaderboardPage ? "text-neutral-100" : "text-neutral-400"
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
      {isAuthenticated ? (
        <Link href="/profile" className="px-6 grid place-items-center relative">
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
        <button className="px-6 grid place-items-center">{profileImage}</button>
      )}
    </footer>
  );
}
