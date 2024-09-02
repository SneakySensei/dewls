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
