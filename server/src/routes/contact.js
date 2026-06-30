const express = require('express');
const router = express.Router();

const { createTransporter } = require('../config/mailer');
const { validateContact } = require('../middleware/validate');
const rateLimit = require('../middleware/rateLimit');
const htmlEscape = require('../utils/htmlEscape');

/**
 * POST /api/contact
 * Body: { name, email, message }
 *
 * Sends the message to TO_EMAIL via Gmail SMTP (Nodemailer).
 * Validates input and applies a per-IP rate limit.
 */
router.post('/', rateLimit, validateContact, async (req, res) => {
  const { name, email, message } = req.contact;

  try {
    const transporter = createTransporter();
    const toAddress = process.env.TO_EMAIL;
    const fromAddress = process.env.EMAIL_USER;

    if (!toAddress || !fromAddress) {
      return res.status(500).json({
        ok: false,
        error: 'Server misconfigured: TO_EMAIL or EMAIL_USER missing.',
      });
    }

    const safeName = htmlEscape(name);
    const safeEmail = htmlEscape(email);
    const safeMessage = htmlEscape(message);

    const subject = `[WTF] New message from ${safeName}`;
    const htmlBody = `
      <div style="font-family: 'Courier New', monospace; background:#050a0d; color:#e8dcc4; padding:24px;">
        <h2 style="color:#c9602a; letter-spacing:2px;">// WTF // NEW CONTACT MESSAGE</h2>
        <table style="border-collapse:collapse; margin-top:16px;">
          <tr><td style="padding:6px 12px; color:#6e7a82;">NAME</td><td style="padding:6px 12px;">${safeName}</td></tr>
          <tr><td style="padding:6px 12px; color:#6e7a82;">EMAIL</td><td style="padding:6px 12px;">${safeEmail}</td></tr>
          <tr><td style="padding:6px 12px; color:#6e7a82;">TIME</td><td style="padding:6px 12px;">${new Date().toISOString()}</td></tr>
        </table>
        <hr style="border:none; border-top:1px solid #e8dcc433; margin:24px 0;" />
        <div style="white-space:pre-wrap; line-height:1.5;">${safeMessage}</div>
        <hr style="border:none; border-top:1px solid #e8dcc433; margin:24px 0;" />
        <p style="color:#6e7a82; font-size:12px;">Reply directly to this email to respond to ${safeEmail}.</p>
      </div>
    `;

    const textBody = `
// WTF // NEW CONTACT MESSAGE
-----------------------------------
NAME:  ${name}
EMAIL: ${email}
TIME:  ${new Date().toISOString()}
-----------------------------------
${message}
-----------------------------------
Reply directly to this email to respond to ${email}.
    `.trim();

    const info = await transporter.sendMail({
      from: `"WTF Contact" <${fromAddress}>`,
      to: toAddress,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;