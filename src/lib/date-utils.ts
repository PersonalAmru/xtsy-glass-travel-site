/**
 * Date utilities for consistent local timezone handling
 * Prevents off-by-one day errors when converting between Date objects and YYYY-MM-DD strings
 */

/**
 * Format a Date object to YYYY-MM-DD string in LOCAL timezone
 * This prevents timezone offset issues where dates shift by 1 day
 */
export const formatLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse a YYYY-MM-DD string as a Date in LOCAL timezone
 * This prevents timezone offset issues where dates shift by 1 day
 */
export const parseLocalDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const [year, month, day] = dateString.split('-').map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
  return new Date(year, month - 1, day);
};

/**
 * Get today's date at midnight in local timezone
 */
export const getLocalToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
