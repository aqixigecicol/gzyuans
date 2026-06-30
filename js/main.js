/* ============================================
   gzyuans.com - Main JavaScript
   Core functionality
   ============================================ */

(function () {
  'use strict';

  // ===== DOM Ready =====
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeader();
    initMobileNav();
    initRevealAnimations();
    initSmoothAnchors();
    initActiveNavLink();
    initBackToTop();
    initCounters();
    initFormHandling();
    initLegalToc();
    initLegalTocScroll();
    initAccordion();
    initTabs();
    initNewsletter();
    initYear();
  }

  // ===== Header Scroll =====
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    function update() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  // ===== Mobile Navigation =====
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const list = document.querySelector('.nav-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', function () {
      const open = list.classList.toggle('open');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    list.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        list.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Reveal Animations (IntersectionObserver) =====
  function initRevealAnimations() {
    const items = document.querySelectorAll('.reveal, .stagger, .text-reveal, .text-reveal-line, .fade-scale, .mask-reveal, .hero-title-line, .accordion-item');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  // ===== Smooth Anchor Scrolling =====
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  // ===== Active Nav Link =====
  function initActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === path) link.classList.add('active');
    });
  }

  // ===== Back to Top Button =====
  function initBackToTop() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      document.body.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let ticking = false;
    function check() {
      if (window.scrollY > 600) btn.classList.add('show');
      else btn.classList.remove('show');
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(check); ticking = true; }
    }, { passive: true });
  }

  // ===== Counter Animations =====
  function initCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const animate = function (el) {
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = parseInt(el.getAttribute('data-duration') || '1800', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const start = performance.now();
      const startVal = 0;

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = startVal + (target - startVal) * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  // ===== Form Handling =====
  function initFormHandling() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const originalText = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Sending…';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = originalText;
            showToast('Message sent successfully. We will get back to you within 24 hours.');
            form.reset();
          }, 1200);
        }
      });
    });
  }

  // ===== Toast =====
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = '<div class="toast-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div class="toast-message"></div>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  // ===== Legal Table of Contents =====
  function initLegalToc() {
    const toc = document.querySelector('.legal-toc');
    if (!toc) return;
    const content = document.querySelector('.legal-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2[id]');
    if (!headings.length) return;

    // Already rendered server-side, but ensure links are clean
    toc.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ===== Legal TOC Scroll Spy =====
  function initLegalTocScroll() {
    const toc = document.querySelector('.legal-toc');
    if (!toc) return;
    const links = toc.querySelectorAll('a');
    if (!links.length) return;

    const headings = Array.from(links).map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    if (!headings.length) return;

    function update() {
      const scrollY = window.scrollY + 120;
      let activeIndex = 0;
      for (let i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop <= scrollY) activeIndex = i;
      }
      links.forEach(function (a) { a.classList.remove('active'); });
      if (links[activeIndex]) links[activeIndex].classList.add('active');
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ===== Accordion (FAQ) =====
  function initAccordion() {
    document.querySelectorAll('.accordion-item').forEach(function (item) {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        // close all
        item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
          i.classList.remove('open');
          const c = i.querySelector('.accordion-content');
          if (c) c.style.maxHeight = null;
          const t = i.querySelector('.accordion-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          const content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ===== Tabs =====
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      const buttons = group.querySelectorAll('.tab-button');
      const panes = group.querySelectorAll('.tab-pane');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-tab');
          buttons.forEach(function (b) { b.classList.remove('active'); });
          panes.forEach(function (p) { p.classList.remove('active'); });
          btn.classList.add('active');
          const target = group.querySelector('.tab-pane[data-tab="' + id + '"]');
          if (target) target.classList.add('active');
        });
      });
    });
  }

  // ===== Newsletter =====
  function initNewsletter() {
    document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !input.value) return;
        showToast('Thank you for subscribing to our updates.');
        form.reset();
      });
    });
  }

  // ===== Current Year =====
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // Expose for global use
  window.gzyuans = {
    showToast: showToast,
    init: init
  };
})();
