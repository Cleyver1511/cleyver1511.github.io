// ══════════════════════════════════════
//  CURSOR PERSONALIZADO
// ══════════════════════════════════════
const cursor     = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

if (cursor && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .stat-box, .hab-card, .proy-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '14px';
      cursor.style.height = '14px';
      cursorRing.style.width  = '54px';
      cursorRing.style.height = '54px';
      cursorRing.style.borderColor = 'rgba(56,189,248,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '8px';
      cursor.style.height = '8px';
      cursorRing.style.width  = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.borderColor = 'rgba(56,189,248,0.4)';
    });
  });
}

// ══════════════════════════════════════
//  TILT EN CARDS (efecto 3D suave)
// ══════════════════════════════════════
document.querySelectorAll('.hab-card, .stat-box').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ══════════════════════════════════════
//  NAVEGACIÓN POR PESTAÑAS (escritorio)
// ══════════════════════════════════════
function navegarA(pagina) {
  if (!pagina) return;
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  const target = document.getElementById(pagina);
  if (target) {
    target.style.display = 'flex';
    // Forzar reflow para que la animación arranque
    target.offsetHeight;
    target.classList.add('active');
  }
  document.querySelectorAll('.nav-tabs a, .menu-movil-link').forEach(a => a.classList.remove('active'));
  document.querySelectorAll(`[data-page="${pagina}"]`).forEach(a => a.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-tabs a, .btn-primary, .btn-outline').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navegarA(this.getAttribute('data-page'));
  });
});

// ══════════════════════════════════════
//  MENÚ HAMBURGUESA
// ══════════════════════════════════════
const hamburguesa = document.getElementById('hamburguesa');
const menuMovil   = document.getElementById('menu-movil');

hamburguesa.addEventListener('click', () => {
  hamburguesa.classList.toggle('abierto');
  menuMovil.classList.toggle('abierto');
});

// ══════════════════════════════════════
//  NAVEGACIÓN MENÚ MÓVIL
// ══════════════════════════════════════
document.querySelectorAll('.menu-movil-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    navegarA(this.getAttribute('data-page'));
    hamburguesa.classList.remove('abierto');
    menuMovil.classList.remove('abierto');
  });
});

// ══════════════════════════════════════
//  ANIMACIONES DE ENTRADA (Intersection Observer)
// ══════════════════════════════════════
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOpts);

function prepareAnimations() {
  document.querySelectorAll('.proy-card, .cert-card, .hab-card, .stat-box, .dato-fila, .contacto-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });
}
prepareAnimations();

// ══════════════════════════════════════
//  CONTADOR ANIMADO EN STATS
// ══════════════════════════════════════
function animarContador(el, destino, duracion = 1200) {
  const esTexto = isNaN(parseInt(destino));
  if (esTexto) return;
  const num = parseInt(destino);
  const inicio = performance.now();
  (function tick(now) {
    const t = Math.min((now - inicio) / duracion, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * num);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = destino;
  })(performance.now());
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statN = entry.target.querySelector('.stat-n');
      if (statN) animarContador(statN, statN.textContent.trim());
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box').forEach(el => statsObserver.observe(el));