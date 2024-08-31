import { SupabaseService } from "../../services";
import { type MappedUser } from "../../utils/types/mappers.types";

export const fetchUserDetails = async (user_id: MappedUser["user_id"]) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("users")
        .select()
        .eq("user_id", user_id)
        .single();

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
