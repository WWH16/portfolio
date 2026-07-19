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
    const isDark = theme === 'dark';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    if (toggleBtnDrawer) {
      toggleBtnDrawer.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
    if (drawerLabel) {
      drawerLabel.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
    const announcer = $('#sr-announcer');
    if (announcer) {
      announcer.textContent = `Theme changed to ${theme} mode`;
    }
    if (document.body) {
      if (isDark) {
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
  initLenis();
  initMagneticButtons();
  initGlowCards();
  initScrollReveal();
  initProjectRows();
  initContactForm();
  initGitHubStats();
  initDynamicProjects();

  // Set current year dynamically in footer
  const yearEl = $('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Set dynamic timezone time in footer (Manila Time: Asia/Manila)
  const timeEl = $('#footer-time');
  if (timeEl) {
    const updateTime = () => {
      const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      timeEl.textContent = new Date().toLocaleTimeString('en-US', options);
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
}

// ─── GitHub API Stats Fetch & Theme Sync ────────────────────
function initGitHubStats() {
  const repoEl = $('#github-repo-count');
  const followerEl = $('#github-follower-count');
  const graphImg = $('#github-graph-img');

  const updateGraphColor = (theme) => {
    if (!graphImg) return;
    const color = theme === 'dark' ? '39d353' : '216e39';
    graphImg.src = `https://ghchart.rshah.org/${color}/WWH16`;
  };

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateGraphColor(currentTheme);

  window.addEventListener('themechange', (e) => {
    updateGraphColor(e.detail.theme);
  });

  if (repoEl && followerEl) {
    fetch('https://api.github.com/users/WWH16')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch error');
        return res.json();
      })
      .then((data) => {
        if (data.public_repos !== undefined) repoEl.textContent = data.public_repos;
        if (data.followers !== undefined) followerEl.textContent = data.followers;
      })
      .catch(() => {});
  }
}

// ============================================================
// NAV
// ============================================================
function initNav() {
  const nav         = $('#nav');
  const hamburger   = $('#nav-hamburger');
  const drawer      = $('#nav-drawer');
  const drawerLinks = $$('.drawer-link');
  const main        = $('#main-content');

  // Animate nav in
  if (prefersReducedMotion) {
    gsap.set(nav, { y: 0 });
  } else {
    gsap.to(nav, {
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
      delay: 0.2,
    });
  }

  // Scroll-based nav style
  ScrollTrigger.create({
    start: 'top -60',
    onToggle: ({ isActive }) => {
      nav.classList.toggle('scrolled', isActive);
    },
  });

  let drawerOpen = false;

  function openDrawer() {
    drawerOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    nav.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
    if (main) main.setAttribute('aria-hidden', 'true');
    // Focus first focusable link
    setTimeout(() => drawerLinks[0]?.focus(), 50);
  }

  function closeDrawer() {
    drawerOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    nav.classList.remove('drawer-open');
    document.body.style.overflow = '';
    if (main) main.removeAttribute('aria-hidden');
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    if (drawerOpen) closeDrawer();
    else openDrawer();
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Focus trap & keyboard handler for drawer
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = $$('#nav-drawer a, #nav-drawer button');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// ============================================================
// CUSTOM CURSOR (desktop only)
// ============================================================
function initCursor() {
  if (isMobile() || prefersReducedMotion) return;

  document.body.classList.add('custom-cursor-active');

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
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';

    const dx = mx - fx;
    const dy = my - fy;
    if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
      raf = requestAnimationFrame(animateFollower);
    } else {
      raf = null;
    }
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
// THREE.JS — Undulating Grid Wave field in hero
// ============================================================
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function initThreeJS() {
  const canvas = $('#three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const count = isMobile() ? 40 : 100;
  const nodes = [];
  
  // Bounding area sizes
  const areaW = 16;
  const areaH = 10;
  const areaD = 8;
  
  // Initialize nodes with position, target velocity, current velocity
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: (Math.random() - 0.5) * areaW,
      y: (Math.random() - 0.5) * areaH,
      z: (Math.random() - 0.5) * areaD,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03,
      vz: (Math.random() - 0.5) * 0.03,
      targetVx: (Math.random() - 0.5) * 0.015,
      targetVy: (Math.random() - 0.5) * 0.015,
      targetVz: (Math.random() - 0.5) * 0.015,
      size: Math.random() * 2 + 1
    });
  }

  // Create Points (nodes)
  const pointsGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  for(let i=0; i<count; i++) {
    positions[i*3] = nodes[i].x;
    positions[i*3+1] = nodes[i].y;
    positions[i*3+2] = nodes[i].z;
    sizes[i] = nodes[i].size;
  }
  
  pointsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.16,
    map: createCircleTexture(),
    color: 0x34d399,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const pointsMesh = new THREE.Points(pointsGeom, pointsMaterial);
  scene.add(pointsMesh);

  // Pre-allocate buffer for connecting lines
  const maxLines = isMobile() ? 150 : 400;
  const lineGeom = new THREE.BufferGeometry();
  const linePositions = new Float32Array(maxLines * 2 * 3);
  const lineColors = new Float32Array(maxLines * 2 * 3);
  
  lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const lineSegments = new THREE.LineSegments(lineGeom, lineMaterial);
  scene.add(lineSegments);

  const colorForest = new THREE.Color(0x16a34a);
  const colorMint = new THREE.Color(0x34d399);

  const updateVisualsForTheme = (theme) => {
    const isDark = theme === 'dark';
    if (isDark) {
      pointsMaterial.opacity = 0.85;
      pointsMaterial.color.set(colorMint);
      pointsMaterial.blending = THREE.AdditiveBlending;
      
      lineMaterial.opacity = 0.45;
      lineMaterial.blending = THREE.AdditiveBlending;
    } else {
      pointsMaterial.opacity = 0.55;
      pointsMaterial.color.setHex(0x15803d);
      pointsMaterial.blending = THREE.NormalBlending;
      
      lineMaterial.opacity = 0.22;
      lineMaterial.blending = THREE.NormalBlending;
    }
    pointsMaterial.needsUpdate = true;
    lineMaterial.needsUpdate = true;
  };

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateVisualsForTheme(currentTheme);

  window.addEventListener('themechange', (e) => {
    updateVisualsForTheme(e.detail.theme);
  });

  let targetMouseX = 0, targetMouseY = 0;
  let currentMouseX = 0, currentMouseY = 0;
  let mouseActive = false;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * areaW;
    targetMouseY = -(e.clientY / window.innerHeight - 0.5) * areaH;
    mouseActive = true;
  });

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  const heroEl = $('#hero');
  if (heroEl) {
    heroEl.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width - 0.5) * areaW;
      const clickY = -((e.clientY - rect.top) / rect.height - 0.5) * areaH;
      
      for (let i = 0; i < count; i++) {
        const node = nodes[i];
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        if (dist < 8) {
          const force = (8 - dist) * 0.12;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
      }
    });
  }

  const threshold = isMobile() ? 2.2 : 2.8;
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);

    if (mouseActive) {
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;
    }

    const posArr = pointsGeom.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const node = nodes[i];

      node.vx += (node.targetVx - node.vx) * 0.03;
      node.vy += (node.targetVy - node.vy) * 0.03;
      node.vz += (node.targetVz - node.vz) * 0.03;

      if (mouseActive) {
        const dx = currentMouseX - node.x;
        const dy = currentMouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        if (dist < 4) {
          const pull = (4 - dist) * 0.0015;
          node.vx += (dx / dist) * pull;
          node.vy += (dy / dist) * pull;
        }
      }

      node.x += node.vx;
      node.y += node.vy;
      node.z += node.vz;

      const limitX = areaW / 2;
      const limitY = areaH / 2;
      const limitZ = areaD / 2;

      if (Math.abs(node.x) > limitX) {
        node.vx *= -1;
        node.targetVx *= -1;
        node.x = Math.sign(node.x) * limitX;
      }
      if (Math.abs(node.y) > limitY) {
        node.vy *= -1;
        node.targetVy *= -1;
        node.y = Math.sign(node.y) * limitY;
      }
      if (Math.abs(node.z) > limitZ) {
        node.vz *= -1;
        node.targetVz *= -1;
        node.z = Math.sign(node.z) * limitZ;
      }

      posArr[i*3] = node.x;
      posArr[i*3+1] = node.y;
      posArr[i*3+2] = node.z;
    }
    pointsGeom.attributes.position.needsUpdate = true;

    let lineIdx = 0;
    const linePosArr = lineGeom.attributes.position.array;
    const lineColArr = lineGeom.attributes.color.array;
    
    linePosArr.fill(0);
    lineColArr.fill(0);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const r1 = isDark ? 0.20 : 0.08;
    const g1 = isDark ? 0.82 : 0.50;
    const b1 = isDark ? 0.60 : 0.24;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (lineIdx >= maxLines) break;

        const n1 = nodes[i];
        const n2 = nodes[j];

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dz = n1.z - n2.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold) {
          const vertexIdx = lineIdx * 6;
          
          linePosArr[vertexIdx] = n1.x;
          linePosArr[vertexIdx + 1] = n1.y;
          linePosArr[vertexIdx + 2] = n1.z;
          
          linePosArr[vertexIdx + 3] = n2.x;
          linePosArr[vertexIdx + 4] = n2.y;
          linePosArr[vertexIdx + 5] = n2.z;

          const alpha = Math.max(0, 1 - (dist / threshold));
          
          const colIdx = lineIdx * 6;
          lineColArr[colIdx] = r1 * alpha;
          lineColArr[colIdx + 1] = g1 * alpha;
          lineColArr[colIdx + 2] = b1 * alpha;
          
          lineColArr[colIdx + 3] = r1 * alpha;
          lineColArr[colIdx + 4] = g1 * alpha;
          lineColArr[colIdx + 5] = b1 * alpha;

          lineIdx++;
        }
      }
    }

    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) animate();
  else renderer.render(scene, camera);

  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas);

  ScrollTrigger.create({
    trigger: heroEl,
    start: 'top top',
    end: 'bottom top',
    onLeave: ()  => { cancelAnimationFrame(animId); },
    onEnterBack: () => { if (!prefersReducedMotion) animate(); },
  });
}

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
function initLenis() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
  if (prefersReducedMotion) return;

  const magnets = $$('.magnetic');
  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'expo.out',
      });
    });
  });
}

// ============================================================
// GLOW CARDS (MOUSE GLOW TRACKING)
// ============================================================
function initGlowCards() {
  if (prefersReducedMotion) return;

  const cards = $$('.glow-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  if (prefersReducedMotion) {
    $$('.reveal, .process-card, .testimonial-card').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

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

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ============================================================
// PROJECT ROWS — hover image preview
// ============================================================
function initProjectRows() {
  const rows    = $$('.project-row');
  const preview = $('#project-preview');
  const previewImg = $('#project-preview-img');

  if (!preview || isMobile() || prefersReducedMotion) return;

  let mx = 0, my = 0;
  let isKeyboardFocused = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (preview.classList.contains('visible') && !isKeyboardFocused) {
      const x = mx + 24;
      const y = my - 90;
      preview.style.left = x + 'px';
      preview.style.top  = y + 'px';
    }
  });

  rows.forEach((row) => {
    const imgSrc = row.dataset.img;
    const imgAlt = row.dataset.imgAlt || '';

    const show = (rect) => {
      if (!imgSrc) return;
      previewImg.src = imgSrc;
      previewImg.alt = imgAlt;
      preview.classList.add('visible');
      if (rect) {
        const x = rect.left + (rect.width * 0.55);
        const y = rect.top + (rect.height / 2) - 90;
        preview.style.left = x + 'px';
        preview.style.top  = y + 'px';
      }
    };

    const hide = () => {
      preview.classList.remove('visible');
    };

    row.addEventListener('mouseenter', () => {
      isKeyboardFocused = false;
      show();
    });
    row.addEventListener('mouseleave', hide);

    row.addEventListener('focus', () => {
      isKeyboardFocused = true;
      show(row.getBoundingClientRect());
    });
    row.addEventListener('blur', () => {
      isKeyboardFocused = false;
      hide();
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
      field.setAttribute('aria-invalid', 'true');
      field.style.borderColor = 'oklch(0.65 0.18 25)';
      if (!error) {
        error = document.createElement('span');
        error.className = 'form-error';
        error.id = `${field.id}-error`;
        error.setAttribute('role', 'alert');
        error.style.cssText = 'font-size:0.72rem; color:oklch(0.65 0.18 25); margin-top:4px; display:block;';
        parent.appendChild(error);
      }
      error.textContent = msg;
      field.setAttribute('aria-describedby', error.id);
    } else {
      field.removeAttribute('aria-invalid');
      field.style.borderColor = '';
      if (error) {
        error.remove();
      }
      if (field.id !== 'message') {
        field.removeAttribute('aria-describedby');
      } else {
        field.setAttribute('aria-describedby', 'message-helper');
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    inputs.forEach((input) => {
      validateField(input);
      if (!input.value.trim() || input.getAttribute('aria-invalid') === 'true') {
        valid = false;
      }
    });

    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    if (submitArrow) submitArrow.style.display = 'none';

    setTimeout(() => {
      submitText.textContent = '✓ Message Sent!';
      submitBtn.style.background = 'var(--accent)';
      
      const announcer = $('#sr-announcer');
      if (announcer) {
        announcer.textContent = 'Your message has been sent successfully.';
      }

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        if (submitArrow) submitArrow.style.display = '';
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
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      
      if (window.lenis && !prefersReducedMotion) {
        window.lenis.scrollTo(target);
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }

      const drawer    = $('#nav-drawer');
      const hamburger = $('#nav-hamburger');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger && hamburger.classList.remove('open');
        hamburger && hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const main = $('#main-content');
        if (main) main.removeAttribute('aria-hidden');
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
    if (window.lenis && !prefersReducedMotion) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  });
}

// ============================================================
// DYNAMIC GITHUB PROJECTS
// ============================================================
async function initDynamicProjects() {
  const workList = document.querySelector('.work-list');
  if (!workList) return;

  try {
    const targetRepos = ['tumor-classification-web-ver', 'MMS', 'barangay_connect'];
    
    // Fetch specifically the 3 repos requested
    const repoPromises = targetRepos.map(name => 
      fetch(`https://api.github.com/repos/WWH16/${name}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch repo: ${name}`);
        return res.json();
      })
    );
    
    let repos = await Promise.all(repoPromises);

    // Fade out existing items
    gsap.to(workList.children, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      onComplete: async () => {
        workList.innerHTML = ''; // Clear static items

        let index = 1;
        const newElements = [];
        
        for (const repo of repos) {
          const tags = repo.topics || [];
          if (repo.language && !tags.includes(repo.language.toLowerCase())) {
            tags.push(repo.language);
          }
          
          let tagsHtml = tags.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join('');
          if (!tagsHtml) tagsHtml = `<span class="project-tag">Project</span>`;
          
          const year = new Date(repo.pushed_at || repo.created_at).getFullYear();
          
          let imgSrc = '';
          try {
            const assetsRes = await fetch(`https://api.github.com/repos/WWH16/${repo.name}/contents/assets`);
            if (assetsRes.ok) {
              const assets = await assetsRes.json();
              const imgFile = assets.find(file => file.name.match(/\\.(jpg|jpeg|png|gif|webp)$/i));
              if (imgFile) {
                imgSrc = imgFile.download_url;
              }
            }
          } catch (e) {
            console.warn('Could not fetch assets for', repo.name);
          }
          
          if (!imgSrc) {
            imgSrc = 'assets/project_branding_1783858362778.jpg'; // Static fallback
          }

          const numStr = String(index).padStart(2, '0');
          
          let displayName = repo.name.replace(/[-_]/g, ' ');
          if (repo.name === 'MMS') {
            displayName = 'Movie Recommendation System';
          }
          
          const a = document.createElement('a');
          a.href = repo.html_url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'project-row';
          a.style.opacity = '0';
          a.style.transform = 'translateY(28px)';
          a.setAttribute('role', 'listitem');
          a.setAttribute('aria-label', `View ${repo.name} repository`);
          a.dataset.img = imgSrc;
          a.dataset.imgAlt = `${displayName} preview`;

          a.innerHTML = `
            <span class="project-num" aria-hidden="true">${numStr}</span>
            <div class="project-info">
              <h3 class="project-title" style="text-transform: capitalize;">${displayName}</h3>
              <div class="project-tags-row" aria-label="Project tags">
                ${tagsHtml}
              </div>
            </div>
            <div class="project-row-right">
              <span class="project-year">${year}</span>
              <div class="project-arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          `;
          
          workList.appendChild(a);
          newElements.push(a);
          index++;
        }
        
        // Re-initialize hover events for new rows
        initProjectRows();
        
        // Animate them in
        gsap.to(newElements, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: workList,
            start: 'top 90%',
            toggleActions: 'play reset play reset',
          }
        });
        
        ScrollTrigger.refresh();
      }
    });
    
  } catch (err) {
    console.error('Error loading dynamic projects:', err);
  }
}
