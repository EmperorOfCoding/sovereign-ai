/**
 * normalizes the Sentry traces sample rate from a raw string input.
 * @param rawRate - The raw string value from an environment variable.
 * @param fallback - The default rate to return if validation fails.
 * @returns A validated number between 0 and 1.
 */
export function normalizeTracesSampleRate(rawRate: string | undefined, fallback: number = 0.1): number {
  const rate = parseFloat(rawRate || String(fallback));
  return Number.isFinite(rate) && rate >= 0 && rate <= 1 ? rate : fallback;
}
