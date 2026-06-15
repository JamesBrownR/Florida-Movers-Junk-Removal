/* =====================================================
   Florida Movers & Junk Removal — main.js
   - Mobile nav toggle
   - Reviews carousel (touch + keyboard + dot nav)
===================================================== */

// ---- Mobile Nav ----
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click (smooth scroll to section)
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });
})();

// ---- Reviews Carousel ----
(function () {
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  const dotsContainer = document.getElementById('revDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  if (cards.length === 0) return;

  // Determine how many cards show per view
  function cardsPerView() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 960) return 2;
    return 3;
  }

  let current = 0;
  let perView = cardsPerView();
  let maxIndex = Math.max(0, cards.length - perView);

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    perView = cardsPerView();
    maxIndex = Math.max(0, cards.length - perView);
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'rev-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.rev-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function getCardWidth() {
    if (cards.length === 0) return 0;
    const card = cards[0];
    const gap = 24;
    return card.offsetWidth + gap;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
    updateDots();
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      perView = cardsPerView();
      maxIndex = Math.max(0, cards.length - perView);
      if (current > maxIndex) current = maxIndex;
      buildDots();
      track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
    }, 120);
  });

  buildDots();
})();

// ---- Formspree success message ----
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', function () {
    // Formspree handles the actual submission redirect; this is just UX feedback
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
    }
  });
})();
