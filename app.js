
// ===============================
//   MENÚ DESPLEGABLE MÓVIL
// ===============================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});


// ===============================
// ANIMACIÓN TARJETAS (HOVER)
// ===============================
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.05)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
  });
});
/* ========= Añadir: redirigir al formulario con datos ========= */
document.addEventListener('DOMContentLoaded', () => {
  // delegación para botones "Añadir" (en menu.html)
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    // leer atributos
    const id = btn.dataset.id || '';
    const name = btn.dataset.name || btn.closest('.card')?.querySelector('h3')?.textContent || '';
    const price = btn.closest('.card')?.querySelector('.price')?.textContent || '';

    // animación pulse rápida
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 420);

    // mostrar toast rápido
    showToast(`Agregaste: ${name}`);

    // redirigir a contacto con params (espera 450ms para que se vea la animación)
    setTimeout(() => {
      // codificar params
      const params = new URLSearchParams();
      if (id) params.set('id', id);
      if (name) params.set('item', name);
      if (price) params.set('price', price);
      // opcional: quantity default 1
      params.set('qty', '1');

      window.location.href = `contacto.html?${params.toString()}`;
    }, 450);
  });

  // helper: toast (crea si no existe)
  function showToast(text, timeout = 1800) {
    let t = document.getElementById('simpleToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'simpleToast';
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(t._hide);
    t._hide = setTimeout(() => t.classList.remove('show'), timeout);
  }

  /* ===== Entrance animation para cards via IntersectionObserver ===== */
  const cards = document.querySelectorAll('.card');
  if ('IntersectionObserver' in window && cards.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(c => obs.observe(c));
  } else {
    // fallback: mostrar todas
    cards.forEach(c => c.classList.add('in-view'));
  }
});
// ===== Prefill formulario si venís desde "Añadir" (leer query params) =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item');
  const price = params.get('price');
  const qty = params.get('qty');

  if (item || price) {
    // buscar formulario 
    const form = document.querySelector('.formulario') || document.getElementById('contactForm');
    if (form) {
      // si existe un textarea de pedido, rellenarlo. Si no existe, crear uno temporal arriba.
      let textarea = form.querySelector('textarea[name="message"], textarea#message, textarea');
      if (!textarea) {
        textarea = document.createElement('textarea');
        textarea.name = 'message';
        textarea.rows = 4;
        form.appendChild(textarea);
      }
      const pedidoText = `Pedido: ${item || ''}${price ? ' — ' + price : ''}${qty ? ' (x'+qty+')' : ''}`;
      textarea.value = pedidoText;

      // si hay campos nombre/telefono vacíos, ponemos focus en nombre
      const nombre = form.querySelector('input[name="name"], input#name, input[type="text"]');
      if (nombre) nombre.focus();

      // hacemos scroll suave al formulario
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});
