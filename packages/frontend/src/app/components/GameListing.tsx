"use client";

import { SearchIcon } from "@/shared/icons";
import { ConnectModal } from "../wallet/components/ConnectModal";
import GameCard from "./GameCard";
import { MappedGame } from "@/utils/types";
import { useState } from "react";

type Props = { games: MappedGame[] };
export default function GameListing({ games }: Props) {
  const [keyword, setKeyword] = useState("");
  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(keyword.toLowerCase())
  );
  return (
    <main>
      <section className="relative">
        <section className="px-4 bg-neutral-800 sticky top-0">
          <label className="w-full transition-colors duration-300 cursor-text group focus-within:border-neutral-200 rounded-lg border border-neutral-400 p-3 flex items-center gap-3">
            <SearchIcon className="size-4 transition-colors duration-300 delay-75 text-neutral-300 group-focus-within:text-brand-100" />
            <input
              className="flex-1 min-w-0 block text-body-1 focus:outline-none placeholder:text-neutral-300 bg-transparent"
              placeholder="Find you next adventure..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
        </section>
        <section className="px-4 space-y-3 py-4">
          <ConnectModal />
          {filteredGames.map((game) => (
            <GameCard key={game.game_id} data={game} />
          ))}
        </section>
      </section>
    </main>
  );
}
