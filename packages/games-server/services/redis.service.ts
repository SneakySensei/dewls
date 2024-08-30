import Redis from "ioredis";

export class RedisService {
    private static client: Redis;

    public static async init() {
        if (!process.env.REDIS_URL) {
            throw Error("Missing env variables");
        }

        this.client = new Redis(process.env.REDIS_URL);

        console.info(`RedisService initialized successfully!`);
    }

    public static getRedisClient(): Redis {
        return this.client;
    }
}
