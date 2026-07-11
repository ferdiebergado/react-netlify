export const getTimeDiffMs = (date: string) =>
  Math.abs(new Date(date).getTime() - new Date().getTime());
