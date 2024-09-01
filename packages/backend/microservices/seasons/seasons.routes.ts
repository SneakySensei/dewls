import {
    fetchAllSeasons,
    fetchCurrentLeaderboard,
    fetchCurrentSeason,
} from "./seasons.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const seasonsRouter = Router();

const handleGetAllSeasons = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await fetchAllSeasons();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetCurrentSeason = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await fetchCurrentSeason();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetCurrentLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const data = await fetchCurrentLeaderboard();
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

seasonsRouter.get("/", handleGetAllSeasons);
seasonsRouter.get("/current", handleGetCurrentSeason);
seasonsRouter.get("/current/leaderboard", handleGetCurrentLeaderboard);
