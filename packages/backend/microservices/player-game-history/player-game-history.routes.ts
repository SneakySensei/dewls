import { validateQuery } from "../../middlewares/rest";
import { MappedPlayerGameHistory } from "../../utils/types/mappers.types";
import { getPlayerHistoryForSeasonBody } from "./player-game-history.schema";
import { fetchPlayerHistoryForSeason } from "./player-game-history.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const playerGameHistoryRouter = Router();

const handlePlayerHistoryForSeason = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { season_id, player_id } = req.body as MappedPlayerGameHistory;
        const data = await fetchPlayerHistoryForSeason(player_id, season_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

playerGameHistoryRouter.post(
    "/",
    validateQuery("body", getPlayerHistoryForSeasonBody),
    handlePlayerHistoryForSeason,
);
