import { RedisService } from "../../services";
import { createGame } from "./rock-paper-scissors.service";
import { Namespace, type Socket } from "socket.io";

export const RockPaperScissorsRoutes = (socket: Socket, io: Namespace) => {
    socket.on(
        "join",
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

                const { played_game_id } = await createGame(
                    user_id,
                    season_id,
                    game_id,
                    tier_id,
                );

                roomId = played_game_id;

                await redisClient.rpush(roomKey, roomId);
                console.info(
                    logId,
                    `pushed room id ${roomId} in room key ${roomKey}`,
                );
            } else {
                console.info(logId, `room found for room key ${roomKey}`);
            }

            socket.join(roomId);
            console.info(logId, `user joined ${roomId}`);

            io.to(roomId).emit("player-joined", {
                user_id,
            }),
                console.info(logId, `sent room id ${roomId}`);
        },
    );
};
