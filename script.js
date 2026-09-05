const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (toggle && mobileNav) {
  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => io.observe(item));
}

const splash = document.querySelector('.splash-screen');
if (splash) {
  document.body.classList.add('is-loading');
  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
    }, 1400);
  });
}


const cursorDot = document.querySelector('.pixel-cursor-dot');
const cursorTrail = document.querySelector('.pixel-cursor');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorDot && finePointer) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let trailX = mouseX;
  let trailY = mouseY;
  const cursorSize = 8;
  const trailSize = 14;
  document.body.classList.add('cursor-ready');
  cursorDot.style.transform = `translate3d(${dotX - cursorSize / 2}px, ${dotY - cursorSize / 2}px, 0) scale(var(--cursor-scale, 1))`;
  if (cursorTrail) {
    cursorTrail.style.transform = `translate3d(${trailX - trailSize / 2}px, ${trailY - trailSize / 2}px, 0)`;
  }

  window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dotX = mouseX;
    dotY = mouseY;
    cursorDot.style.transform = `translate3d(${dotX - cursorSize / 2}px, ${dotY - cursorSize / 2}px, 0) scale(var(--cursor-scale, 1))`;
    document.body.classList.add('cursor-ready');
  }, { passive: true });

  const hiddenTargets = 'a, button, .primary-pill, .nav-cta, .light-pill';
  document.querySelectorAll(hiddenTargets).forEach((element) => {
    element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hidden'), { passive: true });
    element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hidden'), { passive: true });
  });

  document.addEventListener('pointerleave', () => {
    document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-hidden');
  }, { passive: true });

  window.addEventListener('blur', () => {
    document.body.classList.remove('cursor-ready', 'cursor-hover', 'cursor-hidden');
  }, { passive: true });

  const heroStars = document.querySelectorAll('.hero-title em, .hero-title strong, .hero-title b');

  const updateStarRotation = () => {
    if (!heroStars.length) return;

    heroStars.forEach((star, index) => {
      const rect = star.getBoundingClientRect();
      const dx = mouseX - (rect.left + rect.width / 2);
      const dy = mouseY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, Math.min(1, 1 - distance / 260));
      const rotation = (dx * 0.02 + dy * 0.1) * strength;
      const offset = (index - (heroStars.length - 1) / 2) * 1.2;
      star.style.transform = `rotate(${rotation + offset}deg)`;
    });
  };

  const animateCursor = () => {
    if (cursorTrail) {
      trailX += (mouseX - trailX) * 0.16;
      trailY += (mouseY - trailY) * 0.16;
      cursorTrail.style.transform = `translate3d(${trailX - trailSize / 2}px, ${trailY - trailSize / 2}px, 0)`;
    }
    updateStarRotation();
    requestAnimationFrame(animateCursor);
  };

  animateCursor();
}


const stackCards = [...document.querySelectorAll('[data-stack-card]')];
const stackMediaQuery = window.matchMedia('(min-width: 761px)');

function updateStackCards() {
  if (!stackCards.length || !stackMediaQuery.matches) {
    stackCards.forEach((card) => {
      card.classList.remove('is-past', 'is-active');
    });
    return;
  }

  const trigger = window.innerHeight * 0.22;
  stackCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    card.classList.remove('is-past', 'is-active');
    if (rect.top <= trigger && rect.bottom > trigger) {
      card.classList.add('is-active');
    } else if (rect.top < trigger) {
      card.classList.add('is-past');
    }
  });
}

window.addEventListener('scroll', updateStackCards, { passive: true });
window.addEventListener('resize', updateStackCards, { passive: true });
window.addEventListener('load', updateStackCards);


const introHeading = document.querySelector('.intro-heading');

if (introHeading) {
  const lines = [...introHeading.querySelectorAll('.line')];

  lines.forEach((line) => {
    if (line.dataset.letterized === 'true') return;
    const text = line.textContent;
    line.textContent = '';
    line.dataset.letterized = 'true';

    text.trim().split(/\s+/).forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'intro-word';

      [...word].forEach((char) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'intro-letter';
        letterSpan.textContent = char;
        wordSpan.appendChild(letterSpan);
      });

      line.appendChild(wordSpan);
      if (wordIndex < text.trim().split(/\s+/).length - 1) {
        line.appendChild(document.createTextNode(' '));
      }
    });
  });

  const introLetters = [...introHeading.querySelectorAll('.intro-letter')];

  const updateIntroLetters = () => {
    if (!introLetters.length) return;

    const rect = introHeading.getBoundingClientRect();
    const start = window.innerHeight * 0.82;
    const end = window.innerHeight * 0.28;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const activeLetters = progress * introLetters.length;

    introLetters.forEach((letter, index) => {
      const strength = Math.max(0, Math.min(1, activeLetters - index));
      const eased = strength * strength * (3 - 2 * strength);
      const channel = Math.round(205 - (145 * eased));
      letter.style.setProperty('--letter-color', `${channel} ${channel} ${channel}`);
    });
  };

  window.addEventListener('scroll', updateIntroLetters, { passive: true });
  window.addEventListener('resize', updateIntroLetters, { passive: true });
  window.addEventListener('load', updateIntroLetters);
  updateIntroLetters();
}

const testimonialCarousel = document.querySelector('.testimonial-carousel');

if (testimonialCarousel) {
  const track = testimonialCarousel.querySelector('.testimonial-track');
  const cards = [...testimonialCarousel.querySelectorAll('.testimonial-card')];
  const dots = [...testimonialCarousel.querySelectorAll('.testimonial-dots button')];
  let activeIndex = 0;
  let testimonialTimer;

  const showTestimonial = (index) => {
    if (!track || !cards.length) return;
    activeIndex = (index + cards.length) % cards.length;
    track.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
      dot.setAttribute('aria-pressed', String(dotIndex === activeIndex));
    });
  };

  const startTestimonials = () => {
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(() => {
      showTestimonial(activeIndex + 1);
    }, 5000);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showTestimonial(index);
      startTestimonials();
    });
  });

  showTestimonial(0);

  if (!prefersReduced) {
    startTestimonials();
  }
}

const testimonialLogos = [...document.querySelectorAll('.testimonials-brand-row img')];

if (testimonialLogos.length) {
  let activeLogoIndex = 0;

  const showLogo = (index) => {
    activeLogoIndex = index % testimonialLogos.length;
    testimonialLogos.forEach((logo, logoIndex) => {
      logo.classList.toggle('is-active', logoIndex === activeLogoIndex);
    });
  };

  showLogo(0);

  if (!prefersReduced) {
    window.setInterval(() => {
      showLogo(activeLogoIndex + 1);
    }, 1400);
  }
}

/* Removed Recent Works scroll controller */

/* global smooth scroll controller removed to restore native scrolling. */
