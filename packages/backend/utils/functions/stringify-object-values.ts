export const stringifyObjectValues = <T extends Record<string, unknown>>(
    obj: T,
): Record<keyof T, string> => {
    const result: Partial<Record<keyof T, string>> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = JSON.stringify(obj[key]);
        }
    }

    return result as Record<keyof T, string>;
};
