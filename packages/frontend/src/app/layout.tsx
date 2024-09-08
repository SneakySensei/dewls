import Header from "./components/Header";
import Navbar from "./components/Navbar";
import "./globals.css";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import ActiveSeasonProvider from "@/utils/context/season.context";
import { SelectedChainContextProvider } from "@/utils/context/selected-chain.context";
import TierContextProvider from "@/utils/context/tiers.context";
import { Web3AuthContextProvider } from "@/utils/context/web3auth.context";
import { MappedGameTier, ResponseWithData } from "@/utils/types";
import clsx from "clsx";
import type { Metadata } from "next";
import { Big_Shoulders_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600"],
});
const bigShouldersDisplay = Big_Shoulders_Display({
    subsets: ["latin"],
    variable: "--font-big-shoulders",
    weight: "700",
});

export const metadata: Metadata = {
    title: "Dewl$",
    description: "Games that make connections ツ",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tierRes = await fetch(`${API_REST_BASE_URL}/game-tiers`, {
        cache: "no-cache",
    });
    const tiersReponse = (await tierRes.json()) as ResponseWithData<
        MappedGameTier[]
    >;
    const tiers = tiersReponse.success ? tiersReponse.data : [];

    return (
        <html lang="en">
            <body
                className={clsx(
                    inter.variable,
                    bigShouldersDisplay.variable,
                    "h-screen bg-neutral-800 font-sans text-neutral-100 antialiased",
                )}
            >
                <div
                    vaul-drawer-wrapper="true"
                    className="mx-auto flex h-full max-w-lg flex-col"
                >
                    <ActiveSeasonProvider>
                        <TierContextProvider tiers={tiers}>
                            <Web3AuthContextProvider>
                                <SelectedChainContextProvider>
                                    <Toaster richColors />
                                    <Header />
                                    <div className="relative min-h-0 flex-1 overflow-y-auto">
                                        {children}
                                    </div>
                                    <Navbar />
                                </SelectedChainContextProvider>
                            </Web3AuthContextProvider>
                        </TierContextProvider>
                    </ActiveSeasonProvider>
                </div>
            </body>
        </html>
    );
}
