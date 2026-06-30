/**
 * Validates a contact-form payload.
 * Expects: { name, email, message }
 * Returns: { ok: true, data } on success, { ok: false, errors } on failure.
 */
function validateContactPayload(body) {
  const errors = [];

  const name = (body?.name ?? '').toString().trim();
  const email = (body?.email ?? '').toString().trim();
  const message = (body?.message ?? '').toString().trim();

  if (name.length < 1 || name.length > 100) {
    errors.push('name must be between 1 and 100 characters');
  }

  // Simple but reasonable email regex
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    errors.push('email is invalid');
  }

  if (message.length < 1 || message.length > 5000) {
    errors.push('message must be between 1 and 5000 characters');
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { name, email, message },
  };
}

/**
 * Express middleware wrapper around validateContactPayload.
 * Responds 400 with errors on failure, attaches req.contact on success.
 */
function validateContact(req, res, next) {
  const result = validateContactPayload(req.body);
  if (!result.ok) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }
  req.contact = result.data;
  next();
}

module.exports = {
  validateContactPayload,
  validateContact,
};