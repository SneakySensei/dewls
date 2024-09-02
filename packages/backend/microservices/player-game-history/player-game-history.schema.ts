import { type MappedPlayerGameHistory } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getPlayerHistoryForSeasonBody = yup
    .object()
    .shape<PartialYupSchema<MappedPlayerGameHistory>>({
        season_id: yup.string().trim().required(),
        player_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();
