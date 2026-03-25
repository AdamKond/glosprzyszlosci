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
