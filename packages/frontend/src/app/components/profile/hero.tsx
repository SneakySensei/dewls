"use client";

import Image from "next/image";

export const ProfileHero: React.FC = () => {
  // const { user } = useWeb3AuthContext();
  const user = {
    email_id: "karanpargal007@gmail.com",
    name: "Karan Pargal",
    profile_photo:
      "https://lh3.googleusercontent.com/a/ACg8ocIJsSTDQXwXlpZTNdu0n6G-EySqxIwKJfUTewSoej7mbMF9ITIH=s96-c",
    wallet_address: "0xC1931B33dCb6E64da65D2F3c73bcDc42d2f9Ce98",
    won: 10,
    played: 20,
    score: 1000,
  };

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
            src={user.profile_photo}
            fill
            className="rounded-full"
          />
        </figure>

        <div className="flex flex-col items-center">
          <h3 className="text-heading-3 text-neutral-100">{user.name}</h3>
          <p className="text-neutral-300 text-body-3">{user.email_id}</p>
        </div>
      </div>

      <div className="flex justify-center items-center border border-neutral-400 p-4 mx-4 rounded-lg">
        <div className="flex-1 flex-col gap-y-1 text-center border-r">
          <p className="text-neutral-300 text-body-3">Won</p>
          <p className="text-neutral-100 text-body-1">{user.won}</p>
        </div>
        <div className="flex-1 flex-col gap-y-1 text-center border-r">
          <p className="text-neutral-300 text-body-3">Played</p>
          <p className="text-neutral-100 text-body-1">{user.played}</p>
        </div>
        <div className="flex-1 flex-col gap-y-1 text-center">
          <p className="text-neutral-300 text-body-3">Score</p>
          <p className="text-neutral-100 text-body-1">{user.score}</p>
        </div>
      </div>
    </>
  );
};
