/* Anderson Schultz Ribeiro — Portfolio JS | Executive Edition */
'use strict';

/* Navbar */
(() => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* Mobile navigation */
(() => {
  const btn = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!btn || !mobileNav) return;
  btn.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
})();

/* Subtle background network */
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, particles = [];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const count = Math.min(44, Math.max(20, Math.floor((W * H) / 32000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .16,
      vy: (Math.random() - .5) * .16,
      r: Math.random() * 1.15 + .35,
      a: Math.random() * .22 + .05
    }));
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(142, 185, 205, ${p.a})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 15000) {
          const alpha = (1 - Math.sqrt(d2) / 122) * .045;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(142, 185, 205, ${Math.max(alpha, 0)})`;
          ctx.lineWidth = .55;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  };
  loop();
})();

/* Scroll reveal */
(() => {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
})();

/* Counters */
(() => {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const animate = el => {
    const target = Number.parseInt(el.dataset.target || '0', 10);
    const start = performance.now();
    const duration = 1200;
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => observer.observe(c));
})();

/* Smooth anchor navigation */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const selector = a.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Skill bars */
(() => {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = `${entry.target.dataset.width || 0}%`;
      observer.unobserve(entry.target);
    });
  }, { threshold: .25 });
  fills.forEach(f => observer.observe(f));
})();

/* Contact form — FormSubmit */
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = document.getElementById('form-message');
  const submitBtn = form.querySelector('.form-submit');
  const submitSubject = document.getElementById('form-submit-subject');
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
  };
  const defaultButton = submitBtn ? submitBtn.innerHTML : 'Enviar mensagem';
  const defaultSubject = 'Nova mensagem pelo portfólio — Anderson Schultz Ribeiro';

  const show = (type, text) => {
    if (!msg) return;
    msg.style.display = 'block';
    msg.className = type;
    msg.textContent = text;
  };
  const hide = () => {
    if (!msg) return;
    msg.style.display = 'none';
    msg.className = '';
    msg.textContent = '';
  };
  const setLoading = value => {
    if (!submitBtn) return;
    submitBtn.disabled = value;
    submitBtn.setAttribute('aria-busy', value ? 'true' : 'false');
    submitBtn.innerHTML = value ? 'Enviando...' : defaultButton;
  };
  const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());
  const invalidate = (field, text) => {
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus({ preventScroll: false });
    }
    show('error', text);
    return false;
  };
  const validate = () => {
    Object.values(fields).forEach(f => f && f.removeAttribute('aria-invalid'));
    if (!fields.name?.value.trim()) return invalidate(fields.name, 'Por favor, informe seu nome.');
    if (!fields.email?.value.trim()) return invalidate(fields.email, 'Por favor, informe seu e-mail.');
    if (!validEmail(fields.email.value)) return invalidate(fields.email, 'Por favor, informe um e-mail válido.');
    if (!fields.subject?.value.trim()) return invalidate(fields.subject, 'Por favor, informe o assunto da mensagem.');
    if (!fields.message?.value.trim()) return invalidate(fields.message, 'Por favor, escreva sua mensagem.');
    return true;
  };

  Object.values(fields).forEach(field => field?.addEventListener('input', () => {
    field.removeAttribute('aria-invalid');
    hide();
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;
    const endpoint = form.dataset.endpoint || 'https://formsubmit.co/ajax/anderson.schultz@me.com';
    if (submitSubject) submitSubject.value = `Portfólio — ${fields.subject.value.trim()}`;
    try {
      setLoading(true);
      show('info', 'Enviando sua mensagem...');
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Falha no envio');
      show('success', 'Mensagem enviada com sucesso. Retornarei o contato em breve.');
      form.reset();
      if (submitSubject) submitSubject.value = defaultSubject;
    } catch (_) {
      show('error', 'Não foi possível enviar agora. Você também pode entrar em contato por e-mail, LinkedIn ou WhatsApp.');
    } finally {
      setLoading(false);
    }
  });
})();


/* Certificate & project image preview / full-size viewer */
(() => {
  const images = Array.from(document.querySelectorAll('.cert-img-wrap img, .proj-img-wrap img'));
  if (!images.length) return;

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let hoverPreview = null;
  let hoverImg = null;

  if (canHover) {
    hoverPreview = document.createElement('div');
    hoverPreview.className = 'media-hover-preview';
    hoverPreview.setAttribute('aria-hidden', 'true');
    hoverImg = document.createElement('img');
    hoverImg.alt = '';
    hoverPreview.appendChild(hoverImg);
    document.body.appendChild(hoverPreview);
  }

  const lightbox = document.createElement('div');
  lightbox.className = 'media-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Visualizador de imagem em tamanho real');
  lightbox.innerHTML = `
    <div class="media-lightbox-topbar">
      <button class="media-lightbox-back" type="button" aria-label="Voltar para a página">← <span>Voltar</span></button>
      <div class="media-lightbox-caption"></div>
    </div>
    <div class="media-lightbox-stage">
      <img class="media-lightbox-image" alt="" />
    </div>`;
  document.body.appendChild(lightbox);

  const backBtn = lightbox.querySelector('.media-lightbox-back');
  const stage = lightbox.querySelector('.media-lightbox-stage');
  const fullImg = lightbox.querySelector('.media-lightbox-image');
  const caption = lightbox.querySelector('.media-lightbox-caption');
  let lastFocused = null;

  const positionPreview = (event) => {
    if (!hoverPreview) return;
    const pad = 18;
    const rect = hoverPreview.getBoundingClientRect();
    let left = event.clientX + 22;
    let top = event.clientY + 18;
    if (left + rect.width > window.innerWidth - pad) left = event.clientX - rect.width - 22;
    if (top + rect.height > window.innerHeight - pad) top = window.innerHeight - rect.height - pad;
    if (top < pad) top = pad;
    hoverPreview.style.left = `${Math.max(pad, left)}px`;
    hoverPreview.style.top = `${top}px`;
  };

  const hidePreview = () => hoverPreview?.classList.remove('visible');

  const openLightbox = (img) => {
    hidePreview();
    lastFocused = document.activeElement;
    fullImg.src = img.currentSrc || img.src;
    fullImg.alt = img.alt || 'Imagem ampliada';
    caption.textContent = img.alt || 'Imagem em tamanho real';
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
    lightbox.classList.add('open');
    document.body.classList.add('media-lightbox-open');
    backBtn.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.classList.remove('media-lightbox-open');
    fullImg.removeAttribute('src');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  };

  images.forEach(img => {
    img.classList.add('media-viewer-trigger');
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${img.alt || 'Imagem'} — abrir em tamanho real`);

    if (canHover) {
      img.addEventListener('mouseenter', event => {
        hoverImg.src = img.currentSrc || img.src;
        hoverImg.alt = '';
        hoverPreview.classList.add('visible');
        requestAnimationFrame(() => positionPreview(event));
      });
      img.addEventListener('mousemove', positionPreview);
      img.addEventListener('mouseleave', hidePreview);
    }

    img.addEventListener('click', event => {
      event.preventDefault();
      openLightbox(img);
    });
    img.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  backBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox || event.target === stage) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
