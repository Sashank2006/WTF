/* ============================================================
   ticker.js — top status bar marquee.
   Reads ticker items from [data-ticker-items] on the .ticker__track
   and animates the track horizontally on a loop.
   ============================================================ */

(function () {
  'use strict';

  function init() {
    const track = document.querySelector('.ticker__track');
    if (!track) return;

    // Duplicate the items so the marquee loops seamlessly.
    const original = track.innerHTML;
    track.innerHTML = original + original;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();