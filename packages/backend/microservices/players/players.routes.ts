import { validateQuery } from "../../middlewares/rest";
import { type MappedPlayer } from "../../utils/types/mappers.types";
import { getUserParams, userAuthBody } from "./players.schema";
import { createJWToken, createUser, fetchUserDetails } from "./players.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const playersRouter = Router();

const handleGetUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { player_id } = req.params as MappedPlayer;
        const data = await fetchUserDetails(player_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const handlerUserAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email_id, name, profile_photo, wallet_address } =
            req.body as MappedPlayer;
        let user = await fetchUserDetails(email_id);
        if (!user) {
            user = await createUser({
                email_id,
                name,
                profile_photo,
                wallet_address,
            });
        }
        const token = createJWToken(user);
        return res.json({
            success: true,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

playersRouter.post(
    "/auth",
    validateQuery("body", userAuthBody),
    handlerUserAuth,
);
playersRouter.get(
    "/:player_id",
    validateQuery("params", getUserParams),
    handleGetUser,
);
