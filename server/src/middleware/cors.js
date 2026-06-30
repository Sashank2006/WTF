const cors = require('cors');

/**
 * Builds a CORS middleware that allows only origins listed in ALLOWED_ORIGIN.
 * ALLOWED_ORIGIN is a comma-separated string in the .env file.
 */
function buildCors() {
  const raw = process.env.ALLOWED_ORIGIN || '';
  const allowed = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.length === 0) {
    // Fail closed — if you forgot to set ALLOWED_ORIGIN, no one can call you.
    return cors({ origin: false });
  }

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server health checks)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
}

module.exports = buildCors;