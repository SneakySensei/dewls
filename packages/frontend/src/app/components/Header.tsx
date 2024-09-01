"use client";

import Image from "next/image";
import Wordmark from "@/assets/branding/wordmark.svg";
import { SparklesCore } from "@/shared/Sparkles";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isGamesListingPage = pathname === "/";

  if (!isGamesListingPage) return <></>;

  return (
    <header className="py-4 relative text-center bg-gradient-logo-glow">
      <Image src={Wordmark} alt="Logo" className="h-7 block mx-auto w-auto" />
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.2}
        maxSize={0.8}
        particleDensity={200}
        className="absolute inset-0"
        particleColor="#FFFFFF"
      />
    </header>
  );
}
