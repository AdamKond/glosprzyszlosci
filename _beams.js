(function () {
  function createBeam(w, h) {
    return {
      x: Math.random() * w * 1.5 - w * 0.25,
      y: Math.random() * h * 1.5 - h * 0.25,
      width: 40 + Math.random() * 80,
      length: h * 2.5,
      angle: -35 + Math.random() * 10,
      speed: 0.4 + Math.random() * 0.8,
      opacity: 0.14 + Math.random() * 0.14,
      hue: 190 + Math.random() * 70,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.02,
    };
  }

  function resetBeam(beam, index, total, w, h) {
    var col = index % 3;
    var spacing = w / 3;
    beam.y = h + 100;
    beam.x = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
    beam.width = 80 + Math.random() * 100;
    beam.speed = 0.4 + Math.random() * 0.4;
    beam.hue = 190 + (index * 70) / total;
    beam.opacity = 0.18 + Math.random() * 0.1;
  }

  function initBeams(container) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:0',
      'filter:blur(18px)',  /* GPU-accelerated CSS blur — no ctx.filter needed */
      'will-change:transform',
      'display:block',
    ].join(';');

    container.insertBefore(canvas, container.firstChild);

    var ctx = canvas.getContext('2d');
    var TOTAL = 12; /* fewer beams = much less per-frame work */
    var beams = [];
    var raf;
    var w, h, dpr;
    var paused = false;

    /* Pause when tab is hidden to save CPU */
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
      if (!paused && !raf) raf = requestAnimationFrame(draw);
    });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2); /* cap at 2× to avoid 3× retina cost */
      w = container.offsetWidth;
      h = container.offsetHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beams = [];
      for (var i = 0; i < TOTAL; i++) beams.push(createBeam(w, h));
    }

    function draw() {
      if (paused) { raf = null; return; }
      ctx.clearRect(0, 0, w, h);
      /* No ctx.filter here — the CSS filter on the element handles blur via GPU */

      for (var i = 0; i < beams.length; i++) {
        var beam = beams[i];
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, i, TOTAL, w, h);

        var pulseOp = beam.opacity * (0.82 + Math.sin(beam.pulse) * 0.18);
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);

        /* Simplified 4-stop gradient (was 6) */
        var grad = ctx.createLinearGradient(0, 0, 0, beam.length);
        grad.addColorStop(0,   'hsla(' + beam.hue + ',80%,65%,0)');
        grad.addColorStop(0.2, 'hsla(' + beam.hue + ',80%,65%,' + pulseOp + ')');
        grad.addColorStop(0.8, 'hsla(' + beam.hue + ',80%,65%,' + pulseOp + ')');
        grad.addColorStop(1,   'hsla(' + beam.hue + ',80%,65%,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150); /* debounce resize */
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.page-hero, section.hero').forEach(initBeams);
  });
})();
