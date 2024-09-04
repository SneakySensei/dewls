import { SupabaseService } from "../../services";
import { MappedGameTier } from "../../utils/types/mappers.types";

export const fetchGameTiers = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("game_tiers")
        .select()
        .order("usd_amount", { ascending: false });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};

export const fetchGameTier = async (tier_id: MappedGameTier["tier_id"]) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("game_tiers")
        .select()
        .eq("tier_id", tier_id)
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
