import { ChainSelector } from "./profile";
import Drawer from "@/shared/Drawer";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { getTokenBalance } from "@/utils/functions/ethers";
import { web3auth } from "@/utils/service/web3auth.service";
import { MappedGame } from "@/utils/types";
import { Contracts, TIERS_IDS } from "common";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    open: boolean;
    selectedGame?: MappedGame;
    onClose: () => void;
};
export default function TierSelector({ open, onClose, selectedGame }: Props) {
    const [currentBalance, setCurrentBalance] = useState("0");

    const { user } = useWeb3AuthContext();
    const { selectedChain } = useSelectedChainContext();
    useEffect(() => {
        (async () => {
            try {
                if (!user) {
                    return;
                }

                const balance = await getTokenBalance(
                    web3auth.provider!,
                    user.data.wallet_address,
                    Contracts.TOKEN_CONTRACT_ADDRESS[
                        Number(selectedChain.chainId)
                    ],
                );
                setCurrentBalance(balance);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [selectedChain, user]);

    const slug = selectedGame?.slug;

    return (
        <Drawer
            shouldScaleBackground={false}
            open={open}
            onOpenChange={(open) => !open && onClose()}
        >
            <Drawer.DrawerContent>
                <Drawer.DrawerHeader>
                    <Drawer.DrawerTitle>Choose tier</Drawer.DrawerTitle>
                    <div className="space-y-1">
                        <ChainSelector />
                        <div className="flex items-baseline justify-center gap-x-2 text-center text-body-2 font-medium text-neutral-300">
                            <span>Balance</span>
                            <span className="text-body-1 text-neutral-100">
                                {currentBalance}
                            </span>
                        </div>
                    </div>
                </Drawer.DrawerHeader>
                <Drawer.DrawerFooter>
                    <Link href={`/games/${TIERS_IDS.ALPHA}/${slug}`}>
                        Alpha $10
                    </Link>
                    <Link href={`/games/${TIERS_IDS.BETA}/${slug}`}>
                        Beta $5
                    </Link>
                    <Link href={`/games/${TIERS_IDS.GAMMA}/${slug}`}>
                        Gamma $1
                    </Link>
                    <Link href={`/games/${TIERS_IDS.FREE}/${slug}`}>
                        Free play
                    </Link>
                    {/* <Button>Submit</Button> */}
                </Drawer.DrawerFooter>
            </Drawer.DrawerContent>
        </Drawer>
    );
}
