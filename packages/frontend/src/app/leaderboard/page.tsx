"use client";

import LeaderboardTable from "./components/LeaderboardTable";
import SelectDropdown from "./components/SelectDropdown";
import Image from "next/image";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const columns = [
  { header: "#", key: "rank" },
  { header: "User", key: "user" },
  { header: "Won", key: "games_won" },
  { header: "Lost", key: "games_lost" },
  { header: "Score", key: "total_score" },
];

const data = [
  { rank: 1, user: "Player1", games_won: 15, games_lost: 5, total_score: 1000 },
  { rank: 2, user: "Player2", games_won: 10, games_lost: 8, total_score: 850 },
  { rank: 3, user: "Player3", games_won: 8, games_lost: 10, total_score: 780 },
];

export default function Leaderboard() {
  return (
    <main className="text-neutral-100 flex flex-col gap-y-6">
      <h1 className="text-heading-1 font-bold text-center tracking-widest font-display">
        Leaderboard
      </h1>
      <div className="px-6">
        <SelectDropdown options={options} onChange={() => {}} />
      </div>

      <div className="h-48 w-full flex flex-col items-center justify-center gap-y-4 bg-reward-pool-banner">
        <Image
          src="/leaderboard-coin.svg"
          alt="Leaderboard Coins"
          width={116}
          height={96}
        />
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-heading-1 text-neutral-100 font-semibold">
            $34,000
          </p>
          <p className="text-body-3 text-neutral-200 font-normal">
            Amount Collected
          </p>
        </div>
      </div>
      <div>
        <LeaderboardTable columns={columns} data={data} />
      </div>
    </main>
  );
}
