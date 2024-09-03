import { validateQuery } from "../../middlewares/rest";
import { MappedGameTier } from "../../utils/types/mappers.types";
import { getTierParams } from "./game-tier.schema";
import { fetchGameTier, fetchGameTiers } from "./game-tiers.service";
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

const handleGetTier = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { tier_id } = req.params as unknown as MappedGameTier;
        const data = await fetchGameTier(tier_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

gameTiersRouter.get("/", handleGetTiers);
gameTiersRouter.get(
    "/:tier_id",
    validateQuery("params", getTierParams),
    handleGetTier,
);
