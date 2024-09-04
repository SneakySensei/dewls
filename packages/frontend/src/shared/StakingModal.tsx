import Button from "./Button";
import Dialog from "./Dialog";
import EllipsisLoader from "./EllipsisLoader";
import { TIERS_IDS } from "common";
import { useRef, useState } from "react";

type Props = {
    onSuccess: () => void;
    open: boolean;
    tier_id: string;
};
export default function StakingModal({ onSuccess, open, tier_id }: Props) {
    const [stakingInProgress, setStakingInProgress] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);

    const handleStake = () => {
        setStakingInProgress(true);

        // TODO: Call this function once staking is done
        // pass relevant data that needs to go with the event
        onSuccess();
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
