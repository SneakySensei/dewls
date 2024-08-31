export const parseStringifiedValues = <T extends object>(obj: object): T => {
    const result: Record<string, unknown> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            try {
                result[key] = JSON.parse(obj[key as keyof typeof obj]);
            } catch (e) {
                result[key] = obj[key as keyof typeof obj];
            }
        }
    }

    return result as T;
};
