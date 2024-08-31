import { type Schema } from "yup";

export type PartialYupSchema<T> = {
    [K in keyof T]?: Schema;
};
