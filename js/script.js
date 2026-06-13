/* ============================================================
   Anderson Schultz Ribeiro — Portfolio JS v2
   Preserva 100% da lógica original + novos módulos:
     - Easter Egg foto (hover/touch → fotoperfil2.jpg)
     - Chuva de Pinguins Linux (SVG puro, sem GIF)
     - Modo Bitcoin/Linux no background canvas
     - Skill bars animadas
   ============================================================ */

'use strict';

/* ─── LOADING SCREEN ─────────────────────────────────────── */
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
  let pct = 0, stepIdx = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
    if (stepIdx < steps.length) loadTxt.textContent = steps[stepIdx++];
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => screen.classList.add('hidden'), 400);
    }
  }, 120);
})();

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
(function () {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  let rx = 0, ry = 0;
  (function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  })();

  document.querySelectorAll('a, button, .cert-card, .proj-card, .tech-item, #profile-img-border').forEach(el => {
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

/* ─── NAVBAR SCROLL ──────────────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ─── HAMBURGER MENU ─────────────────────────────────────── */
(function () {
  const btn       = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
})();

/* ─── PARTICLE CANVAS (original) ────────────────────────── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

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
      this.x += this.vx; this.y += this.vy;
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
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN},${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  })();
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
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

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
(function () {
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    (function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    })(start);
  }
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
})();

/* ─── CONTACT FORM ───────────────────────────────────────── */
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

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─── PARALLAX HERO ──────────────────────────────────────── */
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const frame = hero.querySelector('.hero-img-frame');
    if (frame) frame.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();

/* ─── TECH ITEMS STAGGER ─────────────────────────────────── */
(function () {
  document.querySelectorAll('.tech-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.04) + 's';
  });
})();

/* ─── [NOVO] SKILL BARS ANIMATION ───────────────────────── */
(function () {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w  = el.dataset.width || '0';
        // pequeno delay para garantir visibilidade antes de animar
        setTimeout(() => { el.style.width = w + '%'; }, 150);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
})();

/* ════════════════════════════════════════════════════════════
   [NOVO] EASTER EGG — Foto Hero + Pinguins + Modo Bitcoin
   ════════════════════════════════════════════════════════════ */
(function () {

  const imgEl       = document.getElementById('profile-photo');
  const imgBorder   = document.getElementById('profile-img-border');
  const rainEl      = document.getElementById('penguin-rain');
  const btcCanvas   = document.getElementById('btc-canvas');

  if (!imgEl || !rainEl || !btcCanvas) return;

  let eggActive = false;     // evita ativar múltiplas vezes ao mesmo tempo
  let restoreTimer = null;

  /* ── SVG de pinguim (Tux) desenhado em SVG inline ── */
  function makePenguinSVG() {
    // Tux minimalista construído com SVG puro — sem bitmap, sem GIF
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80" width="48" height="64" aria-hidden="true">
      <!-- corpo -->
      <ellipse cx="30" cy="50" rx="18" ry="24" fill="#1a1a1a"/>
      <!-- barriga branca -->
      <ellipse cx="30" cy="54" rx="11" ry="16" fill="#f0f0e8"/>
      <!-- cabeça -->
      <ellipse cx="30" cy="22" rx="15" ry="16" fill="#1a1a1a"/>
      <!-- rosto branco -->
      <ellipse cx="30" cy="26" rx="9" ry="10" fill="#f0f0e8"/>
      <!-- olho E -->
      <circle cx="25" cy="20" r="3" fill="white"/>
      <circle cx="26" cy="20" r="1.5" fill="#111"/>
      <!-- olho D -->
      <circle cx="35" cy="20" r="3" fill="white"/>
      <circle cx="36" cy="20" r="1.5" fill="#111"/>
      <!-- bico -->
      <ellipse cx="30" cy="28" rx="4" ry="2.5" fill="#f5a623"/>
      <!-- asa E -->
      <ellipse cx="10" cy="50" rx="7" ry="14" fill="#111" transform="rotate(-12,10,50)"/>
      <!-- asa D -->
      <ellipse cx="50" cy="50" rx="7" ry="14" fill="#111" transform="rotate(12,50,50)"/>
      <!-- pé E -->
      <ellipse cx="22" cy="74" rx="8" ry="4" fill="#f5a623"/>
      <!-- pé D -->
      <ellipse cx="38" cy="74" rx="8" ry="4" fill="#f5a623"/>
    </svg>`;
  }

  /* ── Lança a chuva de pinguins ── */
  function launchPenguins() {
    rainEl.innerHTML = '';
    const COUNT = window.innerWidth < 600 ? 14 : 28;

    for (let i = 0; i < COUNT; i++) {
      const div = document.createElement('div');
      div.className = 'penguin-svg';

      const leftPct  = Math.random() * 100;
      const duration = 2.5 + Math.random() * 2.5;       // 2.5s – 5s
      const delay    = Math.random() * 2.5;              // spread
      const scale    = 0.6 + Math.random() * 0.8;
      const rotate   = (Math.random() - 0.5) * 30;      // leve inclinação

      div.style.left      = leftPct + '%';
      div.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
      div.style.animationDuration = duration + 's';
      div.style.animationDelay   = delay + 's';
      div.innerHTML = makePenguinSVG();

      rainEl.appendChild(div);
    }

    // Remove pinguins após ~6s para liberar DOM
    setTimeout(() => { rainEl.innerHTML = ''; }, 6500);
  }

  /* ── Troca a foto suavemente ── */
  function swapPhoto(toSecond) {
    imgEl.style.opacity   = '0';
    imgEl.style.transform = 'scale(1.05)';
    setTimeout(() => {
      imgEl.src             = toSecond ? 'assets/images/fotoperfil2.jpg' : 'assets/images/fotoperfil.jpg';
      imgEl.style.opacity   = '1';
      imgEl.style.transform = 'scale(1)';
    }, 350);
  }

  /* ── Canvas Bitcoin/Linux ── */
  const btcCtx = btcCanvas.getContext('2d');
  let btcW, btcH, btcParticles = [], btcAnimId = null;

  function resizeBtc() {
    btcW = btcCanvas.width  = window.innerWidth;
    btcH = btcCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBtc, { passive: true });
  resizeBtc();

  // Símbolos que surgem no modo especial
  const BTC_SYMBOLS = ['₿', '⛓', '◈', '▲', '⎈', '○', 'Σ', '∞', '⟠', '#'];
  const AMBER = '255,184,0';
  const CYAN2 = '0,212,255';

  class BtcParticle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * btcW;
      this.y     = Math.random() * btcH;
      this.vx    = (Math.random() - 0.5) * 0.25;
      this.vy    = (Math.random() - 0.5) * 0.25;
      this.sym   = BTC_SYMBOLS[Math.floor(Math.random() * BTC_SYMBOLS.length)];
      this.size  = 10 + Math.random() * 14;
      this.color = Math.random() > 0.5 ? AMBER : CYAN2;
      this.alpha = 0.04 + Math.random() * 0.12;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -30 || this.x > btcW + 30 || this.y < -30 || this.y > btcH + 30) this.reset();
    }
    draw() {
      btcCtx.font         = `${this.size}px 'JetBrains Mono', monospace`;
      btcCtx.fillStyle    = `rgba(${this.color},${this.alpha})`;
      btcCtx.fillText(this.sym, this.x, this.y);
    }
  }

  function startBtcCanvas() {
    btcParticles = [];
    const COUNT = Math.min(60, Math.floor((btcW * btcH) / 20000));
    for (let i = 0; i < COUNT; i++) btcParticles.push(new BtcParticle());

    btcCanvas.classList.add('active');
    document.body.classList.add('btc-mode');

    function loop() {
      btcCtx.clearRect(0, 0, btcW, btcH);
      btcParticles.forEach(p => { p.update(); p.draw(); });
      btcAnimId = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopBtcCanvas() {
    btcCanvas.classList.remove('active');
    document.body.classList.remove('btc-mode');
    document.body.classList.add('btc-mode-restore');
    if (btcAnimId) { cancelAnimationFrame(btcAnimId); btcAnimId = null; }
    btcCtx.clearRect(0, 0, btcW, btcH);
    setTimeout(() => document.body.classList.remove('btc-mode-restore'), 1600);
  }

  /* ── Sequência completa do Easter Egg ── */
  function triggerEasterEgg() {
    if (eggActive) return;
    eggActive = true;

    // ETAPA 1: troca a foto
    swapPhoto(true);

    // ETAPA 2: chuva de pinguins (imediata)
    launchPenguins();

    // ETAPA 3: modo Bitcoin ativa ~0.5s após pinguins
    setTimeout(startBtcCanvas, 500);

    // ETAPA 4: restaura após ~8s
    if (restoreTimer) clearTimeout(restoreTimer);
    restoreTimer = setTimeout(() => {
      swapPhoto(false);      // restaura foto
      stopBtcCanvas();       // remove modo bitcoin
      eggActive = false;
    }, 8000);
  }

  /* ── Binding: Desktop (hover) ── */
  let hoverTimer = null;
  imgBorder.addEventListener('mouseenter', () => {
    if (eggActive) return;
    // pequeno delay para não ativar em passagem rápida
    hoverTimer = setTimeout(triggerEasterEgg, 400);
  });
  imgBorder.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
  });

  /* ── Binding: Mobile (tap/touch) ── */
  imgBorder.addEventListener('touchstart', (e) => {
    e.preventDefault();
    triggerEasterEgg();
  }, { passive: false });

})();
/* ── FIM Easter Egg ── */
