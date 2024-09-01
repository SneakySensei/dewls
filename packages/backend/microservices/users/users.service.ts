import { SupabaseService } from "../../services";
import { type MappedUser } from "../../utils/types/mappers.types";
import { sign } from "jsonwebtoken";

export const createJWToken = (user: MappedUser) => {
    const token = sign(user, process.env.JWT_SECRET_KEY!, {
        issuer: "dewl$",
        expiresIn: "24h",
    });
    return token;
};

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

export const authUser = async ({
    email_id,
    name,
    profile_photo,
    wallet_address,
}: Omit<MappedUser, "created_at" | "user_id">): Promise<string> => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("users")
        .insert({
            email_id,
            name,
            profile_photo,
            wallet_address,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    const token = createJWToken(data);

    return token;
};
