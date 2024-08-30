import { GAME_NAMESPACES } from "../utils/constants";
import { Server } from "node:http";
import { Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;
    private static gameNamespacesPrefix: string = "/game";

    public static async init(server: Server) {
        this.ioConnection = new WSServer(server, {
            cors: {
                origin: ["http://localhost:3000"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        for (const gameNamespace of Object.values(GAME_NAMESPACES)) {
            this.ioConnection
                .of(`/${this.gameNamespacesPrefix}/${gameNamespace}`)
                .on("connection", (socket) => {
                    console.log("a user connected!");
                });
        }

        console.info(`WSService initialized successfully!`);
    }

    public static async getIOServer(
        namespace: GAME_NAMESPACES | `${GAME_NAMESPACES}`
    ) {
        return this.ioConnection.of(
            `/${this.gameNamespacesPrefix}/${namespace}`
        );
    }
}