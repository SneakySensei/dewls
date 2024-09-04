const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const timestampParser = (timestamp: string): string => {
    const date = new Date(timestamp);

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Format the date as "DD MMM YYYY (UTC)"
    return `${day} ${month} ${year} (UTC)`;
};
