import { type MappedUser } from "../../utils/types/mappers.types";
import { type PartialYupSchema } from "../../utils/types/shared.types";
import * as yup from "yup";

export const getUserParams = yup
    .object()
    .shape<PartialYupSchema<MappedUser>>({
        user_id: yup.string().trim().required("chain_name is required"),
    })
    .strict()
    .noUnknown()
    .required();
