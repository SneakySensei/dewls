import { verify, VerifyErrors } from "jsonwebtoken";

export const validateJwt = (authToken: string) => {
    try {
        authToken = authToken.split(" ")[0];
        verify(authToken, process.env.JWT_SECRET_KEY!);
    } catch (err: VerifyErrors | any) {
        throw err;
    }
};
