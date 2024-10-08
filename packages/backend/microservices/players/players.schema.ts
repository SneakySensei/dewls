import { type MappedPlayer } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getUserParams = yup
    .object()
    .shape<PartialYupSchema<MappedPlayer>>({
        player_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();

export const userAuthBody = yup
    .object()
    .shape<PartialYupSchema<MappedPlayer>>({
        email_id: yup.string().trim().email().required(),
        profile_photo: yup.string().trim().url().required(),
        name: yup.string().trim().required(),
        wallet_address: yup
            .string()
            .trim()
            .matches(/^0x[a-fA-F0-9]{40}$/, "invalid evm address")
            .required(),
    })
    .strict()
    .noUnknown()
    .required();
