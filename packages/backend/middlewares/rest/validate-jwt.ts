import type { NextFunction, Request, Response } from "express";
import { verify, VerifyErrors } from "jsonwebtoken";
import * as yup from "yup";

export const JwtRequestSchema = yup
    .object({
        authorization: yup
            .string()
            .trim()
            .min(1, "JWT cannot be null")
            .matches(/^Bearer .+$/, "JWT should be Bearer Token"),
    })
    .required();

type JwtRequest = yup.InferType<typeof JwtRequestSchema>;

export const validateJwt = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authorization } = req.headers as JwtRequest;
            const authToken = authorization!.split(" ")[1];
            verify(authToken, process.env.JWT_SECRET_KEY!);
            next();
        } catch (err: VerifyErrors | any) {
            res.status(403).json({
                success: false,
                message: `${err.name}: ${err.message}`,
            });
        }
    };
};
