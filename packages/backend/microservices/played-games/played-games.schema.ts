import { type MappedPlayedGame } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const postPlayerAttestationParams = yup
    .object()
    .shape<PartialYupSchema<MappedPlayedGame>>({
        played_game_id: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();

export const postPlayerAttestationBody = yup
    .object()
    .shape<PartialYupSchema<MappedPlayedGame>>({
        attestation_hash: yup.string().trim().required(),
    })
    .strict()
    .noUnknown()
    .required();
