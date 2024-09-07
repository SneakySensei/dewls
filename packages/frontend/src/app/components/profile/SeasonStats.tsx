import SeasonsDropdown from "../shared/season-dropdown";
import { GameHistory } from "./GameHistory";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { useWeb3AuthContext } from "@/utils/context/web3auth.context";
import {
    MappedLeaderboard,
    MappedPlayerGameHistory,
    MappedSeason,
    ResponseWithData,
} from "@/utils/types";
import React, { useEffect, useState } from "react";

const SeasonStats: React.FC = () => {
    const { user } = useWeb3AuthContext();

    const [loading, setLoading] = useState<boolean>(false);
    const [playedGames, setPlayedGames] = useState<MappedPlayerGameHistory[]>(
        [],
    );
    const [stats, setStats] = useState<{
        games_played: MappedLeaderboard["games_played"];
        games_won: MappedLeaderboard["games_won"];
        rank: MappedLeaderboard["rank"];
        total_points: MappedLeaderboard["total_points"];
    } | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<MappedSeason | null>(
        null,
    );

    useEffect(() => {
        (async () => {
            try {
                if (!user || !selectedSeason) {
                    return;
                }

                setLoading(true);

                const gamesRes = await fetch(
                    `${API_REST_BASE_URL}/player-game-history`,
                    {
                        cache: "no-cache",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            player_id: user.data.player_id,
                            season_id: selectedSeason.season_id,
                        }),
                    },
                );
                const gamesResponse: ResponseWithData<{
                    player_game_history: MappedPlayerGameHistory[];
                    season_statistics: {
                        games_played: MappedLeaderboard["games_played"];
                        games_won: MappedLeaderboard["games_won"];
                        rank: MappedLeaderboard["rank"];
                        total_points: MappedLeaderboard["total_points"];
                    };
                }> = await gamesRes.json();

                if (gamesResponse.success) {
                    setPlayedGames(gamesResponse.data.player_game_history);
                    setStats(gamesResponse.data.season_statistics);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedSeason, user]);

    return (
        <div className="mx-4">
            <h3 className="my-2 mb-6 text-heading-3 text-neutral-300">
                Season Stats
            </h3>

            <SeasonsDropdown
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
            />

            {loading ? (
                <p className="mb-2 rounded-lg bg-neutral-600 py-2 text-center text-body-3 text-neutral-200">
                    Curating the statistics...
                </p>
            ) : (
                <>
                    <div className="mt-6 flex items-center justify-center gap-x-2 rounded-lg border border-neutral-400 p-4">
                        {[
                            {
                                heading: "Won",
                                value: stats?.games_won,
                            },
                            {
                                heading: "Played",
                                value: stats?.games_played,
                            },
                            {
                                heading: "Score",
                                value: stats?.total_points,
                            },
                            {
                                heading: "Rank",
                                value: stats?.rank,
                            },
                        ].map(({ heading, value }) => (
                            <div
                                key={heading}
                                className="flex-1 flex-col gap-y-1 border-r border-neutral-400 px-1 text-center last:border-r-0"
                            >
                                <p className="text-body-3 text-neutral-300">
                                    {heading}
                                </p>
                                <p className="text-body-1 text-neutral-100">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {playedGames.map((game, i: number) => (
                        <>
                            {i < 3 ? (
                                <GameHistory
                                    key={game.played_game_id}
                                    playedGame={game}
                                    won={
                                        game.winner_id === user?.data.player_id
                                    }
                                />
                            ) : null}
                        </>
                    ))}
                </>
            )}
        </div>
    );
};

export default SeasonStats;
