import { SupabaseService } from "../../services";
import {
    MappedLeaderboard,
    MappedPlayerGameHistory,
} from "../../utils/types/mappers.types";
import { fetchPlayerInSeasonLeaderboard } from "../leaderboard/leaderboard.service";

export const fetchPlayerHistoryForSeason = async (
    player_id: MappedPlayerGameHistory["player_id"],
    season_id: MappedPlayerGameHistory["season_id"],
): Promise<{
    player_game_history: MappedPlayerGameHistory[];
    season_statistics: {
        games_played: MappedLeaderboard["games_played"];
        games_won: MappedLeaderboard["games_won"];
        rank: MappedLeaderboard["rank"];
        total_points: MappedLeaderboard["total_points"];
    };
}> => {
    const { games_played, games_won, rank, total_points } =
        await fetchPlayerInSeasonLeaderboard(player_id, season_id);
    const { data: historyData, error: historyError } =
        await SupabaseService.getSupabase()
            .from("player_game_history")
            .select()
            .eq("player_id", player_id!)
            .eq("season_id", season_id!);

    if (historyError) {
        console.error(historyError);
        throw historyError;
    }

    return {
        player_game_history: historyData,
        season_statistics: {
            rank,
            games_played,
            games_won,
            total_points,
        },
    };
};
