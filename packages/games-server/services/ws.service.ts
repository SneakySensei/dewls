import { type Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

export class WSService {
    private static ioConnection: Server;

    public static async init(expressApp: Express) {
        const server = createServer(expressApp);

        this.ioConnection = new Server(server);

        this.ioConnection.on("connection", (socket) => {
            console.log("a user connected!");
        });
    }
}
