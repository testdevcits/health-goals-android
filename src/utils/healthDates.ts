const OFFSET_MS = 330 * 60 * 1000;
const DAY_MS = 86400000;
export const istDateKey = (date: Date | string) => new Date(new Date(date).getTime() + OFFSET_MS).toISOString().slice(0, 10);
export const recentIstDates = (days = 7, now = new Date()) => {
  const midnight = Date.parse(`${istDateKey(now)}T00:00:00Z`);
  return Array.from({length: days}, (_, index) => new Date(midnight - (days - 1 - index) * DAY_MS).toISOString().slice(0,10));
};
export const recentHealthDayLabels = () => recentIstDates().map(date => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-IN', {weekday:'short',timeZone:'UTC'}));
