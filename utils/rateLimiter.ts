// In-memory IP-based rate limiter
const ipRateLimit: Record<string, { count: number; lastReset: number }> = {};
const MAX_REQUESTS_PER_MINUTE = 5;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;

  const record = ipRateLimit[ip];

  if (!record || record.lastReset < oneMinuteAgo) {
    ipRateLimit[ip] = { count: 1, lastReset: now };
    return false;
  }

  if (record.count < MAX_REQUESTS_PER_MINUTE) {
    record.count++;
    return false;
  }

  return true;
}
