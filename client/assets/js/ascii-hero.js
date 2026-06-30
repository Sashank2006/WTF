/* ============================================================
   ascii-hero.js
   Rasterizes the hero face photo into ASCII art with a
   periodic polarity-invert glitch flash, mimicking the
   technique from ref3 (Yannick Grégoire portfolio).
   ============================================================ */

(function () {
  'use strict';

  // Brightness ramp: space (dark) → full block (bright)
  // Tuned to give smooth gradient coverage with monospace font.
  const RAMP = ' .:-+=*#%@█';

  const CONFIG = {
    gridWidth: 90,            // chars across
    gridHeight: 36,           // chars down
    fontAspect: 0.5,          // terminal chars are ~2:1 tall:wide; we compensate
    photoPath: './assets/img/face.jpg',
    fallbackPath: './assets/img/fallback-hero.svg',
    glitchIntervalMs: 4000,   // glitch every 4s
    glitchDurationMs: 220,    // flash lasts 220ms
  };

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load ' + src));
      img.src = src;
    });
  }

  function tryLoad(src) {
    // Try to load; resolve null on failure so we can fall back.
    return loadImage(src).catch(() => null);
  }

  function rasterize(img, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '';

    // Draw image scaled to grid, applying B/W tint to maximize contrast.
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.filter = 'grayscale(1) contrast(1.25) brightness(0.95)';
    ctx.drawImage(img, 0, 0, width, height);

    const { data } = ctx.getImageData(0, 0, width, height);
    let out = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        // Luminance from RGB (Rec. 601)
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const rampIdx = Math.min(
          RAMP.length - 1,
          Math.floor((lum / 255) * (RAMP.length - 1))
        );
        out += RAMP[rampIdx];
      }
      out += '\n';
    }
    return out;
  }

  /**
   * Renders the face ASCII into the given <pre>.
   * Falls back to a photo (no animation) if image cannot be loaded.
   */
  async function mount(el) {
    if (!el) return;

    // Try the real face photo first, then the urban fallback.
    const photo = (await tryLoad(CONFIG.photoPath)) ||
                  (await tryLoad(CONFIG.fallbackPath));

    if (!photo) {
      // Last resort: leave the <pre> empty, show a HUD message instead.
      el.textContent = '\n\n\n\n       // NO SIGNAL // HERO PHOTO NOT FOUND\n       // DROP face.jpg INTO assets/img/ TO ENABLE\n';
      el.classList.add('is-fallback');
      return;
    }

    // Compensate for character aspect ratio so the result isn't squashed.
    const adjustedHeight = Math.round(CONFIG.gridHeight * CONFIG.fontAspect);
    const art = rasterize(photo, CONFIG.gridWidth, adjustedHeight);

    // Render once immediately.
    el.textContent = art;

    // Skip animation if reduced motion or hidden.
    if (prefersReducedMotion() || document.hidden) return;

    // Periodic polarity-invert glitch.
    let timer = null;
    function flash() {
      el.classList.add('is-inverted');
      setTimeout(() => el.classList.remove('is-inverted'), CONFIG.glitchDurationMs);
    }
    function loop() {
      flash();
      timer = setTimeout(loop, CONFIG.glitchIntervalMs);
    }
    timer = setTimeout(loop, CONFIG.glitchIntervalMs);

    // Cleanup on page hide.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(timer);
        timer = null;
      } else if (!timer) {
        loop();
      }
    });
  }

  function init() {
    const el = document.querySelector('[data-ascii-hero]');
    if (el) mount(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();