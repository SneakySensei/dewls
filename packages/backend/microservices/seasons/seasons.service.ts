import { SupabaseService } from "../../services";

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

export const fetchCurrentLeaderboard = async () => {
    const { season_id } = await fetchCurrentSeason();

    const { data, error } = await SupabaseService.getSupabase().rpc(
        "get_leaderboard",
        {
            season_id_param: season_id,
        },
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
