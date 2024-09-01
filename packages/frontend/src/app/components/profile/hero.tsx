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

      <div>
        <figure className="relative object-cover w-40 h-40">
          <Image
            alt=""
            src={user.profile_photo}
            fill
            className="rounded-full"
          />
        </figure>

        <h3>{user.name}</h3>
        <p>{user.email_id}</p>
      </div>
    </>
  );
};
