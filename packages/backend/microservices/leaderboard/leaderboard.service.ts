import { SupabaseService } from "../../services";
import { MappedLeaderboard } from "../../utils/types/mappers.types";

export const fetchSeasonLeaderboard = async (
    season_id: MappedLeaderboard["season_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("leaderboard")
        .select()
        .eq("season_id", season_id!);

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};

export const fetchPlayerInSeasonLeaderboard = async (
    player_id: MappedLeaderboard["player_id"],
    season_id: MappedLeaderboard["season_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("leaderboard")
        .select()
        .eq("player_id", player_id!)
        .eq("season_id", season_id!)
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
