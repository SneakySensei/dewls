"use client";

import Button from "./Button";
import Dialog from "./Dialog";
import EllipsisLoader from "./EllipsisLoader";
import { GameState } from "@/app/games/rock-paper-scissors/components/Game";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import { getWalletClient } from "@/utils/functions/ethers";
import SignClient from "@/utils/service/sign-protocol.service";
import { TIERS_IDS } from "common";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
    open: boolean;
    gameState: GameState;
    tier: TIERS_IDS;
};
export default function AttestModal({ open, gameState, tier }: Props) {
    const { provider } = useWeb3AuthContext();
    const [modalOpen, setModalOpen] = useState(false);

    const [attestingInProgress, setAttestingInProgress] = useState(false);
    const [attestingSuccess, setAttestingSuccess] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const timeout = setTimeout(() => {
            setModalOpen(true);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, [open]);

    const handleAttest = async () => {
        if (gameState.state !== "gameEnd") return;
        setAttestingInProgress(true);

        const walletClient = await getWalletClient(provider!);
        const signClient = new SignClient(walletClient);

        const attestation = await signClient.attest({
            played_game_id: gameState.room_id,
            player_id: gameState.player.player_id,
            tier_id: tier,
        });
        console.log(attestation);
        setAttestingInProgress(false);
        setAttestingSuccess(true);
    };

    const redirectToGameListing = () => {
        redirect("/", RedirectType.replace);
    };

    return (
        <>
            <div ref={portalRef} />
            <Dialog open={modalOpen}>
                <Dialog.DialogPortal container={portalRef.current}>
                    <Dialog.DialogOverlay />
                    <Dialog.DialogContent>
                        <Dialog.DialogHeader>
                            <Dialog.DialogTitle>
                                {attestingSuccess
                                    ? "Thank you!"
                                    : "Immortalize Your Win"}
                            </Dialog.DialogTitle>
                            {!attestingSuccess && (
                                <Dialog.DialogDescription>
                                    Set your victory in stone and let the world
                                    know who emerged victorious with Sign
                                    Protocol. Your triumph deserves to be
                                    remembered!
                                </Dialog.DialogDescription>
                            )}
                        </Dialog.DialogHeader>
                        <Dialog.DialogFooter className="mt-4 flex flex-col items-center gap-y-4 text-center">
                            {attestingInProgress ? (
                                <p className="text-body-2 italic text-neutral-200">
                                    Signing in progress
                                    <EllipsisLoader />
                                </p>
                            ) : attestingSuccess ? (
                                <Button onClick={redirectToGameListing}>
                                    Play again
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleAttest}>
                                        For the glory!
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={redirectToGameListing}
                                    >
                                        Skip the spotlight
                                    </Button>
                                </>
                            )}
                        </Dialog.DialogFooter>
                    </Dialog.DialogContent>
                </Dialog.DialogPortal>
            </Dialog>
        </>
    );
}
