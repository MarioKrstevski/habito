import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const indexCache = new Map<string, number>();
export const isEmoji = (char: string) => {
  if (!char) return false;
  const codePoints = Array.from(char);
  return (
    codePoints.length === 1 && /\p{Extended_Pictographic}/u.test(char)
  );
};
export function getCachedDateIndex(month?: number, day?: number) {
  // Default to today's date if nothing is passed
  const today = new Date();
  console.log({ month, day }, today);
  const resolvedMonth = month ?? today.getMonth();
  const resolvedDay = day ?? today.getDate();

  const cacheKey = `${resolvedMonth}-${resolvedDay}`;

  // Return from cache if available
  if (indexCache.has(cacheKey)) return indexCache.get(cacheKey)!;

  // Define days per month, accounting for leap years
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeapYear = (year: number) =>
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (
    resolvedMonth === 1 &&
    resolvedDay === 29 &&
    isLeapYear(today.getFullYear())
  ) {
    return getCachedDateIndex(1, 28); // Treat Feb 29 as Feb 28
  }

  if (
    resolvedMonth < 0 ||
    resolvedMonth > 11 ||
    resolvedDay < 1 ||
    resolvedDay > monthDays[resolvedMonth]
  ) {
    throw new Error(
      `Invalid date: ${resolvedMonth + 1}/${resolvedDay}`
    );
  }

  // Calculate the index
  const index =
    monthDays
      .slice(0, resolvedMonth)
      .reduce((acc, days) => acc + days, 0) +
    (resolvedDay - 1);

  // Store result in cache
  indexCache.set(cacheKey, index);

  return index;
}

export function formatDate(date: Date, format: string) {
  if (!date) return "nodate";
  const dateToWorkWith = new Date(date);
  const day = dateToWorkWith.getDate();
  const month = dateToWorkWith.toLocaleString("default", {
    month: "long",
  });
  return `${day} ${month}`;
}
