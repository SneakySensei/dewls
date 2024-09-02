import { type MappedSeason } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getSeasonLeaderboardParams = yup
    .object()
    .shape<PartialYupSchema<MappedSeason>>({
        season_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();
