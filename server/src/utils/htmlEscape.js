/**
 * Escapes HTML special characters in a string to prevent XSS.
 * Used to sanitize contact-form fields before embedding them in the email body.
 *
 * @param {string} str - Raw user input
 * @returns {string} HTML-safe string
 */
function htmlEscape(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = htmlEscape;