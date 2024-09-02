import { validateQuery } from "../../middlewares/rest";
import { MappedSeason } from "../../utils/types/mappers.types";
import { getSeasonLeaderboardParams } from "./leaderboard.schema";
import { fetchSeasonLeaderboard } from "./leaderboard.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const leaderboardRouter = Router();

const handleGetSeasonLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { season_id } = req.params as unknown as MappedSeason;
        const data = await fetchSeasonLeaderboard(season_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

leaderboardRouter.get(
    "/:season_id",
    validateQuery("params", getSeasonLeaderboardParams),
    handleGetSeasonLeaderboard,
);
