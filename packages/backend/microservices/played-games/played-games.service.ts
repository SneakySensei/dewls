import { EthersService, SupabaseService } from "../../services";
import {
    MappedPlayedGame,
    MappedPlayer,
} from "../../utils/types/mappers.types";
import { fetchGameTier } from "../game-tiers/game-tiers.service";
import { fetchPlayerDetailsFromUserId } from "../players/players.service";

export const setAttestationAndWithdrawRewards = async (
    played_game_id: MappedPlayedGame["played_game_id"],
    attestation_hash: MappedPlayedGame["attestation_hash"],
) => {
    const { data: playedGameData, error: playedGameError } =
        await SupabaseService.getSupabase()
            .from("played_games")
            .update({
                attestation_hash,
            })
            .eq("played_game_id", played_game_id)
            .select()
            .single();

    if (playedGameError) {
        console.error(playedGameError);
        throw playedGameError;
    }

    const winnerData = await fetchPlayerDetailsFromUserId(
        playedGameData.winner_id!,
    );
    const tierData = await fetchGameTier(playedGameData.game_tier_id);

    await EthersService.withdrawUserReward(
        winnerData.wallet_address,
        playedGameData.chain_id,
        tierData.usd_amount,
    );

    return playedGameData;
};

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

export const fetchPlayersDetailsForPlayedGame = async (
    played_game_id: MappedPlayedGame["played_game_id"],
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("played_games")
        .select("*,player_1:player_1_id(*),player_2:player_2_id(*)")
        .eq("played_game_id", played_game_id)
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return {
        player_1: data.player_1 as unknown as MappedPlayer,
        player_2: data.player_2 as unknown as MappedPlayer,
    };
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
