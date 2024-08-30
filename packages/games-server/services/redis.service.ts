import { createClient } from "redis";

export class RedisService {
    private static client: ReturnType<typeof createClient>;

    public static async init() {
        this.client = createClient({});

        this.client.on("error", (err) =>
            console.error("Redis Client Error", err)
        );

        console.info(`RedisService initialized successfully!`);
    }

    public static async getRedisClient() {
        return this.client;
    }
}
