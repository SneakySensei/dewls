import { WSService } from "./services";
// import { AxiosError } from "axios";
import cors from "cors";
import "dotenv/config";
import type { Express, NextFunction, Request, Response } from "express";
import express, { Router } from "express";

const app: Express = express();
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

app.use("*", (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
    });
});

app.use(
    (
        err: // AxiosError |
        Error | any,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        const now: Date = new Date();
        const _code = err.errorCode || err.error_code || err.code;
        const code: number =
            typeof _code === "number" && !isNaN(_code) ? _code : 500;
        const message: string =
            // err instanceof AxiosError
            //     ? err.response?.data?.message || err.message
            // :
            err.reason ||
            err.error_message ||
            err.message ||
            "Internal Server Error";
        console.error("[SERVER ERROR]", now.toLocaleString(), err);
        res.status(code).json({
            success: false,
            message,
        });
    }
);

(async () => {
    try {
        await Promise.all([WSService.init(app)]);
        const env: string = process.env.NODE_ENV || "development";
        if (env !== "test") {
            const port: number = +(process.env.PORT || 7990);
            app.listen(port, () => {
                console.info(
                    `Server listening on Port ${port} in the ${env} environment`
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
