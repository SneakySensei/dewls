import { RedisService } from "../../services";
import { type Socket } from "socket.io";

export const RockPaperScissorsRoutes = (socket: Socket) => {
    socket.on(
        "waiting",
        async ({
            game_id,
            season_id,
            tier_id,
            user_id,
        }: {
            season_id: string;
            game_id: string;
            user_id: string;
            tier_id: string;
        }) => {
            const redisClient = RedisService.getRedisClient();
            const roomKey: string = `${game_id}::${tier_id}`;
            const logId: string = `[${user_id}][${game_id}][${tier_id}]`;

            let roomId: string | null =
                (await redisClient.lpop(roomKey)) || null;

            if (!roomId) {
                console.info(logId, `no room found for room key ${roomKey}`);

                // TODO: add supabase call to `played-games` and use that id

                roomId = Math.random().toString();

                await redisClient.rpush(roomKey, roomId);
            } else {
                console.info(logId, `room found for room key ${roomKey}`);
            }

            socket.join(roomId);

            console.info(logId, `room found for room key ${roomKey}`);
        }
    );
};
