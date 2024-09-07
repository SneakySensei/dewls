import { base64ToBytes } from "../utils/functions";
import { RedisService } from "./redis.service";
import { Client, type XmtpEnv } from "@xmtp/xmtp-js";
import { broadCastConfigEntities } from "common";
import { Redis } from "ioredis";

export class XmtpClientService {
    private static instance: XmtpClientService;
    private static clientsInitialized = false;
    private static clients = new Map<string, Client>();
    private static redis: Redis;

    public static init(): void {
        this.redis = RedisService.getRedisClient();
        this.redis.connect();
    }

    public static getInstance(): XmtpClientService {
        if (!XmtpClientService.instance) {
            XmtpClientService.instance = new XmtpClientService();
        }
        return XmtpClientService.instance;
    }

    public static async initializeClients(): Promise<void> {
        if (this.clientsInitialized) {
            return;
        }

        this.clientsInitialized = true;

        await Promise.all(
            broadCastConfigEntities.addresses.map(async (address: string) => {
                console.log("Initializing client for: ", address);
                const config = broadCastConfigEntities.map[address];
                const keyBundle = process.env[`${config.id}_KEY_BUNDLE`];
                const filePath =
                    process.env[`${config.id}_FILE_PERSISTENCE_PATH`];

                if (!keyBundle) {
                    console.error(`Missing ${config.id}_KEY_BUNDLE`);
                    return;
                }
                if (!filePath) {
                    console.error(`Missing ${config.id}_FILE_PERSISTENCE_PATH`);
                    return;
                }
                const { GrpcApiClient } = await import("@xmtp/grpc-api-client");
                const { RedisPersistence } = await import(
                    "@xmtp/redis-persistence"
                );

                try {
                    const { GrpcApiClient } = await import(
                        "@xmtp/grpc-api-client"
                    );
                    const { RedisPersistence } = await import(
                        "@xmtp/redis-persistence"
                    );

                    const client = await Client.create(null, {
                        privateKeyOverride: base64ToBytes(keyBundle),
                        apiClientFactory: GrpcApiClient.fromOptions as any,
                        basePersistence: new RedisPersistence(
                            this.redis as any,
                            "xmtp:",
                        ),
                        env: (process.env.XMTP_ENV as XmtpEnv) ?? "dev",
                    });
                    console.log(
                        `Client initialized at: ${client.address} for ${config.id}`,
                    );
                    this.clients.set(config.address, client);
                } catch (err) {
                    console.log(err);
                }
            }),
        );
    }

    public static async getXmtpClient(address: string): Promise<Client | null> {
        if (!this.clientsInitialized) {
            console.log("Clients not initialized");
            await this.initializeClients();
        }
        return this.clients.get(address) ?? null;
    }
}
