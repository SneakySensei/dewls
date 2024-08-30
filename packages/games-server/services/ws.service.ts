import { type Express } from "express";
import { createServer, Server } from "node:http";
import { Server as WSServer } from "socket.io";

export class WSService {
    private static ioConnection: WSServer;

    public static async init(server: Server) {
        this.ioConnection = new WSServer(server, {
            cors: {
                origin: ["http://localhost:3000"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.ioConnection.on("connection", (socket) => {
            console.log("a user connected!");
        });

        console.info(`WSService initialized successfully!`);
    }
}
