import { type Database } from "../utils/types/database.types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class SupabaseService {
    private static anonClient: SupabaseClient<Database>;
    private static adminClient: SupabaseClient<Database>;

    public static initAnon = (): void => {
        this.anonClient = createClient<Database>(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_ANON_KEY as string,
        );
    };

    public static initAdmin = (): void => {
        this.adminClient = createClient<Database>(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        );
    };

    public static init = (): void => {
        if (
            !process.env.SUPABASE_URL &&
            !process.env.SUPABASE_ANON_KEY &&
            !process.env.SUPABASE_ACCESS_TOKEN &&
            !process.env.SUPABASE_PROJECT_ID &&
            !process.env.SUPABASE_SERVICE_ROLE_KEY
        ) {
            console.error("Missing env variables.");
            process.exit(1);
        }

        this.initAnon();
        this.initAdmin();
        console.info("SupabaseService initiated successfully!");
    };

    public static getSupabase = (
        access?: "admin" | string,
    ): SupabaseClient<Database> => {
        if (access === "admin") {
            if (!this.adminClient) {
                this.initAdmin();
            }
            return this.adminClient;
        }

        if (access) {
            return createClient<Database>(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_KEY!,
                {
                    global: {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    },
                },
            );
        }

        if (!this.anonClient) {
            this.initAnon();
        }
        return this.anonClient;
    };
}
