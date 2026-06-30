const nodemailer = require('nodemailer');

/**
 * Creates a Gmail SMTP transporter using credentials from environment variables.
 * Gmail requires an "App Password" — not the user's normal password.
 * See: https://support.google.com/accounts/answer/185833
 *
 * @returns {nodemailer.Transporter}
 */
function createTransporter() {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      'Missing EMAIL_USER or EMAIL_PASS in environment. See server/.env.example.'
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

module.exports = { createTransporter };