import { SupabaseService } from "../../services";

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

    return data;
};
