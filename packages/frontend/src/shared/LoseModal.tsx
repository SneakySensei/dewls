"use client";

import Button from "./Button";
import Dialog from "./Dialog";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
    open: boolean;
};
export default function LoseModal({ open }: Props) {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const timeout = setTimeout(() => {
            setModalOpen(true);
        }, 3000);

        return () => {
            clearTimeout(timeout);
        };
    }, [open]);

    const redirectToGameListing = () => {
        router.replace("/");
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
                                Good Game, Well Played
                            </Dialog.DialogTitle>
                            <Dialog.DialogDescription>
                                Defeat this time, but victory could be just one
                                move away. Try again!
                            </Dialog.DialogDescription>
                        </Dialog.DialogHeader>
                        <Dialog.DialogFooter className="mt-4 flex flex-col items-center gap-y-4 text-center">
                            <Button onClick={redirectToGameListing}>
                                Home
                            </Button>
                        </Dialog.DialogFooter>
                    </Dialog.DialogContent>
                </Dialog.DialogPortal>
            </Dialog>
        </>
    );
}
