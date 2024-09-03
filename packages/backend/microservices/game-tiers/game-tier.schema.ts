import { type MappedGameTier } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getTierParams = yup
    .object()
    .shape<PartialYupSchema<MappedGameTier>>({
        tier_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();
