import { SupabaseService } from "../../services";

export const fetchGames = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("games")
        .select();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
