import { SupabaseService } from "../../services";
import { MappedGameTier, MappedSeason } from "../../utils/types/mappers.types";
import { gameBetPoolPercentage } from "common";

export const fetchAllSeasons = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("seasons")
        .select()
        .lt("started_on", new Date().toISOString())
        .order("ended_on", { ascending: false });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};

export const fetchCurrentSeason = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("seasons")
        .select()
        .gt("ended_on", new Date().toISOString())
        .lt("started_on", new Date().toISOString())
        .order("ended_on", { ascending: false })
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data as MappedSeason | null;
};

export const addMoneyToSeasonPool = async (
    season_id: MappedSeason["season_id"],
    tier_id: MappedGameTier["tier_id"],
) => {
    const { data: tierData, error: tierError } =
        await SupabaseService.getSupabase()
            .from("game_tiers")
            .select()
            .eq("tier_id", tier_id)
            .single();

    if (tierError) {
        console.error(tierError);
        throw tierError;
    }

    const { data: seasonReadData, error: seasonReadError } =
        await SupabaseService.getSupabase()
            .from("seasons")
            .select()
            .eq("season_id", season_id)
            .single();

    if (seasonReadError) {
        console.error(seasonReadError);
        throw seasonReadError;
    }

    const updatedPoolUsd =
        seasonReadData.reward_pool_usd +
        (gameBetPoolPercentage * tierData.usd_amount) / 100;

    const { data: seasonWriteData, error: seasonWriteError } =
        await SupabaseService.getSupabase()
            .from("seasons")
            .update({
                reward_pool_usd: updatedPoolUsd,
            })
            .eq("season_id", season_id)
            .select()
            .single();

    if (seasonWriteError) {
        console.error(seasonWriteError);
        throw seasonWriteError;
    }

    return seasonWriteData;
};
