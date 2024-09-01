import { validateQuery } from "../../middlewares";
import { type MappedUser } from "../../utils/types/mappers.types";
import { getUserParams, userSignupBody } from "./users.schema";
import { createJWToken, createUser, fetchUserDetails } from "./users.service";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

export const usersRouter = Router();

const handleGetUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id } = req.params as MappedUser;
        const data = await fetchUserDetails(user_id);
        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

const handlerUserSignup = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email_id, name, profile_photo, wallet_address } =
            req.body as MappedUser;
        const data = await createUser({
            email_id,
            name,
            profile_photo,
            wallet_address,
        });
        return res.json({
            success: true,
            data: {
                token: data,
            },
        });
    } catch (error) {
        next(error);
    }
};

const handlerUserLogin = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { user_id } = req.body as MappedUser;
        const user = await fetchUserDetails(user_id);
        const token = createJWToken(user);
        return res.json({
            success: true,
            data: {
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

usersRouter.post(
    "/signup",
    validateQuery("body", userSignupBody),
    handlerUserSignup,
);
usersRouter.post(
    "/login",
    validateQuery("body", userSignupBody),
    handlerUserLogin,
);
usersRouter.get(
    "/:user_id",
    validateQuery("params", getUserParams),
    handleGetUser,
);
