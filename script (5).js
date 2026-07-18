/* =============================================================
   CHRISTELLE HAIR BEAUTY — SCRIPT
   Vanilla JS. No inline handlers. No innerHTML with user input.
   ============================================================= */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothAnchors();
  renderServices();
  renderGallery();
  renderPricing();
  initScrollReveal();
  initScrollTop();
  initBookingForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* -------------------------------------------------------------
   Helper: safely create an element with text + class
   ------------------------------------------------------------- */
function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text) node.textContent = opts.text;
  if (opts.html !== undefined) node.textContent = opts.html; // never trust HTML; always text
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }
  return node;
}

/* -------------------------------------------------------------
   Header scroll state + active shadow
   ------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------
   Mobile menu toggle
   ------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* -------------------------------------------------------------
   Smooth scroll for in-page anchors (native scroll-behavior is set
   in CSS; this just accounts for the fixed header offset)
   ------------------------------------------------------------- */
function initSmoothAnchors() {
  const header = document.getElementById('siteHeader');
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* -------------------------------------------------------------
   Data: services
   ------------------------------------------------------------- */
const HAIR_SERVICES = [
  { icon: '🪢', name: 'Knotless Braids', desc: 'Sleek, tension-free braids for a natural, comfortable finish.' },
  { icon: '🌸', name: 'Boho Braids', desc: 'Effortless bohemian texture with soft, curly accents.' },
  { icon: '🌀', name: 'Island Twists', desc: 'Defined, glossy twists inspired by island style.' },
  { icon: '🧵', name: 'Knotless Twists', desc: 'Lightweight twists with a smooth, natural root.' },
  { icon: '🖤', name: 'Invisible Locs', desc: 'Seamless, natural-looking loc extensions.' },
  { icon: '✋', name: 'Freehand Cornrows', desc: 'Precision hand-parted cornrows in any pattern.' },
  { icon: '👑', name: 'Fulani Braids', desc: 'Traditional Fulani design with beaded accents.' },
  { icon: '🦋', name: 'Butterfly Locs', desc: 'Voluminous distressed locs with a soft, romantic texture.' },
  { icon: '✨', name: 'Mini Twists', desc: 'Delicate, long-lasting twists for versatile styling.' },
  { icon: '🌿', name: 'Marley Twists', desc: 'Textured, full-bodied twists with natural movement.' },
  { icon: '💫', name: 'Straight Back/Up', desc: 'Classic sleek styles, straight back or up.' },
];

const BEAUTY_SERVICES = [
  { icon: '💅', name: 'Nail Services', desc: 'Manicures, nail art and long-lasting finishes.' },
  { icon: '👁️', name: 'Eyelash Services', desc: 'Natural to glam lash treatments for every occasion.' },
];

function buildServiceCard(service) {
  const card = el('div', { class: 'service-card' });
  card.setAttribute('data-reveal-child', '');

  const icon = el('div', { class: 'service-icon' });
  icon.textContent = service.icon;

  const title = el('h4', { text: service.name });
  const desc = el('p', { text: service.desc });

  card.append(icon, title, desc);
  return card;
}

function renderServices() {
  const hairGrid = document.getElementById('hairServicesGrid');
  const beautyGrid = document.getElementById('beautyServicesGrid');

  HAIR_SERVICES.forEach((s) => hairGrid.appendChild(buildServiceCard(s)));
  BEAUTY_SERVICES.forEach((s) => beautyGrid.appendChild(buildServiceCard(s)));
}

/* -------------------------------------------------------------
   Data: gallery
   ------------------------------------------------------------- */
const GALLERY_ITEMS = [
  { name: 'Knotless Braids', category: 'Hair' },
  { name: 'Boho Braids', category: 'Hair' },
  { name: 'Twists', category: 'Hair' },
  { name: 'Locs', category: 'Hair' },
  { name: 'Cornrows', category: 'Hair' },
  { name: 'Nails', category: 'Beauty' },
  { name: 'Eyelashes', category: 'Beauty' },
];

function buildGalleryItem(item) {
  const wrap = el('div', { class: 'gallery-item' });
  wrap.setAttribute('data-reveal-child', '');

  const placeholder = el('div', { class: 'image-placeholder' });
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', `Placeholder photo for ${item.name}`);

  const icon = el('span', { class: 'placeholder-icon-sm', text: '📷' });
  const label = el('span', { class: 'placeholder-label', text: `${item.name} — photo coming soon` });
  placeholder.append(icon, label);

  const caption = el('div', { class: 'gallery-caption' });
  const strong = el('strong', { text: item.name });
  const span = el('span', { text: item.category });
  caption.append(strong, span);

  wrap.append(placeholder, caption);
  return wrap;
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  GALLERY_ITEMS.forEach((item) => grid.appendChild(buildGalleryItem(item)));
}

/* -------------------------------------------------------------
   Data: pricing
   ------------------------------------------------------------- */
const LENGTH_PRICE_TABLES = [
  {
    title: 'Knotless Braids',
    rows: [
      ['Shoulder Length', 'R260'],
      ['Waist Length', 'R285'],
      ['Bum Length', 'R320'],
      ['Knee Length', 'R365'],
    ],
  },
  {
    title: 'Boho Braids',
    rows: [
      ['Shoulder Length', 'R290'],
      ['Waist Length', 'R340'],
      ['Bum Length', 'R395'],
      ['Knee Length', 'R520'],
    ],
  },
  {
    title: 'Island Twists',
    rows: [
      ['Shoulder Length', 'R290'],
      ['Waist Length', 'R340'],
      ['Bum Length', 'R395'],
      ['Knee Length', 'R520'],
    ],
  },
  {
    title: 'Knotless Twists',
    rows: [
      ['Shoulder Length', 'R260'],
      ['Waist Length', 'R285'],
      ['Bum Length', 'R320'],
      ['Knee Length', 'R365'],
    ],
  },
  {
    title: 'Invisible Locs',
    rows: [
      ['Shoulder Length', 'R260'],
      ['Waist Length', 'R285'],
      ['Bum Length', 'R325'],
      ['Knee Length', 'R395'],
    ],
  },
];

const OTHER_HAIRSTYLES = [
  ['Freehand Cornrows', 'R120'],
  ['Fulani Braids', 'R370'],
  ['Butterfly Locs', 'R320 – R570'],
  ['Mini Twists', 'R320'],
  ['Marley Twists', 'R270 – R470'],
  ['Straight Back/Up', 'R270 – R420'],
];

function buildPriceCard(tableData, wide = false) {
  const card = el('div', { class: wide ? 'price-card price-card--wide' : 'price-card' });
  const title = el('h3', { text: tableData.title });
  card.appendChild(title);

  const list = el('div', { class: wide ? 'price-list-flex' : '' });

  tableData.rows.forEach(([label, price]) => {
    const row = el('div', { class: 'price-row' });
    const l = el('span', { class: 'p-label', text: label });
    const v = el('span', { class: 'p-value', text: price });
    row.append(l, v);
    list.appendChild(row);
  });

  card.appendChild(list);
  return card;
}

function renderPricing() {
  const grid = document.getElementById('pricingGrid');

  LENGTH_PRICE_TABLES.forEach((table) => {
    grid.appendChild(buildPriceCard(table));
  });

  grid.appendChild(
    buildPriceCard({ title: 'Other Hairstyles', rows: OTHER_HAIRSTYLES }, true)
  );
}

/* -------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   ------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-child]');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = entry.target.hasAttribute('data-reveal-child')
            ? Math.min((index % 6) * 70, 350)
            : 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((t) => observer.observe(t));
}

/* -------------------------------------------------------------
   Scroll-to-top button
   ------------------------------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 500) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    },
    { passive: true }
  );
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------
   Booking form: validation + safe submission handling
   ------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('err-fullName'),
      validate: (v) => {
        const value = v.trim();
        if (!value) return 'Please enter your full name.';
        if (value.length < 2) return 'Please enter a valid name.';
        if (!/^[a-zA-Z\u00C0-\u024F\s'-]+$/.test(value)) return 'Name contains invalid characters.';
        return '';
      },
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('err-phone'),
      validate: (v) => {
        const value = v.trim();
        if (!value) return 'Please enter your phone number.';
        const digitsOnly = value.replace(/[\s-]/g, '');
        if (!/^(0\d{9}|\+27\d{9})$/.test(digitsOnly)) {
          return 'Enter a valid South African phone number (e.g. 0821234567).';
        }
        return '';
      },
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('err-email'),
      validate: (v) => {
        const value = v.trim();
        if (!value) return 'Please enter your email address.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) return 'Enter a valid email address.';
        return '';
      },
    },
    serviceType: {
      input: document.getElementById('serviceType'),
      error: document.getElementById('err-serviceType'),
      validate: (v) => (!v ? 'Please select a service.' : ''),
    },
    prefDate: {
      input: document.getElementById('prefDate'),
      error: document.getElementById('err-prefDate'),
      validate: (v) => {
        if (!v) return 'Please choose a preferred date.';
        const chosen = new Date(v + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen < today) return 'Date cannot be in the past.';
        return '';
      },
    },
    prefTime: {
      input: document.getElementById('prefTime'),
      error: document.getElementById('err-prefTime'),
      validate: (v) => (!v ? 'Please choose a preferred time.' : ''),
    },
  };

  Object.values(fields).forEach(({ input }) => {
    input.addEventListener('blur', () => validateField(input.id));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) validateField(input.id);
    });
  });

  function validateField(id) {
    const field = fields[id];
    if (!field) return true;
    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.classList.toggle('is-invalid', Boolean(message));
    return !message;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(fields).forEach((id) => {
      const valid = validateField(id);
      if (!valid) allValid = false;
    });
    return allValid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const isValid = validateAll();

    if (!isValid) {
      statusEl.textContent = 'Please correct the highlighted fields before submitting.';
      statusEl.className = 'form-status is-error';
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Collect sanitised (trimmed) form data — ready to connect to a
    // backend endpoint or WhatsApp deep link in future.
    const bookingData = {
      fullName: fields.fullName.input.value.trim(),
      phone: fields.phone.input.value.trim(),
      email: fields.email.input.value.trim(),
      serviceType: fields.serviceType.input.value,
      hairstyle: document.getElementById('hairstyle').value,
      prefDate: fields.prefDate.input.value,
      prefTime: fields.prefTime.input.value,
      notes: document.getElementById('notes').value.trim().slice(0, 300),
    };

    // Placeholder for future integration (e.g. fetch() to a booking
    // API or a WhatsApp click-to-chat link). Kept client-side only
    // for now — no data leaves the browser.
    console.log('Booking submitted:', bookingData);

    statusEl.textContent = `Thank you, ${bookingData.fullName.split(' ')[0]}! Your booking request has been received. We'll contact you shortly to confirm.`;
    statusEl.className = 'form-status is-success';

    form.reset();
    Object.values(fields).forEach(({ input, error }) => {
      input.classList.remove('is-invalid');
      error.textContent = '';
    });
  });
}
