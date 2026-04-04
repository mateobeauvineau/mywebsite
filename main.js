/* ============================================================
   APEIRON ENERGIES — main.js
   Handles: Nav scroll, mobile menu, scroll animations,
            contact form validation, form success state
   ============================================================ */

'use strict';

// ===== NAVBAR SCROLL EFFECT =====
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();


// ===== MOBILE NAV TOGGLE =====
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('#nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // Prevent background scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click (mobile UX)
  menu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  var navbar = document.querySelector('.navbar');
})();


// ===== SCROLL ANIMATIONS (IntersectionObserver) =====
(function initScrollAnimations() {
  // Add fade-in class to key sections automatically
  var targets = document.querySelectorAll(
    '.problem-card, .feature-card, .pricing-card, .testimonial-card, ' +
    '.value-card, .team-card, .how-step, .fdetail-card, .contact-option, ' +
    '.gap-metric, .timeline-item, .section-header, .solution-copy, ' +
    '.origin-copy, .origin-quote, .seed-item'
  );

  targets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        // Stagger based on sibling index
        var siblings = Array.from(entry.target.parentElement.children);
        var idx = siblings.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 400));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();


// ===== CONTACT FORM VALIDATION + SUBMISSION =====
(function initContactForm() {
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form) return;

  // Simple validation rules
  var rules = {
    'first-name': { required: true, label: 'First name' },
    'last-name':  { required: true, label: 'Last name' },
    'email':      { required: true, email: true, label: 'Email address' },
    'message':    { required: true, label: 'Message' }
  };

  function validateField(id) {
    var input = form.querySelector('#' + id);
    var errorEl = form.querySelector('#' + id + '-error');
    if (!input || !errorEl) return true;

    var rule = rules[id];
    var val = input.value.trim();
    var msg = '';

    if (rule.required && !val) {
      msg = rule.label + ' is required.';
    } else if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    }

    errorEl.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    input.style.borderColor = msg ? 'var(--rose)' : '';
    return !msg;
  }

  // Validate on blur
  Object.keys(rules).forEach(function (id) {
    var input = form.querySelector('#' + id);
    if (input) {
      input.addEventListener('blur', function () { validateField(id); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') { validateField(id); }
      });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all
    var valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      // Focus first error
      var firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (replace with actual fetch/API call)
    var btn = form.querySelector('button[type="submit"]');
    var btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(function () {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1200);
  });
})();


// ===== SMOOTH ANCHOR SCROLL (fallback for older browsers) =====
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
})();
