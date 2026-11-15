(function () {
  'use strict';

  var reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function scrollBehavior() {
    return reducedMotionQuery && reducedMotionQuery.matches ? 'auto' : 'smooth';
  }

  function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    menu.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('a') && isOpen()) {
        setOpen(false);
      }
    });

    if (window.matchMedia) {
      var desktopQuery = window.matchMedia('(min-width: 640px)');
      var onChange = function (event) {
        if (event.matches) setOpen(false);
      };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener('change', onChange);
      } else if (desktopQuery.addListener) {
        desktopQuery.addListener(onChange);
      }
    }
  }

  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (event) {
        var hash = link.getAttribute('href');
        if (!hash || hash.length < 2) return;
        var target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        if (window.history && typeof window.history.pushState === 'function') {
          window.history.pushState(null, '', hash);
        }
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  function initFaq() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.faq-button'));
    if (!buttons.length) return;

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        var panelId = button.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.hidden = expanded;
      });

      button.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowDown') next = buttons[(index + 1) % buttons.length];
        else if (event.key === 'ArrowUp') next = buttons[(index - 1 + buttons.length) % buttons.length];
        else if (event.key === 'Home') next = buttons[0];
        else if (event.key === 'End') next = buttons[buttons.length - 1];
        if (next) {
          event.preventDefault();
          next.focus();
        }
      });
    });
  }

  function initBackToTop() {
    var button = document.getElementById('back-to-top');
    if (!button) return;

    function update() {
      button.classList.toggle('hidden', !(window.scrollY > 400));
    }

    window.addEventListener('scroll', update, { passive: true });
    update();

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
      var focusTarget = document.getElementById('brand-link') || document.getElementById('top');
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    });
  }

  function init() {
    initNav();
    initSmoothScroll();
    initFaq();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
