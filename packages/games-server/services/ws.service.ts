import { Server } from "node:http";
import { Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;
    private static gamesNamespaces: string[] = [
        "/tic-tac-toe",
        "/stone-paper-scissors",
    ];

    public static async init(server: Server) {
        this.ioConnection = new WSServer(server, {
            cors: {
                origin: ["http://localhost:3000"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        for (const gameNamespace of this.gamesNamespaces) {
            this.ioConnection
                .of(`/game/${gameNamespace}`)
                .on("connection", (socket) => {
                    console.log("a user connected!");
                });
        }

        console.info(`WSService initialized successfully!`);
    }
}
