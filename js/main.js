(() => {
  'use strict';

  // Header scroll effect
  const header = document.getElementById('header');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  // Portfolio filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(.95)';
        setTimeout(() => {
          item.style.display = show ? '' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity .3s ease, transform .3s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 150);
      });
    });
  });

  // Intersection Observer — fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll(
    '.service-card, .adv-card, .portfolio-item, .process-step, .contact-item, .about__num'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Number counter animation
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.num-counter').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };

    requestAnimationFrame(tick);
  }

  // Phone mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
      if (val.length === 0) { e.target.value = ''; return; }

      let masked = '+7 (';
      if (val.length >= 1) masked += val.slice(0, 3);
      if (val.length >= 4) masked += ') ' + val.slice(3, 6);
      if (val.length >= 7) masked += '-' + val.slice(6, 8);
      if (val.length >= 9) masked += '-' + val.slice(8, 10);
      e.target.value = masked;
    });
  }

  // Form submit
  const form = document.getElementById('ctaForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const phone = form.querySelector('#phone').value.trim();

      if (!name || !phone) {
        [name ? null : '#name', phone ? null : '#phone'].forEach(sel => {
          if (!sel) return;
          const el = form.querySelector(sel);
          el.style.borderColor = '#e05252';
          el.addEventListener('input', () => el.style.borderColor = '', { once: true });
        });
        return;
      }

      // Simulate send
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Отправляем...';
      submitBtn.disabled = true;

      setTimeout(() => {
        formSuccess.classList.add('visible');
      }, 800);
    });
  }

  // Smooth active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));
})();
