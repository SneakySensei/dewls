"use client";

import Button from "@/shared/Button";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import Image from "next/image";

export const ProfileHero: React.FC = () => {
    const { user, logout } = useWeb3AuthContext();

    if (!user) return null;

    return (
        <>
            <h1 className="text-center font-display text-heading-1 font-bold tracking-widest">
                Profile
            </h1>

            <div className="mt-20 flex w-full flex-col items-center gap-y-6">
                <figure className="relative h-24 w-24 object-cover">
                    <Image
                        alt=""
                        src={user.data.profile_photo}
                        fill
                        className="rounded-full"
                    />
                </figure>

                <div className="flex flex-col items-center">
                    <h3 className="text-heading-3 text-neutral-100">
                        {user.data.name}
                    </h3>
                    <p className="text-body-3 text-neutral-300">
                        {user.data.email_id}
                    </p>

                    <div className="mt-2">
                        <Button
                            onClick={() => logout()}
                            variant="text"
                            style="danger"
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
