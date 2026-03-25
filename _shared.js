// ── Scroll reveal — single shared observer, disconnects after trigger ──
(function () {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  function init() {
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── Scroll progress bar ──
(function () {
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
  }, { passive: true });
})();

// ── Back to top button ──
(function () {
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Wróć na górę');
  btn.innerHTML = '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('btt-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Nav: darken on scroll + active section highlighting ──
(function () {
  var nav = document.getElementById('navbar');
  if (!nav) return;

  // Darken background on scroll
  window.addEventListener('scroll', function () {
    nav.style.background = window.scrollY > 20
      ? 'rgba(7,14,26,0.97)'
      : 'rgba(7,14,26,0.92)';
  }, { passive: true });

  // Highlight the nav link matching the visible section
  var sections = document.querySelectorAll('section[id], div[id="hero"]');
  if (!sections.length) return;

  var links = nav.querySelectorAll('.nav-links a');
  var sectionObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var matches = href === '#' + id || href.split('#')[1] === id;
        a.classList.toggle('active', matches);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(function (s) { sectionObs.observe(s); });
})();

// ── Mobile menu: smooth close on Escape ──
(function () {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var menu = document.getElementById('mobile-menu');
      var hamburger = document.getElementById('hamburger');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();
