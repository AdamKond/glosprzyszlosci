(function () {
  function createBeam(w, h) {
    return {
      x: Math.random() * w * 1.5 - w * 0.25,
      y: Math.random() * h * 1.5 - h * 0.25,
      width: 30 + Math.random() * 60,
      length: h * 2.5,
      angle: -35 + Math.random() * 10,
      speed: 0.6 + Math.random() * 1.2,
      opacity: 0.12 + Math.random() * 0.16,
      hue: 190 + Math.random() * 70,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  function resetBeam(beam, index, total, w, h) {
    var col = index % 3;
    var spacing = w / 3;
    beam.y = h + 100;
    beam.x = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
    beam.width = 100 + Math.random() * 100;
    beam.speed = 0.5 + Math.random() * 0.4;
    beam.hue = 190 + (index * 70) / total;
    beam.opacity = 0.2 + Math.random() * 0.1;
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
      'filter:blur(15px)',
      'display:block',
    ].join(';');

    // Insert as very first child so it's behind everything
    container.insertBefore(canvas, container.firstChild);

    var ctx = canvas.getContext('2d');
    var TOTAL = 30;
    var beams = [];
    var raf;
    var w, h, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = container.offsetWidth;
      h = container.offsetHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      beams = [];
      for (var i = 0; i < TOTAL; i++) beams.push(createBeam(w, h));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.filter = 'blur(30px)';

      beams.forEach(function (beam, i) {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) resetBeam(beam, i, TOTAL, w, h);

        var pulseOp = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);

        var grad = ctx.createLinearGradient(0, 0, 0, beam.length);
        grad.addColorStop(0,   'hsla(' + beam.hue + ',85%,65%,0)');
        grad.addColorStop(0.1, 'hsla(' + beam.hue + ',85%,65%,' + (pulseOp * 0.5) + ')');
        grad.addColorStop(0.4, 'hsla(' + beam.hue + ',85%,65%,' + pulseOp + ')');
        grad.addColorStop(0.6, 'hsla(' + beam.hue + ',85%,65%,' + pulseOp + ')');
        grad.addColorStop(0.9, 'hsla(' + beam.hue + ',85%,65%,' + (pulseOp * 0.5) + ')');
        grad.addColorStop(1,   'hsla(' + beam.hue + ',85%,65%,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }

  // Apply to page-hero on all subpages, and the main hero section
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.page-hero, section.hero').forEach(initBeams);
  });
})();
