/**
 * connectivity.js — fundo vivo de conectividade (v6.2)
 * Canvas leve, responsivo, sem dependências e otimizado para Safari/iPhone.
 */
(() => {
  'use strict';

  const canvas = document.getElementById('connectivityCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  let w = 0, h = 0, dpr = 1, nodes = [], raf = 0, last = 0;
  let pointer = { x: -9999, y: -9999, active: false };
  const FPS = isIOS || coarse.matches ? 30 : 42;
  const frameMs = 1000 / FPS;

  const theme = () => document.documentElement.getAttribute('data-theme') || 'dark';
  const rand = (a, b) => a + Math.random() * (b - a);

  function palette() {
    return theme() === 'light'
      ? {
          line: [24, 126, 219],
          node: [18, 132, 235],
          hot: [31, 168, 255],
          lineAlpha: 0.095,
          nodeAlpha: 0.34,
          glowAlpha: 0.16,
          clear: 1
        }
      : {
          line: [35, 161, 255],
          node: [50, 185, 255],
          hot: [79, 211, 255],
          lineAlpha: 0.17,
          nodeAlpha: 0.72,
          glowAlpha: 0.34,
          clear: 1
        };
  }

  function nodeCount() {
    const area = Math.max(320 * 600, w * h);
    const base = Math.round(area / (coarse.matches ? 30000 : 24000));
    return Math.max(coarse.matches ? 24 : 34, Math.min(coarse.matches ? 52 : 76, base));
  }

  function makeNode() {
    const speed = coarse.matches ? 0.085 : 0.11;
    return {
      x: rand(0, w), y: rand(0, h),
      vx: rand(-speed, speed), vy: rand(-speed, speed),
      r: rand(1.1, 2.35),
      phase: rand(0, Math.PI * 2),
      pulse: rand(0.45, 1.05),
      depth: rand(0.55, 1),
      hot: Math.random() > 0.82
    };
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, isIOS ? 1.35 : 1.6);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = nodeCount();
    if (nodes.length < count) while (nodes.length < count) nodes.push(makeNode());
    else if (nodes.length > count) nodes.length = count;
    nodes.forEach(n => {
      n.x = Math.min(w, Math.max(0, n.x));
      n.y = Math.min(h, Math.max(0, n.y));
    });
    draw(performance.now(), false);
  }

  function rgba(rgb, a) { return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

  function update(dt) {
    const scale = Math.min(dt, 40);
    for (const n of nodes) {
      n.x += n.vx * scale;
      n.y += n.vy * scale;
      if (n.x < -20) n.x = w + 20;
      else if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      else if (n.y > h + 20) n.y = -20;

      if (pointer.active && !coarse.matches) {
        const dx = pointer.x - n.x, dy = pointer.y - n.y;
        const dsq = dx * dx + dy * dy;
        if (dsq < 32000 && dsq > 16) {
          const inv = 1 / Math.sqrt(dsq);
          n.x += dx * inv * 0.018 * scale;
          n.y += dy * inv * 0.018 * scale;
        }
      }
    }
  }

  function draw(t, move = true) {
    const p = palette();
    ctx.clearRect(0, 0, w, h);
    if (!nodes.length) return;

    const maxDist = coarse.matches ? 126 : 154;
    const maxDistSq = maxDist * maxDist;

    // Conexões primeiro: finas, suaves e com fade pela distância.
    ctx.lineWidth = theme() === 'light' ? 0.72 : 0.82;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dsq = dx * dx + dy * dy;
        if (dsq > maxDistSq) continue;
        const fade = 1 - dsq / maxDistSq;
        const pulse = 0.76 + 0.24 * Math.sin(t * 0.0008 + a.phase + b.phase);
        ctx.strokeStyle = rgba(p.line, p.lineAlpha * fade * pulse * Math.min(a.depth, b.depth));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    // Nós luminosos: cada um pulsa em um ritmo próprio.
    for (const n of nodes) {
      const wave = 0.58 + 0.42 * Math.sin(t * 0.0011 * n.pulse + n.phase);
      const rgb = n.hot ? p.hot : p.node;
      const radius = n.r * (0.88 + wave * 0.48);
      const glow = radius * (theme() === 'light' ? 6.2 : 8.4);

      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
      g.addColorStop(0, rgba(rgb, p.glowAlpha * wave * n.depth));
      g.addColorStop(0.28, rgba(rgb, p.glowAlpha * 0.34 * wave));
      g.addColorStop(1, rgba(rgb, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y, glow, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = rgba(rgb, p.nodeAlpha * (0.62 + 0.38 * wave) * n.depth);
      ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2); ctx.fill();

      if (n.hot) {
        ctx.strokeStyle = rgba(rgb, (theme() === 'light' ? 0.14 : 0.30) * wave);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(n.x, n.y, radius * 3.2, 0, Math.PI * 2); ctx.stroke();
      }
    }

    if (move) update(frameMs);
  }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (document.hidden || reduceMotion.matches) return;
    if (t - last < frameMs) return;
    const dt = last ? t - last : frameMs;
    last = t;
    update(dt);
    draw(t, false);
  }

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(canvas); else window.addEventListener('resize', resize, { passive: true });

  if (!coarse.matches) {
    window.addEventListener('pointermove', e => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  }

  const mo = new MutationObserver(mutations => {
    if (mutations.some(m => m.attributeName === 'data-theme')) draw(performance.now(), false);
  });
  mo.observe(document.documentElement, { attributes: true });

  reduceMotion.addEventListener?.('change', () => draw(performance.now(), false));
  document.addEventListener('visibilitychange', () => { last = performance.now(); });

  resize();
  if (!reduceMotion.matches) raf = requestAnimationFrame(loop);
  else draw(performance.now(), false);

  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();
