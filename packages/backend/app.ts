import { gameTiersRouter } from "./microservices/game-tiers/game-tiers.routes";
import { gamesRouter } from "./microservices/games/games.routes";
import { usersRouter } from "./microservices/users/users.routes";
import { RedisService, SupabaseService, WSService } from "./services";
import cors from "cors";
import "dotenv/config";
import type { Express, NextFunction, Request, Response } from "express";
import express, { Router } from "express";
import { createServer } from "node:http";

const app: Express = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

app.get("/healthcheck", (_req: Request, res: Response) => {
    const now = new Date();
    res.json({
        success: true,
        timestamp: now.toISOString(),
        uptime: process.uptime(),
    });
});

const v1Router = Router();
app.use("/api/v1", v1Router);

v1Router.use("/game-tiers", gameTiersRouter);
v1Router.use("/games", gamesRouter);
v1Router.use("/users", usersRouter);

app.use("*", (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
    });
});

app.use(
    (err: Error | any, _req: Request, res: Response, _next: NextFunction) => {
        const now: Date = new Date();
        const _code = err.errorCode || err.error_code || err.code;
        const code: number =
            typeof _code === "number" && !isNaN(_code) ? _code : 500;
        const message: string =
            err.reason ||
            err.error_message ||
            err.message ||
            "Internal Server Error";
        console.error("[SERVER ERROR]", now.toLocaleString(), err);
        res.status(code).json({
            success: false,
            message,
        });
    },
);

(async () => {
    try {
        await Promise.all([
            SupabaseService.init(),
            RedisService.init(),
            WSService.init(server),
        ]);
        const env: string = process.env.NODE_ENV || "development";
        if (env !== "test") {
            const port: number = +(process.env.PORT || 7990);
            server.listen(port, () => {
                console.info(
                    `Server listening on Port ${port} in the ${env} environment`,
                );
            });
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();

process.on("SIGINT", () => {
    process.exit(0);
});
process.on("SIGHUP", () => {
    process.exit(0);
});

export default app;
