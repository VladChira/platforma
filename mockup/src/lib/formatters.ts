export const number = (value: number | null, digits = 0) =>
  value === null
    ? "Nu avem date"
    : new Intl.NumberFormat("ro-RO", { maximumFractionDigits: digits }).format(
        value,
      );
export const money = (value: number | null) =>
  value === null ? "Nu avem date" : `${number(value)} lei`;
export const compactMoney = (value: number | null) =>
  value === null
    ? "Nu avem date"
    : value >= 1000000
      ? `${number(value / 1000000, 2)} mil. lei`
      : money(value);
export const date = (value: string) =>
  new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
