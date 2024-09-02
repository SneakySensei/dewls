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
    rank: MappedLeaderboard["rank"];
}> => {
    const { rank } = await fetchPlayerInSeasonLeaderboard(player_id, season_id);
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
        rank,
    };
};
