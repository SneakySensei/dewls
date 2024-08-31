import { SupabaseService } from "../../services";
import { MappedPlayedGame } from "../../utils/types/mappers.types";

export const createGame = async (
    player_1_id: MappedPlayedGame["player_1_id"],
    season_id: MappedPlayedGame["season_id"],
    game_id: MappedPlayedGame["game_id"],
    game_tier_id: MappedPlayedGame["game_tier_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("played_games")
        .insert({
            season_id,
            game_id,
            game_tier_id,
            player_1_id,
            player_2_id: null,
            is_active: false,
        })
        .select()
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
