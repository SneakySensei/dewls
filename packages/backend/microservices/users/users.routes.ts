import { validateQuery } from "../../middlewares";
import { type MappedUser } from "../../utils/types/mappers.types";
import { getUserParams } from "./users.schema";
import { fetchUserDetails } from "./users.service";
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

usersRouter.get(
    "/:user_id",
    validateQuery("params", getUserParams),
    handleGetUser,
);
