import { RockPaperScissorsRoutes } from "../microservices/rock-paper-scissors/rock-paper-scissors.routes";
import { GAME_NAMESPACES } from "common";
import { Server } from "node:http";
import { Namespace, type Socket, Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;
    private static socketRoutes: {
        [namespace in GAME_NAMESPACES]: (socket: Socket, io: Namespace) => void;
    } = {
        [GAME_NAMESPACES.ROCK_PAPER_SCISSORS]: RockPaperScissorsRoutes,
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
            scopedIO.on("connection", (socket) =>
                this.socketRoutes[gameNamespace](socket, scopedIO),
            );
        }

        console.info(`WSService initialized successfully!`);
    }
}
