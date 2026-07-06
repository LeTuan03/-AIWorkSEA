type Hit = { count: number; resetAt: number };

// In-memory fixed-window rate limiter. Sufficient for a single instance / dev.
// For multi-instance production, swap for Redis / Upstash rate limiting.
const store = new Map<string, Hit>();

// Returns true if the action is allowed, false if the limit is exceeded.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || hit.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (hit.count >= limit) return false;

  hit.count += 1;
  return true;
}
