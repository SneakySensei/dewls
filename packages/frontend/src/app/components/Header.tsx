"use client";

import Wordmark from "@/assets/branding/wordmark.svg";
import { SparklesCore } from "@/shared/Sparkles";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const isGamesListingPage = pathname === "/";
    const isGamesPage = pathname.startsWith("/games");

    if (!isGamesListingPage && !isGamesPage) return null;

    return (
        <header className="relative py-4 text-center">
            <motion.div
                className="absolute inset-0 bg-gradient-logo-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            ></motion.div>
            <Image
                src={Wordmark}
                alt="Logo"
                className="mx-auto block h-7 w-auto"
            />
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
