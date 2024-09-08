import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const timestampParser = (timestamp: string): string => {
    const date = new Date(timestamp);

    return dayjs(date).utc().format("DD MMM YYYY, hh:mm A UTC");
};
