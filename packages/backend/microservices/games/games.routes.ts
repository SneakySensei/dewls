import { fetchGames } from "./games.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const gamesRouter = Router();

const handleGetTiers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await fetchGames();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

gamesRouter.get("/", handleGetTiers);
