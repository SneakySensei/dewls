import Button from "./Button";
import Dialog from "./Dialog";
import EllipsisLoader from "./EllipsisLoader";
import { useSelectedChainContext } from "@/utils/context/selected-chain.context";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { ArcadeService } from "@/utils/service/arcade-contract.service";
import { TIERS_IDS } from "common";
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

    const handleStake = async () => {
        try {
            setStakingInProgress(true);
            const tier_amount =
                tier_id === TIERS_IDS.ALPHA
                    ? 10
                    : tier_id === TIERS_IDS.BETA
                      ? 5
                      : tier_id === TIERS_IDS.GAMMA
                        ? 1
                        : 0;
            await ArcadeService.init(
                provider!,
                parseInt(selectedChain.chainId, 16),
            );
            await ArcadeService.approveBet(tier_amount);
            await ArcadeService.depositBet(game_id, tier_amount);

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
                                    Stake{" "}
                                    {tier_id === TIERS_IDS.ALPHA
                                        ? "$10"
                                        : tier_id === TIERS_IDS.BETA
                                          ? "$5"
                                          : tier_id === TIERS_IDS.GAMMA
                                            ? "$1"
                                            : "$0"}
                                </Button>
                            )}
                        </Dialog.DialogFooter>
                    </Dialog.DialogContent>
                </Dialog.DialogPortal>
            </Dialog>
        </>
    );
}
