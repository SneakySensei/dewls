export const calculatePercentage = (
  number: number,
  percentage: number
): number => {
  const result = number * (percentage / 100);
  return Math.ceil(result);
};
