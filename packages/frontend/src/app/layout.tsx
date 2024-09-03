import type { Metadata } from "next";
import { Big_Shoulders_Display, Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Footer from "./components/Footer";
import { Web3AuthContextProvider } from "@/utils/context/web3auth.context";
import Header from "./components/Header";
import { SelectedChainContextProvider } from "@/utils/context/selected-chain.context";

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
          "h-screen mx-auto font-sans max-w-lg bg-neutral-800 text-neutral-100 flex flex-col"
        )}
      >
        <Web3AuthContextProvider>
          <SelectedChainContextProvider>
            <Header />
            <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
            <Footer />
          </SelectedChainContextProvider>
        </Web3AuthContextProvider>
      </body>
    </html>
  );
}
