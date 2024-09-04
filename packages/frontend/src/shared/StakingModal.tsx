import Button from "./Button";
import Dialog from "./Dialog";
import EllipsisLoader from "./EllipsisLoader";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useTierContext } from "@/utils/context/tiers.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { ArcadeService } from "@/utils/service/arcade-contract.service";
import { useRef, useState } from "react";

type Props = {
    onSuccess: () => void;
    open: boolean;
    tier_id: string;
    game_id: string;
};
export default function StakingModal({
    onSuccess,
    open,
    game_id,
    tier_id,
}: Props) {
    const [stakingInProgress, setStakingInProgress] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);
    const { provider } = useWeb3AuthContext();
    const { selectedChain } = useSelectedChainContext();
    const { tiers } = useTierContext();
    const tier = tiers.find((tier) => tier.tier_id === tier_id);

    const handleStake = async () => {
        if (!tier || !selectedChain) return;

        try {
            setStakingInProgress(true);

            await ArcadeService.init(
                provider!,
                parseInt(selectedChain.chainId, 16),
            );
            await ArcadeService.approveBet(tier.usd_amount);
            await ArcadeService.depositBet(game_id, tier.usd_amount);

            // TODO: Call this function once staking is done
            // pass relevant data that needs to go with the event
            onSuccess();
            setStakingInProgress(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div ref={portalRef} />
            {/* Staking logic */}
            <Dialog open={open}>
                <Dialog.DialogPortal container={portalRef.current}>
                    <Dialog.DialogOverlay />
                    <Dialog.DialogContent>
                        <Dialog.DialogHeader>
                            <Dialog.DialogTitle>
                                Stake your wagers
                            </Dialog.DialogTitle>
                            <Dialog.DialogDescription>
                                To proceed with the game, please stake your
                                wager amount. <br />
                                Once staked, your wager will be locked until the
                                game concludes. Confirm your stake to continue
                                and start playing! Winner takes it all!
                                <sup>*</sup>
                            </Dialog.DialogDescription>
                        </Dialog.DialogHeader>
                        <Dialog.DialogFooter className="mt-4 text-center">
                            {stakingInProgress ? (
                                <p className="text-body-2 italic text-neutral-200">
                                    Staking in progress
                                    <EllipsisLoader />
                                </p>
                            ) : (
                                <Button onClick={handleStake}>
                                    Stake ${tier?.usd_amount}
                                </Button>
                            )}
                        </Dialog.DialogFooter>
                    </Dialog.DialogContent>
                </Dialog.DialogPortal>
            </Dialog>
        </>
    );
}
