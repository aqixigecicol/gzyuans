/* ============================================
   gzyuans.com - Animations Library
   Particles, cursor, parallax, etc.
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initCustomCursor();
    initParticles();
    initMagnetic();
    initParallax();
    initTiltCards();
    initCodeRain();
    initCodeTypewriter();
  });

  // ===== Custom Cursor =====
  function initCustomCursor() {
    if (window.matchMedia('(max-width: 960px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY, ringX = mouseX, ringY = mouseY;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate(' + (mouseX - 3) + 'px,' + (mouseY - 3) + 'px)';
    });

    function animate() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = 'translate(' + (ringX - 18) + 'px,' + (ringY - 18) + 'px)';
      requestAnimationFrame(animate);
    }
    animate();

    // Hover effect
    document.querySelectorAll('a, button, .feature-card, .service-card, .news-card, .app-card, .process-step, .contact-item, .tech-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  // ===== Floating Particles (decorative) =====
  function initParticles() {
    const containers = document.querySelectorAll('[data-particles]');
    if (!containers.length) return;

    containers.forEach(function (container) {
      const count = parseInt(container.getAttribute('data-particles') || '30', 10);
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
      container.style.position = container.style.position || 'relative';
      container.insertBefore(canvas, container.firstChild);

      const ctx = canvas.getContext('2d');
      let w, h, particles = [];
      let mouseX = -1000, mouseY = -1000;

      function resize() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        w = rect.width;
        h = rect.height;
        initParticlesArray();
      }

      function initParticlesArray() {
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
            color: Math.random() > 0.5 ? '#00d4ff' : '#7b61ff',
            alpha: Math.random() * 0.6 + 0.2
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, w, h);
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i], p2 = particles[j];
            const dx = p1.x - p2.x, dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.15 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        // Draw particles
        particles.forEach(function (p) {
          // Update
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Mouse repel
          const mdx = p.x - mouseX, mdy = p.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 100) {
            const force = (100 - mdist) / 100;
            p.x += (mdx / mdist) * force * 2;
            p.y += (mdy / mdist) * force * 2;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
        requestAnimationFrame(draw);
      }

      container.addEventListener('mousemove', function (e) {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      container.addEventListener('mouseleave', function () {
        mouseX = -1000;
        mouseY = -1000;
      });

      window.addEventListener('resize', resize);
      resize();
      draw();
    });
  }

  // ===== Magnetic Effect =====
  function initMagnetic() {
    if (window.matchMedia('(max-width: 960px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.3) + 'px,' + (y * 0.3) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ===== Parallax Images =====
  function initParallax() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    let ticking = false;
    function update() {
      const scrollY = window.scrollY;
      const wh = window.innerHeight;
      els.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > wh) return;
        const center = rect.top + rect.height / 2;
        const offset = (wh / 2 - center) * 0.08;
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        const transform = (wh / 2 - center) * speed;
        el.style.transform = 'translate3d(0,' + transform + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ===== Tilt Cards =====
  function initTiltCards() {
    if (window.matchMedia('(max-width: 960px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -8;
        const rotateY = (x - 0.5) * 8;
        el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // ===== Code Rain (decorative, performance-aware) =====
  function initCodeRain() {
    const containers = document.querySelectorAll('.code-rain');
    if (!containers.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const snippets = [
      'const gzyuans = () => { return "innovation"; }',
      'function render() { return <Component />; }',
      'if (privacy) { data.stayLocal(); }',
      'design.minimal; design.immersive;',
      'class Team { build(); ship(); }',
      'export default gzyuans;',
      '0x00d4ff',
      'user.first; privacy.always;',
      'git commit -m "ship it"',
      'npm run build && deploy',
      'AI.generate(mood);',
      'experience.zen = true;',
      'render(<App />);',
      'await sleep(0);',
      'console.log("hello");'
    ];

    containers.forEach(function (container) {
      const count = parseInt(container.getAttribute('data-count') || '12', 10);
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.textContent = snippets[Math.floor(Math.random() * snippets.length)];
        span.style.left = (Math.random() * 100) + '%';
        span.style.animationDuration = (Math.random() * 12 + 8) + 's';
        span.style.animationDelay = (-Math.random() * 20) + 's';
        span.style.opacity = (Math.random() * 0.5 + 0.1).toString();
        container.appendChild(span);
      }
    });
  }

  // ===== Code Typewriter =====
  function initCodeTypewriter() {
    const blocks = document.querySelectorAll('.code-block-typed');
    if (!blocks.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateBlock(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    blocks.forEach(function (b) { observer.observe(b); });

    function animateBlock(block) {
      const lines = block.querySelectorAll('.line');
      lines.forEach(function (line, i) {
        setTimeout(function () { line.classList.add('is-visible'); }, i * 220);
      });
    }
  }

})();
