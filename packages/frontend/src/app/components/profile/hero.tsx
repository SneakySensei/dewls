"use client";

import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import Image from "next/image";

export const ProfileHero: React.FC = () => {
  const { user } = useWeb3AuthContext();

  if (!user) {
    return <></>;
  }

  return (
    <>
      <h1 className="text-heading-1 font-bold text-center tracking-widest font-display">
        Profile
      </h1>

      <div className="flex flex-col items-center w-full mt-20 gap-y-6">
        <figure className="relative object-cover w-24 h-24">
          <Image
            alt=""
            src={user.data.profile_photo}
            fill
            className="rounded-full"
          />
        </figure>

        <div className="flex flex-col items-center">
          <h3 className="text-heading-3 text-neutral-100">{user.data.name}</h3>
          <p className="text-neutral-300 text-body-3">{user.data.email_id}</p>
        </div>
      </div>
    </>
  );
};
