import { validateQuery } from "../../middlewares/rest";
import { MappedPlayer } from "../../utils/types/mappers.types";
import { getUserGamesParams } from "./played-games.schema";
import { fetchAllUserGames } from "./played-games.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const playedGamesRouter = Router();

const handleAllUserGames = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { player_id } = req.params as MappedPlayer;
        const data = await fetchAllUserGames(player_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

playedGamesRouter.get(
    "/:player_id",
    validateQuery("params", getUserGamesParams),
    handleAllUserGames,
);
