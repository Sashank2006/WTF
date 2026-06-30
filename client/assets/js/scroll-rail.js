/* ============================================================
   scroll-rail.js — bottom navigation row.
   - Highlights the rail item whose href matches the current page
   - Adds keyboard arrow support for left/right navigation
   ============================================================ */

(function () {
  'use strict';

  function init() {
    const rail = document.querySelector('[data-scroll-rail]');
    if (!rail) return;

    const items = Array.from(rail.querySelectorAll('.scroll-rail__item'));
    if (!items.length) return;

    // Highlight current page.
    const here = location.pathname.split('/').pop() || 'index.html';
    items.forEach((item) => {
      const href = item.getAttribute('href') || '';
      const target = href.split('/').pop();
      if (target === here || (here === '' && target === 'index.html')) {
        item.classList.add('is-active');
      }
    });

    // Keyboard arrows: ←/→ jumps to prev/next rail item.
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      const idx = items.findIndex((it) => it.classList.contains('is-active'));
      if (idx === -1) return;

      let nextIdx = idx;
      if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
      else if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
      else return;

      e.preventDefault();
      const target = items[nextIdx];
      const href = target.getAttribute('href');
      if (href && !href.startsWith('#')) {
        location.href = href;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();