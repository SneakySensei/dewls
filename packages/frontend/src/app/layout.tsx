import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";
import { SelectedChainContextProvider } from "@/utils/context/selected-chain.context";
import { Web3AuthContextProvider } from "@/utils/context/web3auth.context";
import clsx from "clsx";
import type { Metadata } from "next";
import { Big_Shoulders_Display, Inter } from "next/font/google";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={clsx(
                    inter.variable,
                    bigShouldersDisplay.variable,
                    "h-screen bg-neutral-800 font-sans text-neutral-100",
                )}
            >
                <div
                    vaul-drawer-wrapper="true"
                    className="mx-auto flex h-full max-w-lg flex-col"
                >
                    <Web3AuthContextProvider>
                        <SelectedChainContextProvider>
                            <Header />
                            <div className="relative min-h-0 flex-1 overflow-y-auto">
                                {children}
                            </div>
                            <Footer />
                        </SelectedChainContextProvider>
                    </Web3AuthContextProvider>
                </div>
            </body>
        </html>
    );
}
