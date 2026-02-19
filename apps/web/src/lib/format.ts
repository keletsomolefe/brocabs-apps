/**
 * Formatting Utilities
 *
 * Shared formatting functions for consistent display across the application.
 */

/**
 * Default locale for the application (South Africa)
 */
export const DEFAULT_LOCALE = "en-ZA";

/**
 * Default currency for the application
 */
export const DEFAULT_CURRENCY = "ZAR";

/**
 * Format a number as currency in ZAR
 */
export function formatCurrency(
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

/**
 * Format a date with time
 */
export function formatDateTime(value: Date | string | unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a date without time
 */
export function formatDate(value: Date | string | unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
