import { SupabaseService } from "../../services";

export const fetchGameTiers = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("game_tiers")
        .select();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
