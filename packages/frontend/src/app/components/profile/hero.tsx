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

      <div className="flex justify-center items-center border border-neutral-400 p-4 mx-4 rounded-lg">
        {[
          {
            heading: "Won",
            value: "user.data.won",
          },
          {
            heading: "Played",
            value: "user.data.played",
          },
          {
            heading: "Score",
            value: "user.data.score",
          },
        ].map(({ heading, value }) => (
          <div
            key={heading}
            className="flex-1 flex-col gap-y-1 text-center border-r last:border-r-0"
          >
            <p className="text-neutral-300 text-body-3">{heading}</p>
            <p className="text-neutral-100 text-body-1">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
};
