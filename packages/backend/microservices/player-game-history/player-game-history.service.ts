import { SupabaseService } from "../../services";
import { MappedPlayerGameHistory } from "../../utils/types/mappers.types";

export const fetchPlayerHistoryForSeason = async (
    player_id: MappedPlayerGameHistory["player_id"],
    season_id: MappedPlayerGameHistory["season_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("player_game_history")
        .select()
        .eq("player_id", player_id!)
        .eq("season_id", season_id!);

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
