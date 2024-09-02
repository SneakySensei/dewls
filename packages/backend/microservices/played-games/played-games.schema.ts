import { type MappedPlayer } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getUserGamesParams = yup
    .object()
    .shape<PartialYupSchema<MappedPlayer>>({
        player_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();
