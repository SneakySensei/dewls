import { validateQuery } from "../../middlewares/rest";
import { MappedSeason } from "../../utils/types/mappers.types";
import { getSeasonLeaderboardParams } from "./game-history.schema";
import { fetchPlayerGameHistory } from "./game-history.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const gameHistoryRouter = Router();

const handleGetPlayerGameHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { season_id } = req.params as unknown as MappedSeason;
        const data = await fetchPlayerGameHistory(season_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

gameHistoryRouter.get(
    "/:season_id",
    validateQuery("params", getSeasonLeaderboardParams),
    handleGetPlayerGameHistory,
);
