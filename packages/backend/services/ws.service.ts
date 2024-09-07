import { ConnectFourRoutes } from "../microservices/connect-four/connect-four.routes";
import { RockPaperScissorsRoutes } from "../microservices/rock-paper-scissors/rock-paper-scissors.routes";
import { validateJwt } from "../middlewares/ws";
import { GAME_NAMESPACES } from "common";
import { Server } from "node:http";
import { type Namespace, type Socket, Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;
    private static socketRoutes: {
        [namespace in (typeof GAME_NAMESPACES)[keyof typeof GAME_NAMESPACES]]: (
            socket: Socket,
            io: Namespace,
        ) => void;
    } = {
        [GAME_NAMESPACES.ROCK_PAPER_SCISSORS]: RockPaperScissorsRoutes,
        [GAME_NAMESPACES.CONNECT_FOUR]: ConnectFourRoutes,
    };

    public static async init(server: Server) {
        this.ioConnection = new WSServer(server, {
            cors: {
                origin: ["http://localhost:3000", "https://dewls.vercel.app"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        for (const gameNamespace of Object.values(GAME_NAMESPACES)) {
            const scopedIO = this.ioConnection.of(`/${gameNamespace}`);
            console.info(
                `WSService connection created for namespace ${gameNamespace}`,
            );

            scopedIO.use((socket, next) => {
                try {
                    const token = socket.handshake.auth.token;
                    validateJwt(token);
                    next();
                } catch (error: Error | any) {
                    next(error);
                }
            });

            scopedIO.on("connection", (socket) =>
                this.socketRoutes[gameNamespace](socket, scopedIO),
            );
        }

        console.info(`WSService initialized successfully!`);
    }
}
