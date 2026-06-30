/**
 * Simple in-memory IP rate limiter for the contact form.
 *
 * Stores a sliding-window of submission timestamps per IP.
 * Default: max 5 submissions per IP per hour.
 *
 * NOTE: this is in-memory only — on Render free tier the service may sleep
 * and lose state, but that's fine since each cold-start resets the limiter.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_HITS = 5;

const hits = new Map(); // ip -> array of timestamps

function prune(timestamps, now) {
  const cutoff = now - WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}

function rateLimit(req, res, next) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();
  const recent = prune(hits.get(ip) || [], now);

  if (recent.length >= MAX_HITS) {
    return res.status(429).json({
      ok: false,
      error: 'Too many submissions. Try again later.',
    });
  }

  recent.push(now);
  hits.set(ip, recent);
  next();
}

module.exports = rateLimit;