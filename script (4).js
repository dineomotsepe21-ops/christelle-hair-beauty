/* =========================================================================
   CHRISTELLE HAIR BEAUTY — SCRIPT.JS
   Handles: navigation, hero slideshow, scroll reveal, gallery + lightbox,
   booking form validation/security, contact helpers, back-to-top.
   All code is defensive: every DOM lookup is checked before use so the
   script never throws if a section is edited or removed later.
   ========================================================================= */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     1. NAVIGATION — mobile menu toggle + scrolled header shadow + active link
     ---------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu whenever a link is chosen
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    // Close on Escape for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  window.addEventListener('scroll', () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ----------------------------------------------------------------------
     2. HERO SLIDESHOW — simple cross-fade carousel, pauses off-screen
     ---------------------------------------------------------------------- */
  const slideshow = document.getElementById('heroSlideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    let current = 0;
    if (slides.length > 1) {
      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 3800);
    }
  }

  /* ----------------------------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver fades sections in as they enter
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: no observer support — just show everything
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ----------------------------------------------------------------------
     4. GALLERY — data-driven rendering, category filtering, lightbox viewer
     ---------------------------------------------------------------------- */

  // Placeholder image data — swap `src` values for real salon photography.
  // Each id maps to a placehold.co image so the layout is ready to preview.
  const galleryItems = [
    { category: 'knotless',   title: 'Knotless Braids — Waist Length',  color: 'F4C9D2/4A2C2A' },
    { category: 'knotless',   title: 'Knotless Braids — Shoulder',      color: 'E9D6C6/4A2C2A' },
    { category: 'boho',       title: 'Boho Braids with Curly Ends',     color: 'D88A9A/FFFFFF' },
    { category: 'boho',       title: 'Boho Braids — Knee Length',       color: 'C9A15E/FFFFFF' },
    { category: 'twists',     title: 'Island Twists — Glossy Finish',   color: 'F4C9D2/4A2C2A' },
    { category: 'twists',     title: 'Marley Twists — Full Volume',     color: 'E9D6C6/4A2C2A' },
    { category: 'locs',       title: 'Butterfly Locs — Distressed',     color: 'D88A9A/FFFFFF' },
    { category: 'locs',       title: 'Invisible Locs — Natural Root',   color: 'C9A15E/FFFFFF' },
    { category: 'cornrows',   title: 'Freehand Cornrow Design',         color: 'F4C9D2/4A2C2A' },
    { category: 'cornrows',   title: 'Fulani Braids with Beads',        color: 'E9D6C6/4A2C2A' },
    { category: 'protective', title: 'Straight Back Style',             color: 'D88A9A/FFFFFF' },
    { category: 'protective', title: 'Mini Twists — Protective Set',    color: 'C9A15E/FFFFFF' },
    { category: 'nails',      title: 'Nail Art — Glam Set',             color: 'F4C9D2/4A2C2A' },
    { category: 'nails',      title: 'Nails — Classic French',          color: 'E9D6C6/4A2C2A' },
    { category: 'lashes',     title: 'Eyelash Extensions — Natural',    color: 'D88A9A/FFFFFF' },
    { category: 'lashes',     title: 'Eyelash Extensions — Glam',       color: 'C9A15E/FFFFFF' }
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Escape any string before it touches innerHTML — defends against XSS
  // if this data source is ever swapped for user- or CMS-supplied content.
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function renderGallery() {
    if (!galleryGrid) return;
    const frag = document.createDocumentFragment();

    galleryItems.forEach((item, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.setAttribute('data-category', item.category);
      figure.setAttribute('data-index', String(index));
      figure.setAttribute('tabindex', '0');
      figure.setAttribute('role', 'button');
      figure.setAttribute('aria-label', 'View larger image: ' + item.title);

      const img = document.createElement('img');
      img.src = 'https://placehold.co/500x625/' + item.color + '?text=' + encodeURIComponent(item.title.split(' ')[0] + '+' + (item.title.split(' ')[1] || ''));
      img.alt = item.title;
      img.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.className = 'gi-caption';
      caption.textContent = item.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      frag.appendChild(figure);
    });

    galleryGrid.innerHTML = '';
    galleryGrid.appendChild(frag);
    attachGalleryEvents();
  }

  function attachGalleryEvents() {
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item) => {
      item.addEventListener('click', () => openLightbox(Number(item.dataset.index)));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(Number(item.dataset.index));
        }
      });
    });
  }

  function filterGallery(category) {
    if (!galleryGrid) return;
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item) => {
      const match = category === 'all' || item.dataset.category === category;
      item.classList.toggle('hidden-item', !match);
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      filterGallery(btn.dataset.filter);
    });
  });

  /* ---- Lightbox viewer ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxIndex = 0;
  let lastFocusedEl = null;

  function openLightbox(index) {
    if (!lightbox || !galleryGrid) return;
    const visibleItems = Array.from(galleryGrid.querySelectorAll('.gallery-item:not(.hidden-item)'));
    if (!visibleItems.length) return;

    // Keep the index within the currently-visible (filtered) set
    lightboxIndex = visibleItems.findIndex((el) => Number(el.dataset.index) === index);
    if (lightboxIndex === -1) lightboxIndex = 0;

    lastFocusedEl = document.activeElement;
    showLightboxItem(visibleItems);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function showLightboxItem(visibleItems) {
    const el = visibleItems[lightboxIndex];
    if (!el) return;
    const img = el.querySelector('img');
    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (lightboxCaption) lightboxCaption.textContent = img ? img.alt : '';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function stepLightbox(delta) {
    if (!galleryGrid) return;
    const visibleItems = Array.from(galleryGrid.querySelectorAll('.gallery-item:not(.hidden-item)'));
    if (!visibleItems.length) return;
    lightboxIndex = (lightboxIndex + delta + visibleItems.length) % visibleItems.length;
    showLightboxItem(visibleItems);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => stepLightbox(1));
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  renderGallery();

  /* ----------------------------------------------------------------------
     5. BOOKING FORM — validation, sanitisation & spam protection
     ---------------------------------------------------------------------- */
  const form = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const clearBtn = document.getElementById('clearBtn');
  const formStatus = document.getElementById('formStatus');
  let isSubmitting = false; // guards against rapid double-submits

  // Set the date input's minimum to today so past dates cannot be chosen
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // South African phone numbers: 0XXXXXXXXX or +27XXXXXXXXX (mobile prefixes 6-8)
  const PHONE_REGEX = /^(\+27|0)[6-8][0-9]{8}$/;
  // Standard, pragmatic email pattern
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById('err-' + fieldId);
    if (field) field.classList.toggle('invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  // Strips characters that could be used for basic HTML/script injection
  // before any user input is echoed back into the page.
  function sanitizeInput(value) {
    return String(value)
      .replace(/[<>]/g, '')   // strip angle brackets
      .replace(/javascript:/gi, '')
      .trim();
  }

  function validateForm(data) {
    let valid = true;

    if (!data.fullName || data.fullName.trim().length < 2) {
      setFieldError('fullName', 'Please enter your full name.');
      valid = false;
    } else { setFieldError('fullName', ''); }

    if (!PHONE_REGEX.test(data.phone.trim())) {
      setFieldError('phone', 'Enter a valid SA phone number, e.g. 0782191293.');
      valid = false;
    } else { setFieldError('phone', ''); }

    if (!EMAIL_REGEX.test(data.email.trim())) {
      setFieldError('email', 'Enter a valid email address.');
      valid = false;
    } else { setFieldError('email', ''); }

    if (!data.service) {
      setFieldError('service', 'Please select a service.');
      valid = false;
    } else { setFieldError('service', ''); }

    if (!data.date) {
      setFieldError('date', 'Please choose a preferred date.');
      valid = false;
    } else {
      const chosen = new Date(data.date + 'T00:00:00');
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (chosen < now) {
        setFieldError('date', 'Please choose a future date.');
        valid = false;
      } else { setFieldError('date', ''); }
    }

    if (!data.time) {
      setFieldError('time', 'Please choose a preferred time.');
      valid = false;
    } else { setFieldError('time', ''); }

    // Honeypot: if this hidden field has any value, silently treat as spam
    if (data.website) {
      valid = false;
    }

    // CAPTCHA placeholder check
    const captcha = document.getElementById('captchaCheck');
    if (captcha && !captcha.checked) {
      setFieldError('captcha', 'Please confirm you are not a robot.');
      valid = false;
    } else { setFieldError('captcha', ''); }

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (isSubmitting) return; // block rapid repeat submissions

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => { data[key] = sanitizeInput(value); });

      if (!validateForm(data)) {
        if (formStatus) {
          formStatus.textContent = 'Please correct the highlighted fields and try again.';
          formStatus.className = 'form-status error';
        }
        return;
      }

      isSubmitting = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Booking…'; }
      if (formStatus) { formStatus.textContent = 'Sending your request…'; formStatus.className = 'form-status'; }

      // NOTE: There is no backend wired up yet. This simulates a network
      // request so the UI is ready to connect to a real booking API —
      // replace this timeout with an actual fetch() POST call when a
      // secure backend endpoint is available.
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = 'Thank you, ' + data.fullName + '! Your appointment request has been received — we will confirm shortly by phone or email.';
          formStatus.className = 'form-status success';
        }
        form.reset();
        isSubmitting = false;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Book Appointment'; }
      }, 1200);
    });
  }

  if (clearBtn && form) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      ['fullName', 'phone', 'email', 'service', 'date', 'time', 'captcha'].forEach((id) => setFieldError(id, ''));
      if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }
    });
  }

  /* ----------------------------------------------------------------------
     6. BACK TO TOP BUTTON
     ---------------------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.hidden = window.scrollY < 500;
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     7. FOOTER YEAR
     ---------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
