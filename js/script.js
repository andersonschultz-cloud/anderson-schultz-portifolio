/* ============================================================
   Anderson Schultz Ribeiro — Portfolio JS
   ============================================================ */

'use strict';

/* === LOADING SCREEN === */
(function () {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loading-bar');
  const loadTxt = document.getElementById('loading-text');

  const steps = [
    'Inicializando sistema...',
    'Carregando módulos...',
    'Conectando pipelines...',
    'Provisionando stack...',
    'Pronto.',
  ];
  let pct = 0;
  let stepIdx = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
    if (stepIdx < steps.length) {
      loadTxt.textContent = steps[stepIdx++];
    }
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('hidden');
      }, 400);
    }
  }, 120);
})();

/* === CUSTOM CURSOR === */
(function () {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  let rx = 0, ry = 0;
  function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  document.querySelectorAll('a, button, .cert-card, .proj-card, .tech-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(2)';
      ring.style.width  = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'var(--green)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'var(--cyan-glow)';
    });
  });
})();

/* === NAVBAR SCROLL === */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* === HAMBURGER MENU === */
(function () {
  const btn = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;

  btn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
})();

/* === PARTICLE CANVAS === */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 14000));
  const CYAN  = '0, 212, 255';
  const GREEN = '0, 255, 136';

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.5;
      this.color = Math.random() > 0.7 ? GREEN : CYAN;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    const MAX_DIST = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(loop);
  }
  loop();
})();

/* === SCROLL REVEAL === */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();

/* === COUNTER ANIMATION === */
(function () {
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* === CONTACT FORM === */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-message');
    msg.style.display = 'block';
    msg.className = 'success';
    msg.textContent = '✓ Mensagem recebida! Responderei em breve.';
    form.reset();
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  });
})();

/* === SMOOTH SCROLL LINKS === */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* === PARALLAX HERO === */
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = y * 0.3 + 'px';
    const frame = hero.querySelector('.hero-img-frame');
    if (frame) frame.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();

/* === TECH ITEMS STAGGER === */
(function () {
  const items = document.querySelectorAll('.tech-item');
  items.forEach((item, i) => {
    item.style.transitionDelay = (i * 0.04) + 's';
  });
})();
