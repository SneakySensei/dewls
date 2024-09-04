import { ChainSelector } from "./profile";
import Drawer from "@/shared/Drawer";
import SparkleIcon from "@/shared/icons/SparkleIcon";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { MappedGame, MappedGameTier } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
    open: boolean;
    selectedGame?: MappedGame;
    onClose: () => void;
};
export default function TierSelector({ open, onClose, selectedGame }: Props) {
    const { user } = useWeb3AuthContext();
    const { selectedChain, chainBalance } = useSelectedChainContext();

    const slug = selectedGame?.slug;

    const tiers: (Pick<MappedGameTier, "name" | "tier_id" | "usd_amount"> & {
        icon: string;
        popular: boolean;
    })[] = [
        {
            tier_id: "5f534987-4ca5-4b27-8597-835fc9512f85",
            name: "Alpha",
            usd_amount: 10,
            popular: false,
            icon: "/tiers/tier-alpha.svg",
        },
        {
            tier_id: "397bf400-1d70-4edb-927f-ea6306ea6240",
            name: "Beta",
            usd_amount: 3,
            popular: true,
            icon: "/tiers/tier-beta.svg",
        },
        {
            tier_id: "0e8cb282-7bab-4631-8b3a-76795e3cb92f",
            name: "Gamma",
            usd_amount: 1,
            popular: false,
            icon: "/tiers/tier-gamma.svg",
        },
        {
            tier_id: "8abf627a-bd65-4c50-9e16-52554e4064f9",
            name: "Free",
            usd_amount: 0,
            popular: false,
            icon: "/tiers/tier-free.svg",
        },
    ];

    return (
        <Drawer
            shouldScaleBackground={false}
            open={open}
            onOpenChange={(open) => !open && onClose()}
        >
            <Drawer.DrawerContent>
                <Drawer.DrawerHeader>
                    <Drawer.DrawerTitle>Choose tier</Drawer.DrawerTitle>

                    <div className="my-2 space-y-1">
                        <ChainSelector />
                        <div className="flex items-baseline justify-center gap-x-2 text-center text-body-2 font-medium text-neutral-300">
                            <span>Balance</span>
                            <span className="text-body-1 text-neutral-100">
                                {!selectedChain || chainBalance === null
                                    ? "..."
                                    : `${chainBalance} USDT`}
                            </span>
                        </div>
                    </div>
                </Drawer.DrawerHeader>

                <Drawer.DrawerFooter>
                    {tiers.map(
                        ({ name, tier_id, usd_amount, icon, popular }) => (
                            <Link
                                key={tier_id}
                                href={`/games/${tier_id}/${slug}`}
                                className="h-full w-full rounded-lg border border-brand-400 bg-[linear-gradient(89.56deg,_rgba(106,70,229,0.2)_0.38%,_rgba(106,70,229,0)_99.62%)]"
                            >
                                {popular && (
                                    <span className="flex items-center justify-center gap-2 bg-[linear-gradient(90deg,_rgba(18,18,21,0.2)_0%,_rgba(255,255,255,0.08)_52.24%,_rgba(18,18,21,0.2)_100%)] pb-1 pt-2 text-center text-body-4">
                                        <SparkleIcon />

                                        <span>Most Popular</span>
                                    </span>
                                )}
                                <span className="flex w-full items-center gap-4 p-4">
                                    <Image
                                        alt=""
                                        src={icon}
                                        height={48}
                                        width={48}
                                    />

                                    <span className="text-display-2 font-bold uppercase text-brand-200">
                                        {name}
                                    </span>

                                    <span className="ml-auto text-display-2 font-bold uppercase text-neutral-200">
                                        ${usd_amount.toLocaleString()}
                                    </span>
                                </span>
                            </Link>
                        ),
                    )}

                    {/* <Button>Submit</Button> */}
                </Drawer.DrawerFooter>
            </Drawer.DrawerContent>
        </Drawer>
    );
}
