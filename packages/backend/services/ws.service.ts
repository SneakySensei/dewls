import { ConnectFour } from "../microservices/connect-four/connect-four";
import { RockPaperScissorsRoutes } from "../microservices/rock-paper-scissors/rock-paper-scissors.routes";
import { GAME_NAMESPACES } from "common";
import { Server } from "node:http";
import { type Namespace, type Socket, Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;
    private static socketRoutes: {
        [namespace in GAME_NAMESPACES]: (socket: Socket, io: Namespace) => void;
    } = {
        [GAME_NAMESPACES.ROCK_PAPER_SCISSORS]: RockPaperScissorsRoutes,
        [GAME_NAMESPACES.CONNECT_FOUR]: ConnectFour,
    };

    public static async init(server: Server) {
        this.ioConnection = new WSServer(server, {
            cors: {
                origin: ["http://localhost:3000"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        for (const gameNamespace of Object.values(GAME_NAMESPACES)) {
            const scopedIO = this.ioConnection.of(`/${gameNamespace}`);
            console.info(
                `WSService connection created for namespace ${gameNamespace}`,
            );
            scopedIO.on("connection", (socket) =>
                this.socketRoutes[gameNamespace](socket, scopedIO),
            );
        }

        console.info(`WSService initialized successfully!`);
    }
}
