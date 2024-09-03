import { validateQuery } from "../../middlewares/rest";
import { MappedPlayedGame } from "../../utils/types/mappers.types";
import {
    postPlayerAttestationBody,
    postPlayerAttestationParams,
} from "./played-games.schema";
import { setAttestationAndWithdrawRewards } from "./played-games.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const playedGamesRouter = Router();

const handleGameAttestation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { played_game_id } = req.params as unknown as MappedPlayedGame;
        const { attestation_hash } = req.body as unknown as MappedPlayedGame;
        const data = await setAttestationAndWithdrawRewards(
            played_game_id,
            attestation_hash,
        );
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

playedGamesRouter.post(
    "/:played_game_id/attestation",
    validateQuery("params", postPlayerAttestationParams),
    validateQuery("body", postPlayerAttestationBody),
    handleGameAttestation,
);
