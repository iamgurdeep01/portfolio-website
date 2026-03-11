/* ============================================================
   GURDEEP SINGH — PORTFOLIO WEBSITE
   Main JavaScript — scroll reveals, typing, nav, form, theme
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. THEME TOGGLE (dark / light)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Load saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon(next);
    });
  }

  /* ==========================================================
     2. NAVBAR — scroll style + active link highlight
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Add "scrolled" class when scrolled past 60px
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }

    // Highlight active nav link
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  /* ==========================================================
     3. MOBILE NAVIGATION
     ========================================================== */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  let overlay = null;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeNav);
  }

  function openNav() {
    if (!navMenu) return;
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    createOverlay();
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeNav() : openNav();
    });
  }

  // Close menu when a nav link is clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ==========================================================
     4. SMOOTH SCROLL for in-page links
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(root).getPropertyValue('--nav-height')) || 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ==========================================================
     5. SCROLL REVEAL (Intersection Observer)
     ========================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback — show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================================
     6. TYPING ANIMATION (hero headline)
     ========================================================== */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const strings = [
      'Office Admin',
      'Case Worker',
      'Computer System Technician',
      'Security Team Lead',
      'Operations Coordinator'
    ];
    let sIdx = 0;
    let cIdx = 0;
    let deleting = false;

    function tick() {
      const current = strings[sIdx];
      typedEl.textContent = deleting
        ? current.substring(0, --cIdx)
        : current.substring(0, ++cIdx);

      let speed = deleting ? 35 : 75;
      if (!deleting && cIdx === current.length) { speed = 2200; deleting = true; }
      else if (deleting && cIdx === 0) { deleting = false; sIdx = (sIdx + 1) % strings.length; speed = 400; }

      setTimeout(tick, speed);
    }

    setTimeout(tick, 900);
  }

  /* ==========================================================
     7. CONTACT FORM — client-side validation + mailto fallback
     ========================================================== */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', e => {
      // Clear previous errors
      clearErrors();

      const name = val('contactName');
      const email = val('contactEmail');
      const message = val('contactMessage');
      let valid = true;

      if (!name) { showError('nameError', 'Please enter your name.'); valid = false; }
      if (!email) { showError('emailError', 'Please enter your email.'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('emailError', 'Enter a valid email address.'); valid = false; }
      if (!message) { showError('messageError', 'Please write a message.'); valid = false; }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // If valid, let the default mailto: action proceed
      // Show a success message
      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = 'Opening your email client — thanks for reaching out!';
          statusEl.className = 'form-status success';
        }
      }, 500);
    });
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrors() {
    ['nameError', 'emailError', 'messageError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    if (statusEl) { statusEl.textContent = ''; statusEl.className = 'form-status'; }
  }
});