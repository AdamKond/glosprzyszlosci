(function () {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var dot = document.createElement('div');
  dot.id = 'c-dot';
  document.body.appendChild(dot);

  // Direct — zero lag
  document.addEventListener('mousemove', function (e) {
    dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  }, { passive: true });

  var sel = 'a,button,input,textarea,select,[role="button"],.btn,.preview-card,.help-card,.award-block,.nav-cta';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(sel)) dot.classList.add('c-hover');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(sel)) dot.classList.remove('c-hover');
  });
  document.addEventListener('mousedown', function () { dot.classList.add('c-click'); });
  document.addEventListener('mouseup',   function () { dot.classList.remove('c-click'); });
  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; });
})();

// ── PAGE LOADER ──
(function () {
  var loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', function () {
    loader.classList.add('loader-done');
    setTimeout(function () { loader.style.display = 'none'; }, 700);
  });
  // Fallback
  setTimeout(function () {
    if (loader) { loader.classList.add('loader-done'); setTimeout(function(){ loader.style.display='none'; }, 700); }
  }, 3000);
})();
