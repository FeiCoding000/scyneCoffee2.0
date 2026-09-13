const SYDNEY_TIME_ZONE = "Australia/Sydney";

const getSydneyParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(value("year")),
    month: Number(value("month")),
    day: Number(value("day")),
  };
};

const getSydneyOffsetMinutes = (date: Date) => {
  const timeZoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: SYDNEY_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  const match = timeZoneName?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;

  const [, sign, hours, minutes] = match;
  const offset = Number(hours) * 60 + Number(minutes);
  return sign === "+" ? offset : -offset;
};

const getDateFromKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
};

export const getSydneyDateKey = (date = new Date()) => {
  const { year, month, day } = getSydneyParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const getSydneyBoundaryDate = (dateKey: string, hour: number, minute = 0) => {
  const { year, month, day } = getDateFromKey(dateKey);
  const approximateUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMinutes = getSydneyOffsetMinutes(approximateUtc);
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - offsetMinutes * 60_000);
};

export const getSydneySettlementDate = (dateKey: string) =>
  getSydneyBoundaryDate(dateKey, 12, 30);

export const getNextSydneyDateKey = (dateKey: string) => {
  const { year, month, day } = getDateFromKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

const getWeekStart = (dateKey: string) => {
  const { year, month, day } = getDateFromKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - dayOfWeek + 1);
  return date;
};

export const getSydneyWeekKey = (dateKey = getSydneyDateKey()) => {
  const weekStart = getWeekStart(dateKey);
  const yearStart = new Date(Date.UTC(weekStart.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(
    ((weekStart.getTime() - yearStart.getTime()) / 86_400_000 + yearStart.getUTCDay() + 1) / 7
  );

  return `${weekStart.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
};

export const isAfterSydneySettlement = (dateKey: string, now = new Date()) =>
  now.getTime() >= getSydneySettlementDate(dateKey).getTime();

export const formatSydneyDisplayDate = (dateKey: string) => {
  const { year, month, day } = getDateFromKey(dateKey);
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: SYDNEY_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
};
