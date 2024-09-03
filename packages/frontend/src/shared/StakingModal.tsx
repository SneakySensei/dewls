import { useRef } from "react";
import Dialog from "./Dialog";
import Button from "./Button";

type Props = {
  onSuccess: () => void;
  open: boolean;
};
export default function StakingModal({ onSuccess, open }: Props) {
  const portalRef = useRef<HTMLDivElement>(null);

  const handleStake = () => {
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
              <Dialog.DialogTitle>Stake your wagers</Dialog.DialogTitle>
              <Dialog.DialogDescription>
                To proceed with the game, please stake your wager amount. <br />
                Once staked, your wager will be locked until the game concludes.
                Confirm your stake to continue and start playing! Winner takes
                it all!<sup>*</sup>
              </Dialog.DialogDescription>
            </Dialog.DialogHeader>
            <Dialog.DialogFooter className="mt-4 text-center">
              <Button>Stake $10</Button>
            </Dialog.DialogFooter>
          </Dialog.DialogContent>
        </Dialog.DialogPortal>
      </Dialog>
    </>
  );
}
