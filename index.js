// ─── Theme Management (Immediate execution to prevent flash) ──────────────────
(function preInitTheme() {
  const saved = localStorage.getItem('theme');
  const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function initTheme() {
  const html = document.documentElement;
  const toggleBtn = $('#theme-toggle');
  const toggleBtnDrawer = $('#theme-toggle-drawer');
  const drawerLabel = $('#drawer-theme-label');

  const setTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (drawerLabel) {
      drawerLabel.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    // Update body cursor class if body is loaded
    if (document.body) {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  };

  // Sync drawer label on load
  const currentTheme = html.getAttribute('data-theme') || 'light';
  setTheme(currentTheme);

  const toggle = () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  if (toggleBtn) toggleBtn.addEventListener('click', toggle);
  if (toggleBtnDrawer) toggleBtnDrawer.addEventListener('click', toggle);
}

// ─── Reduced Motion Check ────────────────────────────────────
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// ─── Utility ─────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const isMobile = () => window.innerWidth <= 768;

// ============================================================
// LOADER
// ============================================================
(function initLoader() {
  const loader   = $('#loader');
  const bar      = $('#loader-bar');
  const count    = $('#loader-count');
  const wordmark = $('#loader-wordmark');

  let progress = 0;

  const tick = setInterval(() => {
    const step = Math.random() * 18 + 5;
    progress = Math.min(progress + step, 100);
    bar.style.width = progress + '%';
    count.textContent = Math.round(progress) + '%';

    if (progress >= 100) {
      clearInterval(tick);
      setTimeout(hideLoader, 300);
    }
  }, 120);

  function hideLoader() {
    if (prefersReducedMotion) {
      loader.style.display = 'none';
      onLoaderComplete();
      return;
    }

    // Animate wordmark clip-path open
    gsap.to(wordmark, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.9,
      ease: 'expo.inOut',
    });

    // Slide loader out
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'expo.inOut',
      delay: 0.6,
      onComplete: () => {
        loader.style.display = 'none';
        onLoaderComplete();
      },
    });
  }
})();

// ============================================================
// POST-LOADER ANIMATIONS (hero entrance)
// ============================================================
function onLoaderComplete() {
  gsap.registerPlugin(ScrollTrigger);

  initTheme();
  initNav();
  initCursor();
  initScrollProgress();
  initScrollToTop();
  initHeroAnimation();
  initThreeJS();
  initScrollReveal();
  initProjectRows();
  initContactForm();
}

// ============================================================
// NAV
// ============================================================
function initNav() {
  const nav         = $('#nav');
  const hamburger   = $('#nav-hamburger');
  const drawer      = $('#nav-drawer');
  const drawerLinks = $$('.drawer-link');

  // Animate nav in
  gsap.to(nav, {
    y: 0,
    duration: 0.8,
    ease: 'expo.out',
    delay: 0.2,
  });

  // Scroll-based nav style
  ScrollTrigger.create({
    start: 'top -60',
    onToggle: ({ isActive }) => {
      nav.classList.toggle('scrolled', isActive);
    },
  });

  // Hamburger / drawer
  let drawerOpen = false;

  hamburger.addEventListener('click', () => {
    drawerOpen = !drawerOpen;
    hamburger.classList.toggle('open', drawerOpen);
    hamburger.setAttribute('aria-expanded', drawerOpen);
    drawer.classList.toggle('open', drawerOpen);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  function closeDrawer() {
    drawerOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Keyboard trap for drawer
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

// ============================================================
// CUSTOM CURSOR (desktop only)
// ============================================================
function initCursor() {
  if (isMobile()) return;

  const cursor   = $('#cursor');
  const follower = $('#cursor-follower');

  let mx = 0, my = 0; // mouse position
  let fx = 0, fy = 0; // follower position
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';

    if (!raf) raf = requestAnimationFrame(animateFollower);
  });

  function animateFollower() {
    raf = null;
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf = requestAnimationFrame(animateFollower);
  }

  // Hover detection
  const hoverTargets = $$('a, button, [role="button"], [tabindex="0"]');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

// ============================================================
// SCROLL PROGRESS
// ============================================================
function initScrollProgress() {
  const bar = $('#scroll-progress');

  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: ({ progress }) => {
      bar.style.transform = `scaleX(${progress})`;
    },
  });
}

// ============================================================
// HERO ENTRANCE
// ============================================================
function initHeroAnimation() {
  const heroWords = $$('.title-word');
  const heroLabel = $('#hero-label');
  const heroSub   = $('#hero-sub');
  const heroActions = $('#hero-actions');
  const heroScroll  = $('#hero-scroll');

  if (prefersReducedMotion) {
    heroWords.forEach(el => { el.style.transform = 'none'; });
    return;
  }

  // Set initial states programmatically
  gsap.set(heroWords, { y: '110%' });
  gsap.set([heroLabel, heroSub, heroActions], { opacity: 0, y: 20 });
  gsap.set(heroScroll, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // Title words reveal
  tl.to(heroWords, {
    y: 0,
    duration: 1,
    stagger: 0.12,
  })
  .to(heroLabel, {
    opacity: 1,
    y: 0,
    duration: 0.6,
  }, '-=0.5')
  .to(heroSub, {
    opacity: 1,
    y: 0,
    duration: 0.6,
  }, '-=0.4')
  .to(heroActions, {
    opacity: 1,
    y: 0,
    duration: 0.6,
  }, '-=0.4')
  .to(heroScroll, {
    opacity: 1,
    duration: 0.6,
  }, '-=0.2');
}

// ============================================================
// THREE.JS — Particle field in hero
// ============================================================
function initThreeJS() {
  const canvas = $('#three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Particles
  const count    = isMobile() ? 600 : 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);

  const colorA = new THREE.Color(0x16a34a); // deep green
  const colorB = new THREE.Color(0x34d399); // emerald
  const colorC = new THREE.Color(0x86efac); // light mint

  for (let i = 0; i < count; i++) {
    // Spread across a wide area
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // Random color mix
    const t   = Math.random();
    const col = t < 0.5
      ? colorA.clone().lerp(colorC, t * 2)
      : colorB.clone().lerp(colorC, (t - 0.5) * 2);

    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const updateMaterialForTheme = (theme) => {
    const isDark = theme === 'dark';
    material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.opacity = isDark ? 0.65 : 0.35;
    material.needsUpdate = true;
  };

  // Set initial blending/opacity based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateMaterialForTheme(currentTheme);

  // Listen for theme changes dynamically
  window.addEventListener('themechange', (e) => {
    updateMaterialForTheme(e.detail.theme);
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animate
  let animId;
  const heroEl = $('#hero');

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = Date.now() * 0.00025;

    particles.rotation.y = t * 0.3 + mouseX * 0.08;
    particles.rotation.x = t * 0.1 - mouseY * 0.04;

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) animate();
  else renderer.render(scene, camera);

  // Resize
  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas);

  // Stop when hero not visible (perf)
  ScrollTrigger.create({
    trigger: heroEl,
    start: 'top top',
    end: 'bottom top',
    onLeave: ()  => { cancelAnimationFrame(animId); },
    onEnterBack: () => { if (!prefersReducedMotion) animate(); },
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  if (prefersReducedMotion) {
    // Force all reveals visible immediately
    $$('.reveal, .process-card, .testimonial-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // Set initial states PROGRAMMATICALLY (not via CSS)
  // so content is visible by default for headless renderers / no-JS
  const reveals = $$('.reveal');
  gsap.set(reveals, { opacity: 0, y: 28 });

  gsap.set('.process-card', { opacity: 0, y: 32 });
  gsap.set('.testimonial-card', { opacity: 0, x: 40 });

  reveals.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play reset play reset',
      },
    });
  });

  // Process cards stagger
  gsap.to('.process-card', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.process-grid',
      start: 'top 88%',
      toggleActions: 'play reset play reset',
    },
  });

  // Testimonials slide in
  gsap.to('.testimonial-card', {
    opacity: 1,
    x: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.testimonials-track',
      start: 'top 90%',
      toggleActions: 'play reset play reset',
    },
  });

  // Refresh ScrollTrigger after fonts/images load
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ============================================================
// PROJECT ROWS — hover image preview
// ============================================================
function initProjectRows() {
  const rows    = $$('.project-row');
  const preview = $('#project-preview');
  const previewImg = $('#project-preview-img');

  if (!preview || isMobile()) return;

  let mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (preview.classList.contains('visible')) {
      // Offset so it doesn't cover the row text
      const x = mx + 24;
      const y = my - 90;
      preview.style.left = x + 'px';
      preview.style.top  = y + 'px';
    }
  });

  rows.forEach((row) => {
    const imgSrc = row.dataset.img;
    const imgAlt = row.dataset.imgAlt || '';

    row.addEventListener('mouseenter', () => {
      if (!imgSrc) return;
      previewImg.src = imgSrc;
      previewImg.alt = imgAlt;
      preview.classList.add('visible');
    });

    row.addEventListener('mouseleave', () => {
      preview.classList.remove('visible');
    });
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form       = $('#contact-form');
  const submitBtn  = $('#submit-btn');
  const submitText = $('#submit-text');
  const submitArrow = $('#submit-arrow');

  if (!form) return;

  // Basic inline validation
  const inputs = form.querySelectorAll('[required]');

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
  });

  function validateField(field) {
    const parent = field.closest('.form-group');
    let error = parent.querySelector('.form-error');

    let msg = '';
    if (!field.value.trim()) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      msg = 'Please enter a valid email address.';
    }

    if (msg) {
      field.style.borderColor = 'oklch(0.65 0.18 25)';
      if (!error) {
        error = document.createElement('span');
        error.className = 'form-error';
        error.setAttribute('role', 'alert');
        error.style.cssText = 'font-size:0.72rem; color:oklch(0.65 0.18 25); margin-top:4px; display:block;';
        parent.appendChild(error);
      }
      error.textContent = msg;
    } else {
      field.style.borderColor = '';
      if (error) error.remove();
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    let valid = true;
    inputs.forEach((input) => {
      validateField(input);
      if (!input.value.trim()) valid = false;
    });

    if (!valid) {
      inputs[0].focus();
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    submitArrow.style.display = 'none';

    setTimeout(() => {
      submitText.textContent = '✓ Message Sent!';
      submitBtn.style.background = 'oklch(0.72 0.18 145)';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitArrow.style.display = '';
        submitBtn.style.background = '';
      }, 3000);
    }, 1500);
  });
}

// ============================================================
// SMOOTH ANCHOR SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile drawer if open
      const drawer    = $('#nav-drawer');
      const hamburger = $('#nav-hamburger');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        hamburger && hamburger.classList.remove('open');
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });
});

// ============================================================
// SCROLL TO TOP BUTTON LOGIC
// ============================================================
function initScrollToTop() {
  const btn = $('#scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
