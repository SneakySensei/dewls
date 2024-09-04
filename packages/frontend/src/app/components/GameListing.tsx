"use client";

import GameCard from "./GameCard";
import TierSelector from "./TierSelector";
import { SearchIcon } from "@/shared/icons";
import { MappedGame } from "@/utils/types";
import { useState } from "react";

type Props = { games: MappedGame[] };
export default function GameListing({ games }: Props) {
    const [selectedGame, setSelecteGame] = useState<MappedGame>();
    const [keyword, setKeyword] = useState("");
    const filteredGames = games.filter((g) =>
        g.name.toLowerCase().includes(keyword.toLowerCase()),
    );

    return (
        <main>
            <section className="relative">
                <section className="sticky top-0 z-10 bg-neutral-800 px-4">
                    <label className="group flex w-full cursor-text items-center gap-3 rounded-lg border border-neutral-400 p-3 transition-colors duration-300 focus-within:border-neutral-200">
                        <SearchIcon className="size-4 text-neutral-300 transition-colors delay-75 duration-300 group-focus-within:text-brand-100" />
                        <input
                            className="block min-w-0 flex-1 bg-transparent text-body-1 placeholder:text-neutral-300 focus:outline-none"
                            placeholder="Find you next adventure"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </label>
                </section>
                <section className="space-y-3 px-4 py-4">
                    {filteredGames.map((game) => (
                        <GameCard
                            key={game.game_id}
                            data={game}
                            onClick={setSelecteGame}
                        />
                    ))}
                </section>
            </section>

            <TierSelector
                open={!!selectedGame}
                selectedGame={selectedGame}
                onClose={() => setSelecteGame(undefined)}
            />
        </main>
    );
}
