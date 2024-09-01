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

export const addPlayer2ToGame = async (
    played_game_id: MappedPlayedGame["played_game_id"],
    player_2_id: MappedPlayedGame["player_2_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("played_games")
        .update({
            player_2_id,
            is_active: true,
        })
        .eq("played_game_id", played_game_id)
        .select();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};

export const setWinnerToGame = async (
    played_game_id: MappedPlayedGame["played_game_id"],
    winner_id: MappedPlayedGame["winner_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("played_games")
        .update({
            winner_id,
            is_active: false,
        })
        .eq("played_game_id", played_game_id)
        .select();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
