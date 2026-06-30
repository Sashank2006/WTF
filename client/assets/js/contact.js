/* ============================================================
   contact.js — handles the contact form submission.
   Posts to {API_BASE}/api/contact and shows success/error inline.
   ============================================================ */

(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }

  function init() {
    const form = $('#contact-form');
    if (!form) return;

    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    const originalLabel = submit ? submit.textContent : '';

    function setStatus(kind, message) {
      if (!status) return;
      status.classList.remove('is-success', 'is-error');
      status.classList.add(kind === 'ok' ? 'is-success' : 'is-error');
      status.textContent = message;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const payload = {
        name: (formData.get('name') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        message: (formData.get('message') || '').toString().trim(),
      };

      if (!payload.name || !payload.email || !payload.message) {
        setStatus('err', '// ALL FIELDS REQUIRED');
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = 'TRANSMITTING...';
      }

      const base = (window.WTF_CONFIG && window.WTF_CONFIG.API_BASE) || '';
      if (!base) {
        setStatus('err', '// API URL NOT CONFIGURED. SET WTF_CONFIG.API_BASE IN assets/js/config.js');
        if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
        return;
      }

      try {
        const res = await fetch(base.replace(/\/$/, '') + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          setStatus('ok', '// MESSAGE TRANSMITTED. I WILL REPLY SOON.');
          form.reset();
        } else {
          const errMsg =
            (data && data.errors && data.errors.join(' / ')) ||
            (data && data.error) ||
            '// TRANSMISSION FAILED. TRY AGAIN.';
          setStatus('err', errMsg.toUpperCase());
        }
      } catch (err) {
        console.error(err);
        setStatus('err', '// NETWORK ERROR. CHECK CONNECTION AND TRY AGAIN.');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalLabel;
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();