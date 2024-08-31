import { fetchGameTiers } from "./game-tiers.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const gameTiersRouter = Router();

const handleGetTiers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await fetchGameTiers();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

gameTiersRouter.get("/", handleGetTiers);
