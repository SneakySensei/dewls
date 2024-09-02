import { SupabaseService } from "../../services";
import { MappedGameTier, MappedSeason } from "../../utils/types/mappers.types";

export const fetchAllSeasons = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("seasons")
        .select()
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
            .update({})
            .eq("season_id", season_id)
            .select()
            .single();

    if (seasonReadError) {
        console.error(seasonReadError);
        throw seasonReadError;
    }

    const { data: seasonWriteData, error: seasonWriteError } =
        await SupabaseService.getSupabase()
            .from("seasons")
            .update({
                reward_pool_usd:
                    seasonReadData.reward_pool_usd + tierData.usd_amount,
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
