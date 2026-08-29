(() => {
  'use strict';

  const emblem = document.getElementById('heroEmblem');
  if (!emblem) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    raf = 0;
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    emblem.style.setProperty('--tilt-x', `${currentY * -5.5}deg`);
    emblem.style.setProperty('--tilt-y', `${currentX * 6.5}deg`);
    emblem.style.setProperty('--shift-x', `${currentX * 8}px`);
    emblem.style.setProperty('--shift-y', `${currentY * 6}px`);

    if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
      raf = requestAnimationFrame(render);
    }
  };

  const queueRender = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  const onPointerMove = (event) => {
    if (reduceMotion.matches || !finePointer.matches) return;
    const rect = emblem.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    targetX = Math.max(-1, Math.min(1, (px - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, (py - 0.5) * 2));
    emblem.classList.add('is-interacting');
    queueRender();
  };

  const reset = () => {
    targetX = 0;
    targetY = 0;
    emblem.classList.remove('is-interacting');
    queueRender();
  };

  emblem.addEventListener('pointermove', onPointerMove, { passive: true });
  emblem.addEventListener('pointerleave', reset, { passive: true });
  emblem.addEventListener('pointercancel', reset, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
})();
