(() => {
  'use strict';

  const PORTFOLIO_TEXT = 'PORTFOLIO';
  const NAME_TEXT = 'SUSATWIK MANURI';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const heroTrack = document.getElementById('hero-track');
  const heroTitle = document.getElementById('hero-title');
  const heroCaption = document.getElementById('hero-caption');
  const portraitCanvas = document.getElementById('portrait-canvas');
  const portraitFallback = document.getElementById('portrait-fallback');
  const aboutSection = document.getElementById('about');
  const aboutNeuralCanvas = document.getElementById('about-neural-canvas');
  const siteHeader = document.getElementById('site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = siteHeader?.querySelector('nav');
  const skipButton = document.getElementById('skip-intro-btn');

  let portraitSystem = null;
  let neuralSystem = null;
  let introActive = true;
  let aboutLines = null;
  let aboutWords = null;

  // Journey Timeline Elements & State
  let journeyTrack = null;
  let journeyHeader = null;
  let journeyPathCore = null;
  let journeyPathGlow = null;
  let journeyNodes = [];
  let journeyCards = [];
  let journeyStats = null;
  let journeyAmbientSystem = null;
  let journeyPathLength = 1400;

  // ==========================================================================
  // DETERMINISTIC PSEUDO-RANDOM HASH
  // ==========================================================================
  function hash(x, y, seed = 0) {
    let h = Math.imul(x + seed + 1, 374761393) + Math.imul(y + seed + 1, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function smoothstep(v) {
    const t = clamp01(v);
    return t * t * (3 - 2 * t);
  }

  // ==========================================================================
  // DYNAMIC HERO PORTFOLIO TYPOGRAPHY CALIBRATION
  // Measures actual font glyph widths with tracking to guarantee 88–92% fit
  // ==========================================================================
  function fitPortfolioHeading() {
    if (!heroTitle) return 0;
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    // Target 84–88% hero content width with safe side margins to guarantee zero edge clipping
    const targetWidth = isSmallMobile
      ? window.innerWidth * 0.84
      : (isMobile ? window.innerWidth * 0.86 : Math.min(window.innerWidth * 0.88, 1300));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let computedSize = 0;
    if (ctx) {
      ctx.font = '900 100px "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const tracking = 100 * -0.045;
      const chars = [...PORTFOLIO_TEXT];
      const advanceW = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) + tracking * (chars.length - 1);
      // Measure actual text bounding metrics to protect rightmost curvature of the final "O"
      const textMetrics = ctx.measureText(PORTFOLIO_TEXT);
      const rightOverhang = (textMetrics.actualBoundingBoxRight && textMetrics.actualBoundingBoxRight > advanceW)
        ? (textMetrics.actualBoundingBoxRight - advanceW)
        : 4;
      const totalW = advanceW + rightOverhang;

      if (totalW > 0) {
        const idealSize = (targetWidth / totalW) * 100;
        const minClamp = isSmallMobile ? 28 : (isMobile ? 38 : 52);
        const maxClamp = isSmallMobile
          ? Math.min(52, window.innerWidth * 0.14)
          : (isMobile ? 92 : 210);
        computedSize = Math.max(minClamp, Math.min(maxClamp, idealSize));
        heroTitle.style.setProperty('--portfolio-size', `${computedSize.toFixed(1)}px`);
      }
    }
    return computedSize;
  }

  // ==========================================================================
  // FULL-VIEWPORT PARTICLE SYSTEM & CINEMATIC INTRO CHOREOGRAPHY
  // ==========================================================================
  class PortraitParticleSystem {
    constructor(canvas, imageElement) {
      this.canvas = canvas;
      this.image = imageElement;
      this.fallbackImage = portraitFallback;
      this.ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
      this.particles = [];
      this.progress = 0;
      this.pointerX = -9999;
      this.pointerY = -9999;
      this.pointerActive = false;
      this.bounds = { width: 0, height: 0 };
      this.frameSize = 0;
      this.state = 'initializing'; // 'initializing' | 'playing' | 'completed' | 'skipped' | 'fallback'
      this.isIntro = true;
      this.introAnimId = null;
      this.renderAnimId = null;
      this.introTimeoutId = null;
      this.init();
    }

    async init() {
      // Check if user prefers reduced motion OR has deep-linked to a lower section
      const hash = window.location.hash;
      const isDeepLink = Boolean(hash && hash !== '#top' && hash !== '#' && document.querySelector(hash));
      const isScrolledDown = window.scrollY > 120;

      if (reduceMotion) {
        this.finishIntro();
        if (isDeepLink) {
          requestAnimationFrame(() => {
            const target = document.querySelector(hash);
            target?.scrollIntoView({ behavior: 'auto' });
          });
        }
        this.prepareBackgroundParticles();
        return;
      }

      if (isDeepLink || isScrolledDown) {
        this.finishIntro('completed');
        if (isDeepLink) {
          requestAnimationFrame(() => {
            const target = document.querySelector(hash);
            target?.scrollIntoView({ behavior: 'auto' });
          });
        }
        this.prepareBackgroundParticles();
        return;
      }

      this.transitionTo('initializing');
      document.body.classList.add('is-intro');
      introActive = true;

      // Guaranteed safety timeout (6.2s max) to prevent any stuck state on page reload
      this.introTimeoutId = setTimeout(() => {
        if (this.state === 'initializing' || this.state === 'playing') {
          console.warn('[Intro] Safety timeout reached, completing intro');
          this.finishIntro(this.particles.length > 0 ? 'completed' : 'fallback');
        }
      }, 6200);

      try {
        if (!this.ctx) {
          throw new Error('Canvas 2D context unavailable');
        }

        if (!this.image.complete || this.image.naturalWidth === 0) {
          await Promise.race([
            this.image.decode().catch(() => {}),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image decode timeout')), 2800))
          ]).catch(() => {});
        }

        this.resize();
        this.buildParticleData();
        this.setupPointer();

        if (!this.particles || this.particles.length === 0) {
          throw new Error('No particles generated from portrait image');
        }

        this.startIntro();
      } catch (err) {
        console.warn('[Intro] Failed to initialize particle intro:', err.message);
        this.finishIntro('fallback');
      }
    }

    async prepareBackgroundParticles() {
      try {
        if (!this.image.complete || this.image.naturalWidth === 0) {
          await this.image.decode().catch(() => {});
        }
        this.resize();
        this.buildParticleData();
        this.setupPointer();
        if (this.particles.length > 0) {
          this.setProgress(0);
        }
      } catch (e) {
        // Fallback remains clean
      }
    }

    transitionTo(nextState) {
      this.state = nextState;
      if (nextState === 'completed' || nextState === 'skipped' || nextState === 'fallback') {
        document.body.classList.remove('is-intro');
        introActive = false;
        this.isIntro = false;
      }
    }

    resize() {
      const hero = this.canvas.parentElement || document.getElementById('top') || document.body;
      const rect = hero.getBoundingClientRect();
      const width = hero.offsetWidth || rect.width || window.innerWidth;
      const height = hero.offsetHeight || rect.height || window.innerHeight;
      this.bounds = { width, height };

      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      if (isMobile) {
        const isSmall = width <= 360;
        this.frameSize = isSmall
          ? Math.min(width * 0.65, 220)
          : Math.min(width * 0.68, Math.max(220, height * 0.35), 275);
      } else if (isTablet) {
        this.frameSize = Math.min(width * 0.78, height * 0.80, 720);
      } else {
        // Desktop: Substantially enlarge portrait to 78%–90% usable hero height
        this.frameSize = Math.min(width * 0.82, Math.max(540, height * 0.88));
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (this.particles.length > 0) {
        this.buildParticleData();
        if (!this.isIntro) this.render();
      }
    }

    sampleText(text, fontSize, trackingRatio, canvasWidth, canvasHeight, centerY) {
      const offscreen = document.createElement('canvas');
      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;
      const ctx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!ctx) return [];

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `900 ${fontSize}px "Manrope", -apple-system, sans-serif`;
      ctx.textBaseline = 'middle';

      const chars = [...text];
      const tracking = fontSize * trackingRatio;
      const widths = chars.map(ch => ctx.measureText(ch).width);
      const totalWidth = widths.reduce((sum, w) => sum + w, 0) + tracking * (chars.length - 1);

      let curX = (canvasWidth - totalWidth) / 2;
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], curX, centerY);
        curX += widths[i] + tracking;
      }

      const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
      const step = window.innerWidth <= 768 ? 3.0 : 3.4;
      const points = [];

      const minY = Math.max(0, Math.floor(centerY - fontSize * 0.85));
      const maxY = Math.min(canvasHeight, Math.ceil(centerY + fontSize * 0.85));
      const minX = Math.max(0, Math.floor((canvasWidth - totalWidth) / 2 - 20));
      const maxX = Math.min(canvasWidth, Math.ceil((canvasWidth + totalWidth) / 2 + 20));

      for (let y = minY; y < maxY; y += step) {
        const iy = Math.round(y);
        for (let x = minX; x < maxX; x += step) {
          const ix = Math.round(x);
          const idx = (iy * canvasWidth + ix) * 4;
          const a = imgData[idx + 3];
          if (a > 90) {
            points.push({ x: ix, y: iy, a: a / 255 });
          }
        }
      }

      return points;
    }

    buildParticleData() {
      const { width, height } = this.bounds;
      const frameSize = this.frameSize;
      if (!this.image.naturalWidth) return;

      // 1. Sample Portrait Particles with high-density grid for crisp facial recognition
      const isMobile = window.innerWidth <= 768;
      const spacing = isMobile ? 2.8 : 2.4;
      const cols = Math.floor(frameSize / spacing);
      const rows = Math.floor(frameSize / spacing);

      const offscreen = document.createElement('canvas');
      offscreen.width = cols;
      offscreen.height = rows;
      const octx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!octx) return;

      const scale = Math.min(cols / this.image.naturalWidth, rows / this.image.naturalHeight);
      const imgW = this.image.naturalWidth * scale;
      const imgH = this.image.naturalHeight * scale;
      const offX = (cols - imgW) / 2;
      const offY = (rows - imgH) / 2;

      octx.drawImage(this.image, offX, offY, imgW, imgH);
      const imgData = octx.getImageData(0, 0, cols, rows).data;

      const portraitLeft = (width - frameSize) / 2;
      // Head in the 1254px image is at y=86 (6.85% of image height)
      // Position head comfortably below fixed navbar (74px) so face and silhouette are clearly visible
      const headOffset = frameSize * (86 / 1254);
      const targetHeadTop = isMobile ? 66 : Math.max(86, height * 0.10);
      let portraitTop = isMobile
        ? (targetHeadTop - headOffset)
        : (targetHeadTop - headOffset);
      if (!isMobile && portraitTop + frameSize > height - 8) {
        portraitTop = Math.max(80 - headOffset, height - frameSize - 8);
      }
      const centerX = portraitLeft + frameSize * 0.5;
      const centerY = portraitTop + frameSize * 0.45;

      const getAlpha = (cx, cy) => {
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return 0;
        return imgData[(cy * cols + cx) * 4 + 3] / 255;
      };

      const getLum = (cx, cy) => {
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return 0;
        const idx = (cy * cols + cx) * 4;
        return (0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]) / 255;
      };

      const portraitPoints = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4;
          const a = imgData[idx + 3] / 255;
          if (a < 0.12) continue;

          const lum = (0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]) / 255;
          if (lum < 0.035) continue;

          const originX = portraitLeft + (x + 0.5) * spacing;
          const originY = portraitTop + (y + 0.5) * spacing;

          // 4-neighbor contrast analysis to identify fine facial features (eyes, nose, smile, jawline)
          const isEdge =
            getAlpha(x - 1, y) < 0.2 || getAlpha(x + 1, y) < 0.2 ||
            getAlpha(x, y - 1) < 0.2 || getAlpha(x, y + 1) < 0.2 ||
            Math.abs(lum - getLum(x - 1, y)) > 0.15 ||
            Math.abs(lum - getLum(x + 1, y)) > 0.15 ||
            Math.abs(lum - getLum(x, y - 1)) > 0.15 ||
            Math.abs(lum - getLum(x, y + 1)) > 0.15;

          let color;
          let alpha;
          let size;
          const rand = hash(x, y, 7);

          if (lum >= 0.68) {
            color = rand > 0.35 ? '#F4F7FC' : '#FFFFFF';
            alpha = 0.96;
            size = spacing * 0.90;
          } else if (lum >= 0.44) {
            color = (isEdge || rand > 0.55) ? '#A8D2FF' : '#E4ECF8';
            alpha = 0.88;
            size = spacing * 0.84;
          } else if (lum >= 0.22) {
            color = isEdge ? '#4F8CFF' : (rand > 0.5 ? '#7A96BA' : '#C4CBD6');
            alpha = 0.78;
            size = spacing * 0.76;
          } else if (lum >= 0.08) {
            color = isEdge ? '#3E7CE8' : (rand > 0.5 ? '#24344D' : '#182436');
            alpha = 0.55;
            size = spacing * 0.68;
          } else {
            color = '#0E1724';
            alpha = 0.35;
            size = spacing * 0.58;
          }

          portraitPoints.push({
            x, y,
            portraitX: originX,
            portraitY: originY,
            color, alpha, size,
            lum, isEdge,
            isAmbient: false
          });
        }
      }

      // Add ambient background particles distributed across the full viewport to keep space alive
      const ambientCount = isMobile ? 350 : 700;
      for (let a = 0; a < ambientCount; a++) {
        const ax = (hash(a, 77, 101) * 1.04 - 0.02) * width;
        const ay = (hash(a, 83, 103) * 1.04 - 0.02) * height;
        const h = hash(a, 89, 107);
        portraitPoints.push({
          x: -1, y: -1,
          portraitX: ax,
          portraitY: ay,
          color: h > 0.6 ? '#79A9FF' : (h > 0.3 ? '#A8D2FF' : '#5A7599'),
          alpha: 0.22 + h * 0.25,
          size: spacing * (0.55 + h * 0.35),
          lum: 0.3,
          isEdge: false,
          isAmbient: true
        });
      }

      // 2. Sample Name & Title Typography
      const nameFontSize = isMobile ? Math.min(width * 0.082, 36) : Math.min(width * 0.052, 64);
      const nameCenterY = height * 0.48;
      const namePoints = this.sampleText(NAME_TEXT, nameFontSize, 0.12, width, height, nameCenterY);

      const measuredTitleSize = fitPortfolioHeading();
      const titleFontSize = isMobile
        ? Math.min(measuredTitleSize || 50, width * 0.132, 50)
        : (measuredTitleSize || Math.min(width * 0.135, 185));
      const titleCenterY = height * 0.48;
      const titlePoints = this.sampleText(PORTFOLIO_TEXT, titleFontSize, -0.045, width, height, titleCenterY);

      // Settle Y aligned with DOM heading bottom: clamp(165px, 21.5vh, 220px)
      const domBottom = isMobile ? 145 : Math.max(165, Math.min(220, height * 0.215));
      this.titleSettleY = isMobile
        ? (portraitTop + frameSize * 0.88)
        : (height - domBottom - titleFontSize * 0.38);
      this.titleCenterY = titleCenterY;

      // 3. Unify into full-viewport continuous particle simulation
      const N = portraitPoints.length;
      const particles = [];

      for (let i = 0; i < N; i++) {
        const pt = portraitPoints[i];
        const h1 = hash(i, pt.x, 11);
        const h2 = hash(i, pt.y, 23);
        const h3 = hash(pt.x, i, 37);
        const h4 = hash(pt.y, i, 43);
        const depth = 0.45 + h3 * 0.75; // 3D depth and parallax weight

        // Edge-to-edge initial viewport distribution (Phase 0) — NO empty margins or central cluster
        const initX = (h1 * 1.06 - 0.03) * width;
        const initY = (h2 * 1.06 - 0.03) * height;

        // Name Target (Phase 1)
        let nameX, nameY;
        let isNameCore = false;
        if (namePoints.length > 0 && i < namePoints.length * 1.4 && !pt.isAmbient) {
          const np = namePoints[i % namePoints.length];
          const jitter = (h1 - 0.5) * (i >= namePoints.length ? 1.8 : 0.4);
          nameX = np.x + jitter;
          nameY = np.y + (h2 - 0.5) * (i >= namePoints.length ? 1.8 : 0.4);
          isNameCore = true;
        } else {
          // Edge-to-edge ambient distribution during name phase (fills entire screen)
          nameX = (h3 * 1.06 - 0.03) * width;
          nameY = (h4 * 1.06 - 0.03) * height;
        }

        // Fluid Dissolve Burst Target (Phase 2) — launches outward into full screen
        const burstAngle = Math.atan2(nameY - nameCenterY, nameX - centerX) + (h1 - 0.5) * 1.8;
        const burstDist = 70 + Math.pow(h2, 1.25) * Math.max(width, height) * 0.5;
        let burstX = nameX + Math.cos(burstAngle) * burstDist;
        let burstY = nameY + Math.sin(burstAngle) * burstDist;
        burstX = Math.max(-30, Math.min(width + 30, burstX));
        burstY = Math.max(-30, Math.min(height + 30, burstY));

        // Title Target (Phase 3)
        let titleX, titleY;
        let isTitleCore = false;
        if (titlePoints.length > 0 && i < titlePoints.length * 1.45 && !pt.isAmbient) {
          const tp = titlePoints[i % titlePoints.length];
          const jitter = (h3 - 0.5) * (i >= titlePoints.length ? 1.8 : 0.4);
          titleX = tp.x + jitter;
          titleY = tp.y + (h4 - 0.5) * (i >= titlePoints.length ? 1.8 : 0.4);
          isTitleCore = true;
        } else {
          // Edge-to-edge ambient distribution during title phase
          titleX = (h1 * 1.06 - 0.03) * width;
          titleY = (h2 * 1.06 - 0.03) * height;
        }

        // Dynamic Full-Screen Flow Position (Phase 4) — dynamic vector field across full screen
        const flowBaseX = (h2 * 1.06 - 0.03) * width;
        const flowBaseY = (h3 * 1.06 - 0.03) * height;
        const flowAngle = Math.sin(flowBaseY * 0.0035 + h1 * 6.28) * 2.8 + Math.cos(flowBaseX * 0.0035 + h4 * 6.28) * 2.2;
        const flowDist = (60 + h3 * 140) * depth;
        let flowX = flowBaseX + Math.cos(flowAngle) * flowDist;
        let flowY = flowBaseY + Math.sin(flowAngle) * flowDist;
        flowX = Math.max(-40, Math.min(width + 40, flowX));
        flowY = Math.max(-40, Math.min(height + 40, flowY));

        // Scroll Dispersion Targets (Post-intro scroll engine)
        const normX = (pt.portraitX - centerX) / (frameSize * 0.5);
        const normY = (pt.portraitY - centerY) / (frameSize * 0.5);
        const distCenter = Math.hypot(normX, normY);
        const dome = Math.sqrt(Math.max(0, 1 - Math.min(1, distCenter ** 2)));
        const bulgeX = normX * dome * 36;
        const bulgeY = normY * dome * 36;

        const scrollAngle = Math.atan2(normY, normX) + (h1 - 0.5) * 1.5;
        const scrollDist = 50 + Math.pow(h2, 1.45) * Math.max(width * 0.55, height * 0.65);
        const scrollLift = -(0.12 + 0.38 * h3) * height;
        let targetX = centerX + Math.cos(scrollAngle) * scrollDist * 1.25;
        let targetY = centerY + Math.sin(scrollAngle) * scrollDist * 0.80 + scrollLift;
        targetX = Math.max(12, Math.min(width - 12, targetX));
        targetY = Math.max(12, Math.min(height - 12, targetY));

        const scatterX = targetX - pt.portraitX;
        const scatterY = targetY - pt.portraitY;
        const distFromCenter = Math.hypot((targetX - centerX) / (width * 0.5), (targetY - centerY) / (height * 0.5));
        const outerFalloff = Math.max(0.18, 1 - distFromCenter * 0.75);

        particles.push({
          initX, initY,
          nameX, nameY, isNameCore,
          burstX, burstY,
          titleX, titleY, isTitleCore,
          flowX, flowY,
          portraitX: pt.portraitX,
          portraitY: pt.portraitY,
          isAmbient: pt.isAmbient,
          isEdge: pt.isEdge,
          lum: pt.lum,
          bulgeX, bulgeY,
          scatterX, scatterY,
          outerFalloff,
          color: pt.color,
          alpha: pt.alpha,
          size: pt.size,
          depth,
          h1, h2, h3, h4,
          scrollStart: h3 * 0.10,
          scrollEnd: 0.44 + h4 * 0.22
        });
      }

      this.particles = particles;
    }

    startIntro() {
      if (this.state === 'completed' || this.state === 'skipped' || this.state === 'fallback') return;
      this.state = 'playing';
      this.isIntro = true;
      document.body.classList.add('is-intro');
      introActive = true;
      const startTime = performance.now();

      const loop = (now) => {
        if (!this.isIntro || this.state !== 'playing') return;
        const elapsed = now - startTime;
        this.renderIntro(elapsed);

        if (elapsed < 5800) {
          this.introAnimId = requestAnimationFrame(loop);
        } else {
          this.finishIntro('completed');
        }
      };

      this.introAnimId = requestAnimationFrame(loop);
    }

    renderIntro(elapsed) {
      const ctx = this.ctx;
      const { width, height } = this.bounds;
      ctx.clearRect(0, 0, width, height);

      const titleSettleY = this.titleSettleY;
      const titleCenterY = this.titleCenterY;
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      const N = this.particles.length;

      // Color tokens for zero-allocation rendering
      const COLOR_WHITE = '#FFFFFF';
      const COLOR_PEARL = '#F4F7FC';
      const COLOR_ICY = '#A8D2FF';
      const COLOR_ELECTRIC = '#4F8CFF';
      const COLOR_BLUE_GLOW = '#79A9FF';
      const COLOR_SLATE = '#6A88AE';

      for (let i = 0; i < N; i++) {
        const pt = this.particles[i];
        let x, y, curColor, curAlpha, curSize;

        // Subtle ambient harmonic drift across all phases
        const driftX = Math.sin(elapsed * 0.0016 + pt.h1 * 6.28) * 12 * pt.depth;
        const driftY = Math.cos(elapsed * 0.0014 + pt.h2 * 6.28) * 10 * pt.depth;

        if (elapsed < 400) {
          // PHASE 0: 0–400ms — Full Viewport Ignition (edge-to-edge glowing starry field)
          const p = clamp01(elapsed / 400);
          x = pt.initX + driftX;
          y = pt.initY + driftY;
          curColor = pt.h1 > 0.6 ? COLOR_PEARL : (pt.h2 > 0.4 ? COLOR_ICY : COLOR_BLUE_GLOW);
          curAlpha = Math.min(0.85, p * (0.22 + pt.depth * 0.5));
          curSize = pt.size * (0.6 + 0.4 * pt.depth);

        } else if (elapsed < 1500) {
          // PHASE 1: 400–1,500ms — "SUSATWIK MANURI" forms & holds; ambient fills entire screen
          const rawP = clamp01((elapsed - 400) / 750);
          const localP = clamp01((rawP - pt.h1 * 0.18) / 0.82);
          const eased = smoothstep(localP);

          if (pt.isNameCore) {
            x = pt.initX + (pt.nameX - pt.initX) * eased;
            y = pt.initY + (pt.nameY - pt.initY) * eased;
            curColor = pt.h2 > 0.35 ? COLOR_WHITE : COLOR_ICY;
            curAlpha = Math.min(0.98, 0.2 + eased * 0.78);
            curSize = pt.size * (0.85 + 0.2 * eased);
          } else {
            // Ambient particles distributed edge-to-edge and top-to-bottom
            x = pt.initX + (pt.nameX - pt.initX) * (eased * 0.35) + driftX;
            y = pt.initY + (pt.nameY - pt.initY) * (eased * 0.35) + driftY;
            curColor = pt.h3 > 0.5 ? COLOR_ICY : (pt.h4 > 0.5 ? COLOR_BLUE_GLOW : COLOR_SLATE);
            curAlpha = Math.min(0.65, 0.25 + 0.35 * pt.depth);
            curSize = pt.size * (0.6 + 0.3 * pt.depth);
          }

        } else if (elapsed < 2150) {
          // PHASE 2: 1,500–2,150ms — Fluid Kinetic Dissolution across full viewport
          const rawP = clamp01((elapsed - 1500) / 650);
          const localP = clamp01((rawP - pt.h2 * 0.20) / 0.80);
          const eased = smoothstep(localP);

          if (pt.isNameCore) {
            x = pt.nameX + (pt.burstX - pt.nameX) * eased + driftX * 0.5;
            y = pt.nameY + (pt.burstY - pt.nameY) * eased + driftY * 0.5;
            curColor = pt.h1 > 0.4 ? COLOR_PEARL : COLOR_ICY;
            curAlpha = Math.max(0.35, (1 - eased * 0.4) * 0.95);
            curSize = pt.size * (1 - 0.2 * eased);
          } else {
            x = pt.nameX + (pt.burstX - pt.nameX) * (eased * 0.5) + driftX;
            y = pt.nameY + (pt.burstY - pt.nameY) * (eased * 0.5) + driftY;
            curColor = pt.h2 > 0.5 ? COLOR_BLUE_GLOW : COLOR_SLATE;
            curAlpha = Math.min(0.70, 0.3 + 0.3 * pt.depth);
            curSize = pt.size * (0.6 + 0.3 * pt.depth);
          }

        } else if (elapsed < 3300) {
          // PHASE 3: 2,150–3,300ms — "PORTFOLIO" forms & holds; full screen particles live
          const rawP = clamp01((elapsed - 2150) / 750);
          const localP = clamp01((rawP - pt.h3 * 0.18) / 0.82);
          const eased = smoothstep(localP);

          if (pt.isTitleCore) {
            x = pt.burstX + (pt.titleX - pt.burstX) * eased;
            y = pt.burstY + (pt.titleY - pt.burstY) * eased;
            curColor = pt.h3 > 0.3 ? COLOR_WHITE : (pt.h4 > 0.5 ? COLOR_PEARL : COLOR_ICY);
            curAlpha = Math.min(0.98, 0.3 + eased * 0.68);
            curSize = pt.size * (0.88 + 0.18 * eased);
          } else {
            x = pt.burstX + (pt.titleX - pt.burstX) * (eased * 0.4) + driftX;
            y = pt.burstY + (pt.titleY - pt.burstY) * (eased * 0.4) + driftY;
            curColor = pt.h1 > 0.5 ? COLOR_BLUE_GLOW : (pt.h2 > 0.5 ? COLOR_ICY : COLOR_SLATE);
            curAlpha = Math.min(0.65, 0.25 + 0.35 * pt.depth);
            curSize = pt.size * (0.6 + 0.3 * pt.depth);
          }

        } else if (elapsed < 4000) {
          // PHASE 4: 3,300–4,000ms — Dynamic Full-Screen Flow across the entire viewport
          const p = clamp01((elapsed - 3300) / 700);
          const eased = smoothstep(p);
          const titleShiftY = (titleSettleY - titleCenterY) * eased;

          const startX = pt.titleX;
          const startY = pt.titleY + (pt.isTitleCore ? titleShiftY : 0);

          x = startX + (pt.flowX - startX) * eased + driftX;
          y = startY + (pt.flowY - startY) * eased + driftY;

          if (pt.isTitleCore) {
            curColor = eased < 0.6 ? COLOR_PEARL : (pt.h1 > 0.4 ? COLOR_WHITE : COLOR_ICY);
            curAlpha = Math.max(0.4, 0.95 - eased * 0.35);
            curSize = pt.size * (1 - 0.15 * eased);
          } else {
            curColor = pt.h2 > 0.45 ? COLOR_ELECTRIC : (pt.h3 > 0.5 ? COLOR_ICY : COLOR_BLUE_GLOW);
            curAlpha = Math.min(0.85, 0.35 + 0.45 * eased * pt.depth);
            curSize = pt.size * (0.7 + 0.3 * pt.depth);
          }

        } else {
          // PHASE 5 & 6: 4,000–5,800ms — Inward Convergence along curved streamlines & Grand Hold
          const pReconstruct = clamp01((elapsed - 4000) / 1250);
          const distFromCenter = Math.hypot(pt.flowX - centerX, pt.flowY - centerY);
          const maxDist = Math.max(width, height) * 0.7;
          // Stagger arrival naturally by distance and particle seed
          const delay = (pt.h4 * 0.16) + (distFromCenter / maxDist) * 0.12;
          const localP = clamp01((pReconstruct - delay) / (1 - delay));

          // Cinematic smoothstep easing
          const eased = smoothstep(localP);

          if (localP < 1) {
            // Trajectory in flight along curved streamlines
            const dx = pt.portraitX - pt.flowX;
            const dy = pt.portraitY - pt.flowY;
            const totalDist = Math.hypot(dx, dy);

            // Perpendicular vector for spiral streamline curvature
            const perpX = -dy / (totalDist || 1);
            const perpY = dx / (totalDist || 1);

            // Arc peaks in mid-flight and settles to 0 upon reaching target
            const arcFactor = Math.sin(localP * Math.PI) * (1 - localP * 0.25);
            const arc = arcFactor * (pt.h1 - 0.5) * Math.min(240, totalDist * 0.42);

            x = pt.flowX + dx * eased + perpX * arc;
            y = pt.flowY + dy * eased + perpY * arc;

            // Smooth crossfade from energetic cyan/blue glow to authentic portrait tone
            if (eased > 0.7) {
              curColor = pt.color;
              curAlpha = Math.max(0.25, pt.alpha * (0.6 + 0.4 * eased));
              curSize = pt.size * (0.8 + 0.2 * eased);
            } else {
              curColor = pt.isEdge ? COLOR_ICY : (pt.lum > 0.5 ? COLOR_PEARL : COLOR_ELECTRIC);
              curAlpha = Math.max(0.3, 0.85 * (1 - eased * 0.2));
              curSize = pt.size * (0.75 + 0.25 * pt.depth);
            }
          } else {
            // Arrived and Holding: Exact portrait position!
            // Subtle breathing luminescence
            const breathe = Math.sin(elapsed * 0.002 + pt.h1 * 3.14) * 0.05;
            x = pt.portraitX;
            y = pt.portraitY;
            curColor = pt.color;
            curAlpha = Math.min(1, Math.max(0.18, pt.alpha + breathe));
            curSize = pt.size;
          }
        }

        ctx.fillStyle = curColor;
        ctx.globalAlpha = curAlpha;
        ctx.fillRect(x, y, curSize, curSize);
      }

      // At 5,200ms: smoothly reveal navbar, hero caption, and explore action
      if (elapsed >= 5200 && document.body.classList.contains('is-intro')) {
        document.body.classList.remove('is-intro');
      }

      ctx.globalAlpha = 1;
    }

    skipIntro() {
      this.finishIntro('skipped');
    }

    finishIntro(targetState = 'completed') {
      if (this.introTimeoutId) {
        clearTimeout(this.introTimeoutId);
        this.introTimeoutId = null;
      }
      if (this.introAnimId) {
        cancelAnimationFrame(this.introAnimId);
        this.introAnimId = null;
      }

      this.transitionTo(targetState);
      this.isIntro = false;
      introActive = false;
      document.body.classList.remove('is-intro');
      document.body.style.overflow = '';

      if (this.state === 'fallback') {
        if (this.fallbackImage) {
          this.fallbackImage.style.display = 'block';
        }
      } else {
        if (this.fallbackImage) {
          this.fallbackImage.style.display = 'none';
        }
        // Initialize systems in their resting hero state
        this.setProgress(0);
      }

      if (!neuralSystem && aboutNeuralCanvas) {
        neuralSystem = new AboutNeuralCanvas(aboutNeuralCanvas);
      }

      updateScroll();
    }

    setupPointer() {
      const hero = document.getElementById('top');
      if (!hero) return;

      hero.addEventListener('pointermove', e => {
        if (reduceMotion || this.isIntro || this.progress > 0.05) {
          this.pointerActive = false;
          return;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.pointerX = e.clientX - rect.left;
        this.pointerY = e.clientY - rect.top;
        this.pointerActive = true;
        this.requestRender();
      }, { passive: true });

      hero.addEventListener('pointerleave', () => {
        this.pointerActive = false;
        this.requestRender();
      }, { passive: true });
    }

    setProgress(p) {
      if (this.isIntro) return;
      this.progress = Math.max(0, Math.min(1, p));
      this.render();
    }

    requestRender() {
      if (!this.renderAnimId && !this.isIntro) {
        this.renderAnimId = requestAnimationFrame(() => {
          this.renderAnimId = null;
          this.render();
        });
      }
    }

    render() {
      if (this.isIntro) return;
      const ctx = this.ctx;
      const { width, height } = this.bounds;
      const p = this.progress;
      ctx.clearRect(0, 0, width, height);

      const bulgeFactor = Math.sin(Math.min(1, p / 0.22) * Math.PI) * (1 - p);
      const isInteractive = this.pointerActive && p === 0;
      const radiusSq = 90 * 90;

      for (let i = 0; i < this.particles.length; i++) {
        const pt = this.particles[i];

        let x = pt.portraitX;
        let y = pt.portraitY;

        if (p > 0) {
          const t = Math.max(0, Math.min(1, (p - pt.scrollStart) / (pt.scrollEnd - pt.scrollStart)));
          const eased = smoothstep(t);
          x += pt.bulgeX * bulgeFactor + pt.scatterX * eased;
          y += pt.bulgeY * bulgeFactor + pt.scatterY * eased;
        }

        if (isInteractive) {
          const dx = x - this.pointerX;
          const dy = y - this.pointerY;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(Math.max(0.1, distSq));
            const force = (1 - dist / 90) * 14;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
          }
        }

        const tScale = p > pt.scrollStart ? Math.min(1, (p - pt.scrollStart) / (pt.scrollEnd - pt.scrollStart)) : 0;
        const curSize = pt.size * (1 - 0.32 * tScale);
        const curAlpha = pt.alpha * (1 - (1 - pt.outerFalloff) * tScale * 0.75);

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = curAlpha;
        ctx.fillRect(x, y, curSize, curSize);
      }

      ctx.globalAlpha = 1;
    }
  }

  // ==========================================================================
  // ABOUT SECTION NEURAL NETWORK MOTIF
  // ==========================================================================
  class AboutNeuralCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.nodes = [];
      this.revealProgress = 0;
      this.animId = null;
      this.isVisible = false;
      this.init();
      this.setupObserver();
    }

    init() {
      this.resize();
      this.createNodes();
    }

    setupObserver() {
      if (typeof IntersectionObserver !== 'undefined') {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible) {
              this.startLoop();
            } else {
              this.stopLoop();
            }
          });
        }, { threshold: 0.05 });
        this.observer.observe(this.canvas);
      } else {
        this.isVisible = true;
        this.startLoop();
      }
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
    }

    createNodes() {
      this.nodes = [];
      const count = window.innerWidth <= 768 ? 16 : 28;
      for (let i = 0; i < count; i++) {
        this.nodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: 1.2 + Math.random() * 1.6,
          isKeyNode: i < 5,
          glow: 0
        });
      }
    }

    setRevealProgress(p) {
      this.revealProgress = p;
    }

    startLoop() {
      if (this.animId || !this.isVisible) return;
      const render = () => {
        if (!document.hidden && !reduceMotion && this.isVisible) {
          this.update();
          this.draw();
          this.animId = requestAnimationFrame(render);
        } else {
          this.animId = null;
        }
      };
      this.animId = requestAnimationFrame(render);
    }

    stopLoop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    update() {
      const w = this.width;
      const h = this.height;
      for (const node of this.nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = w;
        if (node.x > w) node.x = 0;
        if (node.y < 0) node.y = h;
        if (node.y > h) node.y = 0;

        if (node.isKeyNode) {
          node.glow += (this.revealProgress - node.glow) * 0.1;
        }
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      const maxDist = 140;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i];
          const b = this.nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.12 * (0.4 + this.revealProgress * 0.6);
            ctx.strokeStyle = `rgba(79, 140, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const node of this.nodes) {
        const glowBoost = node.isKeyNode ? node.glow : 0;
        const alpha = 0.25 + glowBoost * 0.75;

        if (glowBoost > 0.1) {
          ctx.fillStyle = `rgba(79, 140, 255, ${glowBoost * 0.25})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * (2 + glowBoost * 2), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = glowBoost > 0.2 ? `rgba(244, 247, 252, ${alpha})` : `rgba(168, 210, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ==========================================================================
  // JOURNEY SECTION AMBIENT CANVAS (NEBULA PARTICLES & DELICATE FILAMENTS)
  // ==========================================================================
  class JourneyAmbientCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.isVisible = false;
      this.init();
      this.setupObserver();
    }

    init() {
      this.resize();
      this.createParticles();
    }

    setupObserver() {
      if (typeof IntersectionObserver !== 'undefined') {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible) {
              this.startLoop();
            } else {
              this.stopLoop();
            }
          });
        }, { threshold: 0.05 });
        this.observer.observe(this.canvas);
      } else {
        this.isVisible = true;
        this.startLoop();
      }
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
    }

    createParticles() {
      this.particles = [];
      const count = window.innerWidth <= 768 ? 12 : 24;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 0.8 + Math.random() * 1.5,
          alpha: 0.15 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    startLoop() {
      if (this.animId || !this.isVisible) return;
      const render = () => {
        if (!document.hidden && !reduceMotion && this.isVisible) {
          this.update();
          this.draw();
          this.animId = requestAnimationFrame(render);
        } else {
          this.animId = null;
        }
      };
      this.animId = requestAnimationFrame(render);
    }

    stopLoop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    update() {
      const w = this.width;
      const h = this.height;
      for (const pt of this.particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.phase += 0.02;
        if (pt.x < 0) pt.x = w;
        if (pt.x > w) pt.x = 0;
        if (pt.y < 0) pt.y = h;
        if (pt.y > h) pt.y = 0;
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      for (const pt of this.particles) {
        const pulsate = 0.7 + 0.3 * Math.sin(pt.phase);
        const curAlpha = pt.alpha * pulsate;
        ctx.fillStyle = `rgba(79, 140, 255, ${curAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ==========================================================================
  // JOURNEY TIMELINE SCROLL-SCRUBBED CONTROLLER
  // ==========================================================================
  // Normalized arc length positions of each milestone node along the undulating curve:
  // Node 0: 0.080, Node 1: 0.252, Node 2: 0.423, Node 3: 0.591, Node 4: 0.758, Node 5: 0.923
  const JOURNEY_NODE_FRACTIONS = [0.080, 0.252, 0.423, 0.591, 0.758, 0.923];

  function updateJourney(p) {
    if (reduceMotion) return;

    // Section Header: Visible by default upon entering viewport
    if (journeyHeader) {
      journeyHeader.style.opacity = '1';
      journeyHeader.style.transform = 'none';
    }

    // Phase 2: Path Draw in Lockstep (Progress window: 0.02 to 0.72)
    // pathProgress represents the drawn fraction of the SVG curve: 0 to 1.0
    const pathP = clamp01((p - 0.02) / 0.70);
    if (journeyPathCore && journeyPathLength > 0) {
      const dashoffset = journeyPathLength * (1 - pathP);
      journeyPathCore.style.strokeDashoffset = dashoffset.toFixed(1);
      if (journeyPathGlow) {
        journeyPathGlow.style.strokeDashoffset = dashoffset.toFixed(1);
      }
    }

    // Phase 3: Sequential Milestones Reveal (6 Milestones)
    // Tightly synchronized: Each node lights up at the exact moment the path endpoint reaches it,
    // and its year label + milestone card reveal in coordination.
    // The active path endpoint NEVER advances ahead of intermediate scroll progress!
    for (let i = 0; i < 6; i++) {
      const nodeThresh = JOURNEY_NODE_FRACTIONS[i];
      const nodeEl = journeyNodes[i];
      const cardEl = journeyCards[i];

      // Node & Year activation:
      // Pre-illumination halo as path approaches; solid glow & active state upon arrival
      if (nodeEl) {
        const nodeReach = clamp01((pathP - (nodeThresh - 0.035)) / 0.035);
        nodeEl.style.opacity = nodeReach.toFixed(3);
        if (pathP >= nodeThresh) {
          nodeEl.classList.add('is-active');
        } else {
          nodeEl.classList.remove('is-active');
        }
      }

      // Card emergence:
      // Emerges right as the path arrives at the node; once revealed, it remains 100% visible
      // Controls --card-y-offset so horizontal centering/anchors remain fully intact
      if (cardEl) {
        const cardP = clamp01((pathP - nodeThresh) / 0.065);
        cardEl.style.opacity = cardP.toFixed(3);
        cardEl.style.setProperty('--card-y-offset', `${((1 - cardP) * 18).toFixed(1)}px`);
      }
    }

    // Phase 4: Bottom Statistics Panel (Reveals smoothly from 0.72 to 0.84 as all cards settle,
    // and stays 100% visible with full counters until unpinning handoff at 1.0)
    if (journeyStats) {
      const statsP = clamp01((p - 0.72) / 0.12);
      journeyStats.style.opacity = statsP.toFixed(3);
      journeyStats.style.transform = `translateY(${((1 - statsP) * 8).toFixed(1)}px)`;
    }
  }

  // ==========================================================================
  // ACTIVE NAVBAR NAVIGATION CONTROLLER
  // ==========================================================================
  const TRACKED_SECTION_IDS = ['about', 'skills', 'journey', 'work', 'credentials', 'contact'];

  function setActiveNavLink(activeId) {
    if (!navMenu) return;
    const links = navMenu.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const targetId = href ? href.replace(/^#/, '') : '';
      const isActive = Boolean(activeId && targetId === activeId);

      if (isActive) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'location');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActiveNav() {
    if (!navMenu) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const winH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;

    // 1. Bottom of page check: activates Contact section reliably when scrolled to footer/bottom
    if (scrollY + winH >= docH - 60) {
      setActiveNavLink('contact');
      return;
    }

    // 2. Top of page check: hero section resting state (no navbar section active)
    if (scrollY < 120) {
      setActiveNavLink(null);
      return;
    }

    // 3. Primary section boundary tracking accounting for 74px fixed navbar height
    const threshold = Math.min(winH * 0.35, 240);
    let currentActiveId = null;

    for (const id of TRACKED_SECTION_IDS) {
      const section = document.getElementById(id);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) {
        currentActiveId = id;
        break;
      }
    }

    // 4. Secondary fallback: section with maximum visible height in active viewport area
    if (!currentActiveId) {
      let maxVisibleHeight = 0;
      const viewTop = 74;
      const viewBottom = winH * 0.75;
      for (const id of TRACKED_SECTION_IDS) {
        const section = document.getElementById(id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, viewTop);
        const visibleBottom = Math.min(rect.bottom, viewBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          currentActiveId = id;
        }
      }
    }

    if (currentActiveId) {
      setActiveNavLink(currentActiveId);
    }
  }

  // ==========================================================================
  // SCROLL-SYNCHRONIZED CONTROLLER (HANDOFF TARGET)
  // ==========================================================================
  function updateScroll() {
    updateActiveNav();

    if (reduceMotion || introActive) return;

    // 1. Hero Sticky Track Progress
    if (heroTrack && portraitSystem) {
      const rect = heroTrack.getBoundingClientRect();
      const winH = window.innerHeight || 1;
      const scrollDistance = heroTrack.offsetHeight - winH;
      const progress = scrollDistance > 0
        ? Math.max(0, Math.min(1, -rect.top / scrollDistance))
        : Math.max(0, Math.min(1, -rect.top / (winH * 0.75)));
      portraitSystem.setProgress(progress);

      // Hero Identity block stays 100% visible throughout hero scroll transition!
      // Anchored stably without disappearing or clipping.
      heroTrack.style.setProperty('--caption-opacity', '1');
      heroTrack.style.setProperty('--caption-offset-y', '0px');

      // Subtle, gentle title parallax
      const titleOffsetY = -Math.max(0, (progress - 0.40) / 0.60) * 20;
      heroTrack.style.setProperty('--title-scroll-y', `${titleOffsetY}px`);
    }

    // 2. 01 — About Section Progressive Reveal (Heading lines + Word-by-word paragraph)
    if (aboutSection) {
      const grid = aboutSection.querySelector('.about-grid') || aboutSection;
      const gridRect = grid.getBoundingClientRect();
      const winH = window.innerHeight;

      // Start reveal when the top of the About grid enters 78% of viewport height; complete when near top (8%)
      const startY = winH * 0.78;
      const endY = winH * 0.08;
      const scrollRange = Math.max(1, startY - endY);
      const aboutProgress = Math.max(0, Math.min(1, (startY - gridRect.top) / scrollRange));

      // Heading Line-by-Line Reveal (Progress window: 0.02 to 0.38)
      const lines = aboutLines || aboutSection.querySelectorAll('.reveal-line');
      const numLines = lines.length || 1;
      lines.forEach((line, index) => {
        const lineStart = 0.02 + (index / numLines) * 0.24;
        const lineEnd = lineStart + 0.16;
        const lineProg = Math.max(0, Math.min(1, (aboutProgress - lineStart) / (lineEnd - lineStart)));
        line.style.setProperty('--line-progress', lineProg.toFixed(3));
      });

      // Paragraph Word-by-Word Reveal (Progress window: 0.26 to 0.94)
      const words = aboutWords || aboutSection.querySelectorAll('.reveal-word');
      const numWords = words.length;
      if (numWords > 0) {
        const paraProg = Math.max(0, Math.min(1, (aboutProgress - 0.26) / 0.68));
        const feather = 1.8;
        const target = paraProg * (numWords + feather);
        for (let i = 0; i < numWords; i++) {
          const wordProg = Math.max(0, Math.min(1, (target - i) / feather));
          words[i].style.setProperty('--word-progress', wordProg.toFixed(3));
        }
      }

      // Portrait Card Smooth Scroll Reveal (Progress window: 0.02 to 0.42)
      const portraitCard = aboutSection.querySelector('.about-portrait-card');
      if (portraitCard) {
        const portraitProg = Math.max(0, Math.min(1, (aboutProgress - 0.02) / 0.40));
        portraitCard.style.setProperty('--portrait-progress', portraitProg.toFixed(3));
      }

      if (neuralSystem) {
        neuralSystem.setRevealProgress(aboutProgress);
      }
    }

    // 3. 03 — Journey Section Progressive Reveal (Scroll-Scrubbed Cinematic Timeline)
    if (journeyTrack) {
      const rect = journeyTrack.getBoundingClientRect();
      const scrollDistance = journeyTrack.offsetHeight - window.innerHeight;
      if (scrollDistance > 0) {
        const journeyProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
        updateJourney(journeyProgress);
      }
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & INITIALIZATION
  // ==========================================================================
  function init() {
    // Initial typography measurement & safe responsive fitting
    fitPortfolioHeading();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => fitPortfolioHeading());
    }

    // Skip intro button & Escape key handling
    skipButton?.addEventListener('click', () => {
      portraitSystem?.finishIntro();
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        portraitSystem?.finishIntro();
      }
    });

    // Mobile Navigation Toggle
    menuToggle?.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu?.classList.toggle('open', !isOpen);
    });

    navMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.slice(1);
          if (TRACKED_SECTION_IDS.includes(targetId)) {
            setActiveNavLink(targetId);
          }
        }
      });
    });

    // Home Button & Brand Navigation Controller
    const brandLink = document.querySelector('.site-header .brand');
    const footerBrandLink = document.querySelector('.footer-brand');
    const footerTopBtn = document.querySelector('.footer-top-btn');

    function handleHomeNavigation(e) {
      if (e) {
        e.preventDefault();
      }

      // If intro is currently running or initializing, cleanly finish it to completed state
      if (portraitSystem && (portraitSystem.isIntro || portraitSystem.state === 'initializing' || portraitSystem.state === 'playing')) {
        portraitSystem.finishIntro('completed');
      }

      // Clear any active navbar link when returning to hero
      setActiveNavLink(null);

      // Smooth scroll directly to the top of the viewport (top: 0) without any 86px offset
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      // Update URL hash cleanly
      if (window.location.hash !== '#top') {
        history.pushState(null, '', '#top');
      }

      // Ensure hero resting progress is 0
      if (portraitSystem && portraitSystem.state !== 'fallback') {
        portraitSystem.setProgress(0);
      }
    }

    brandLink?.addEventListener('click', handleHomeNavigation);
    footerBrandLink?.addEventListener('click', handleHomeNavigation);
    footerTopBtn?.addEventListener('click', handleHomeNavigation);

    // Browser History Navigation (Back / Forward)
    window.addEventListener('popstate', () => {
      const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
      if (!hash || hash === 'top') {
        handleHomeNavigation();
        setActiveNavLink(null);
      } else {
        if (portraitSystem && (portraitSystem.isIntro || portraitSystem.state === 'playing')) {
          portraitSystem.finishIntro('completed');
        }
        const target = document.getElementById(hash);
        target?.scrollIntoView({ behavior: 'smooth' });
        if (TRACKED_SECTION_IDS.includes(hash)) {
          setActiveNavLink(hash);
        }
      }
    });

    // Set initial active navigation state on page load
    const initialHash = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
    if (initialHash && TRACKED_SECTION_IDS.includes(initialHash)) {
      setActiveNavLink(initialHash);
    } else {
      updateActiveNav();
    }

    // Scroll listener with RAF throttling
    let scrollScheduled = false;
    window.addEventListener('scroll', () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(() => {
          scrollScheduled = false;
          updateScroll();
          updateActiveNav();
        });
      }
    }, { passive: true });

    // Resize handler with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        fitPortfolioHeading();
        portraitSystem?.resize();
        neuralSystem?.resize();
        journeyAmbientSystem?.resize();
        if (journeyPathCore) {
          try {
            journeyPathLength = journeyPathCore.getTotalLength() || journeyPathLength;
          } catch (e) {}
        }
        updateScroll();
      }, 100);
    }, { passive: true });

    // Cache About reveal elements
    aboutLines = aboutSection?.querySelectorAll('.reveal-line');
    aboutWords = aboutSection?.querySelectorAll('.reveal-word');

    // Initialize Journey elements & SVG trajectory length
    journeyTrack = document.getElementById('journey');
    if (journeyTrack) {
      journeyHeader = journeyTrack.querySelector('.journey-header');
      journeyPathCore = document.getElementById('journey-path-core');
      journeyPathGlow = document.getElementById('journey-path-glow');
      journeyNodes = Array.from(journeyTrack.querySelectorAll('.journey-node-group'));
      journeyCards = Array.from(journeyTrack.querySelectorAll('.journey-card'));
      journeyStats = document.getElementById('journey-stats-bar');

      if (journeyPathCore) {
        try {
          const len = journeyPathCore.getTotalLength();
          if (len && len > 0) journeyPathLength = len;
        } catch (e) {
          journeyPathLength = 1400;
        }
        journeyPathCore.style.strokeDasharray = `${journeyPathLength}`;
        journeyPathCore.style.strokeDashoffset = `${journeyPathLength}`;
        if (journeyPathGlow) {
          journeyPathGlow.style.strokeDasharray = `${journeyPathLength}`;
          journeyPathGlow.style.strokeDashoffset = `${journeyPathLength}`;
        }
      }

      const ambientCanvas = document.getElementById('journey-ambient-canvas');
      if (ambientCanvas) {
        journeyAmbientSystem = new JourneyAmbientCanvas(ambientCanvas);
      }
    }

    if (reduceMotion) {
      aboutLines?.forEach(line => line.style.setProperty('--line-progress', '1'));
      aboutWords?.forEach(word => word.style.setProperty('--word-progress', '1'));
      aboutSection?.querySelector('.about-portrait-card')?.style.setProperty('--portrait-progress', '1');

      if (journeyTrack) {
        if (journeyHeader) {
          journeyHeader.style.opacity = '1';
          journeyHeader.style.transform = 'none';
        }
        if (journeyPathCore) journeyPathCore.style.strokeDashoffset = '0';
        if (journeyPathGlow) journeyPathGlow.style.strokeDashoffset = '0';
        journeyNodes.forEach(node => {
          node.style.opacity = '1';
          node.classList.add('is-active');
        });
        journeyCards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
          card.style.setProperty('--card-y-offset', '0px');
        });
        if (journeyStats) {
          journeyStats.style.opacity = '1';
          journeyStats.style.transform = 'none';
        }
      }
    }

    // Initialize Selected Work Filters & Dedicated Projects Navigation
    setupProjectFilters();
    setupProjectsNavigation();
    setupCredentialFilters();

    // Initialize Digital ID Badge 3D Tilt Parallax
    setupBadgeTilt();

    // Initialize Contact Form & Footer
    setupContactForm();

    // Start Unified Particle System
    if (portraitCanvas && portraitFallback) {
      portraitSystem = new PortraitParticleSystem(portraitCanvas, portraitFallback);
    }
  }

  // ==========================================================================
  // DIGITAL ID BADGE 3D PARALLAX CONTROLLER
  // ==========================================================================
  function setupBadgeTilt() {
    const badgeScene = document.getElementById('about-badge-scene');
    const badgeCard = document.getElementById('id-badge-card');
    if (!badgeScene || !badgeCard) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animId = null;

    function renderTilt() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      badgeCard.style.setProperty('--badge-tilt-x', `${currentX.toFixed(2)}deg`);
      badgeCard.style.setProperty('--badge-tilt-y', `${currentY.toFixed(2)}deg`);

      if (isHovering || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        animId = requestAnimationFrame(renderTilt);
      } else {
        badgeCard.style.setProperty('--badge-tilt-x', '0deg');
        badgeCard.style.setProperty('--badge-tilt-y', '0deg');
        animId = null;
      }
    }

    badgeScene.addEventListener('pointermove', e => {
      if (reduceMotion || window.innerWidth < 768) return;
      const rect = badgeScene.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = -y * 8;
      targetY = x * 8;
      isHovering = true;
      if (!animId) {
        animId = requestAnimationFrame(renderTilt);
      }
    }, { passive: true });

    badgeScene.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      isHovering = false;
      if (!animId) {
        animId = requestAnimationFrame(renderTilt);
      }
    }, { passive: true });
  }

  // ==========================================================================
  // DEDICATED PROJECTS PAGE NAVIGATION CONTROLLER
  // ==========================================================================
  function setupProjectsNavigation() {
    const backBtns = document.querySelectorAll('#back-to-portfolio-btn, .back-to-portfolio-bottom-btn');
    backBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.history.length > 1 && document.referrer && (document.referrer.includes('index.html') || document.referrer.endsWith('/'))) {
          e.preventDefault();
          window.history.back();
        }
      });
    });
  }

  // ==========================================================================
  // SELECTED WORK (PROJECTS) CATEGORY FILTER CONTROLLER
  // ==========================================================================
  function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.work-filter-btn');
    const projectCards = Array.from(document.querySelectorAll('.project-card'));

    if (!filterBtns.length || !projectCards.length) return;

    // Card-level click handler: clicking card opens its verified demo or repository in a new tab
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const targetUrl = card.getAttribute('data-demo-url') || card.getAttribute('data-repo-url');
        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });

    function updateCardVisibility(filter) {
      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.98)';
          setTimeout(() => {
            const activeFilter = document.querySelector('.work-filter-btn.is-active')?.getAttribute('data-filter') || 'all';
            if (activeFilter !== 'all' && !categories.includes(activeFilter)) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        updateCardVisibility(filter);
      });
    });
  }

  // ==========================================================================
  // ACHIEVEMENTS, LEADERSHIP & CERTIFICATIONS CATEGORY FILTER CONTROLLER
  // ==========================================================================
  function setupCredentialFilters() {
    const filterBtns = document.querySelectorAll('.cred-filter-btn');
    const credCards = Array.from(document.querySelectorAll('.cred-item'));

    if (!filterBtns.length || !credCards.length) return;

    function updateCredVisibility(filter) {
      credCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.98)';
          setTimeout(() => {
            const activeFilter = document.querySelector('.cred-filter-btn.is-active')?.getAttribute('data-filter') || 'all';
            if (activeFilter !== 'all' && !categories.includes(activeFilter)) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        updateCredVisibility(filter);
      });
    });
  }

  // ==========================================================================
  // FUNCTIONAL CONTACT FORM & FOOTER CONTROLLER
  // ==========================================================================
  function setupContactForm() {
    // Dynamic Year in Footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    // Scroll to Form Button
    const focusFormBtn = document.getElementById('btn-focus-form');
    const nameInput = document.getElementById('contact-name');
    focusFormBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const formEl = document.getElementById('contact-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => nameInput?.focus(), 400);
      }
    });

    const form = document.getElementById('contact-form');
    if (!form) return;

    const emailInput = document.getElementById('contact-email');
    const reasonSelect = document.getElementById('contact-reason');
    const customSelect = document.getElementById('custom-reason-select');
    const customTrigger = document.getElementById('custom-select-trigger');
    const customLabel = document.getElementById('custom-select-label');
    const customOptionsList = document.getElementById('custom-select-options');
    const customOptions = Array.from(customOptionsList?.querySelectorAll('.custom-select-option') || []);
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const urlInput = document.getElementById('contact-url');
    const gotchaInput = document.getElementById('contact-bot-trap');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusBox = document.getElementById('form-status');

    // Success Celebration Modal Elements
    const successModal = document.getElementById('contact-success-modal');
    const modalCloseIcon = document.getElementById('modal-close-icon');
    const modalBtnClose = document.getElementById('modal-btn-close');

    // Message Character Counter
    messageInput?.addEventListener('input', () => {
      const len = messageInput.value.length;
      if (charCount) {
        charCount.textContent = `${len} / 2000`;
        charCount.style.color = len > 1950 ? '#FF6B6B' : (len >= 20 ? 'var(--silver)' : 'var(--silver-muted)');
      }
    });

    // Helper: Show field error
    function setFieldError(field, errorId, msg) {
      const errEl = document.getElementById(errorId);
      const group = field?.closest('.form-group');
      if (errEl) errEl.textContent = msg || '';
      if (group) {
        if (msg) {
          group.classList.add('has-error');
        } else {
          group.classList.remove('has-error');
        }
      }
    }

    // ========================================================================
    // CUSTOM ACCESSIBLE DROPDOWN CONTROLLER (ARIA Combobox / Listbox)
    // ========================================================================
    let isDropdownOpen = false;
    let focusedOptionIndex = -1;

    function openDropdown() {
      if (isDropdownOpen || !customOptionsList || !customTrigger) return;
      isDropdownOpen = true;
      customTrigger.setAttribute('aria-expanded', 'true');
      customOptionsList.hidden = false;
      const currentIndex = customOptions.findIndex(opt => opt.getAttribute('aria-selected') === 'true');
      focusedOptionIndex = currentIndex >= 0 ? currentIndex : 0;
      updateFocusedOption(focusedOptionIndex);
    }

    function closeDropdown(returnFocus = true) {
      if (!isDropdownOpen || !customOptionsList || !customTrigger) return;
      isDropdownOpen = false;
      customTrigger.setAttribute('aria-expanded', 'false');
      customOptionsList.hidden = true;
      customOptions.forEach(opt => opt.classList.remove('is-focused'));
      focusedOptionIndex = -1;
      if (returnFocus) customTrigger.focus();
    }

    function updateFocusedOption(index) {
      customOptions.forEach((opt, idx) => {
        if (idx === index) {
          opt.classList.add('is-focused');
          opt.scrollIntoView({ block: 'nearest' });
        } else {
          opt.classList.remove('is-focused');
        }
      });
    }

    function selectOption(optEl) {
      if (!optEl) return;
      const val = optEl.getAttribute('data-value') || '';
      const text = optEl.textContent.trim();

      if (customLabel) customLabel.textContent = text;
      customSelect?.classList.add('has-value');

      customOptions.forEach(opt => {
        opt.setAttribute('aria-selected', opt === optEl ? 'true' : 'false');
      });

      if (reasonSelect) {
        reasonSelect.value = val;
        reasonSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      setFieldError(customSelect, 'reason-error', '');
      closeDropdown(true);
    }

    function resetCustomSelect() {
      if (customLabel) customLabel.textContent = 'Select an inquiry type';
      customSelect?.classList.remove('has-value');
      customOptions.forEach(opt => opt.setAttribute('aria-selected', 'false'));
      if (reasonSelect) reasonSelect.value = '';
      setFieldError(customSelect, 'reason-error', '');
    }

    customTrigger?.addEventListener('click', (e) => {
      e.preventDefault();
      if (isDropdownOpen) {
        closeDropdown(false);
      } else {
        openDropdown();
      }
    });

    customTrigger?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isDropdownOpen) {
          openDropdown();
        } else if (e.key === 'ArrowDown') {
          focusedOptionIndex = Math.min(focusedOptionIndex + 1, customOptions.length - 1);
          updateFocusedOption(focusedOptionIndex);
        } else if (e.key === 'ArrowUp') {
          focusedOptionIndex = Math.max(focusedOptionIndex - 1, 0);
          updateFocusedOption(focusedOptionIndex);
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (focusedOptionIndex >= 0 && customOptions[focusedOptionIndex]) {
            selectOption(customOptions[focusedOptionIndex]);
          }
        }
      } else if (e.key === 'Escape' && isDropdownOpen) {
        e.preventDefault();
        closeDropdown(true);
      }
    });

    customOptionsList?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedOptionIndex = (focusedOptionIndex + 1) % customOptions.length;
        updateFocusedOption(focusedOptionIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedOptionIndex = (focusedOptionIndex - 1 + customOptions.length) % customOptions.length;
        updateFocusedOption(focusedOptionIndex);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusedOptionIndex = 0;
        updateFocusedOption(focusedOptionIndex);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusedOptionIndex = customOptions.length - 1;
        updateFocusedOption(focusedOptionIndex);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedOptionIndex >= 0 && customOptions[focusedOptionIndex]) {
          selectOption(customOptions[focusedOptionIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown(true);
      } else if (e.key === 'Tab') {
        closeDropdown(false);
      }
    });

    customOptions.forEach((opt, idx) => {
      opt.addEventListener('click', () => selectOption(opt));
      opt.addEventListener('mouseenter', () => {
        focusedOptionIndex = idx;
        updateFocusedOption(focusedOptionIndex);
      });
    });

    document.addEventListener('click', (e) => {
      if (isDropdownOpen && customSelect && !customSelect.contains(e.target)) {
        closeDropdown(false);
      }
    });

    // ========================================================================
    // DUAL-EDGE CANVAS CONFETTI CELEBRATION
    // ========================================================================
    function launchContactConfetti() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.id = 'contact-confetti-canvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:1200;';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const colors = ['#4F8CFF', '#5CE1E6', '#FFFFFF', '#9D7BFF', '#7096FF', '#22D3EE', '#C4CBD6'];
      const particles = [];
      const particleCount = 100;

      // Half from left edge, half from right edge toward the center
      for (let i = 0; i < particleCount; i++) {
        const fromLeft = i % 2 === 0;
        const x = fromLeft ? -10 : width + 10;
        const y = height * (0.35 + Math.random() * 0.4);
        const vx = fromLeft ? (5 + Math.random() * 8) : (-5 - Math.random() * 8);
        const vy = -6 - Math.random() * 7;
        const size = 5 + Math.random() * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const tilt = Math.random() * 10 - 5;
        const tiltSpeed = 0.06 + Math.random() * 0.08;
        const isCircle = Math.random() > 0.6;

        particles.push({
          x, y, vx, vy,
          size, color,
          tilt, tiltAngle: Math.random() * Math.PI * 2, tiltSpeed,
          isCircle,
          opacity: 1,
          gravity: 0.26 + Math.random() * 0.06,
          drag: 0.985
        });
      }

      const startTime = performance.now();
      const duration = 2200; // 2.2 seconds animation
      let animId;

      function render(now) {
        const elapsed = now - startTime;
        if (elapsed > duration) {
          cleanup();
          return;
        }

        ctx.clearRect(0, 0, width, height);
        const progress = elapsed / duration;
        const fade = progress > 0.7 ? (1 - progress) / 0.3 : 1;

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= p.drag;
          p.tiltAngle += p.tiltSpeed;
          p.tilt = Math.sin(p.tiltAngle) * 8;

          ctx.save();
          ctx.globalAlpha = Math.max(0, fade * p.opacity);
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.tiltAngle * 0.5);

          if (p.isCircle) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.6);
          }
          ctx.restore();
        });

        animId = requestAnimationFrame(render);
      }

      function cleanup() {
        if (animId) cancelAnimationFrame(animId);
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }

      animId = requestAnimationFrame(render);
    }

    // ========================================================================
    // SUCCESS CELEBRATION MODAL CONTROLLER
    // ========================================================================
    function openSuccessModal() {
      if (!successModal) return;
      successModal.hidden = false;
      modalBtnClose?.focus();
    }

    function closeSuccessModal() {
      if (!successModal) return;
      successModal.hidden = true;
      form.reset();
      resetCustomSelect();
      if (charCount) charCount.textContent = '0 / 2000';
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-success', 'is-loading');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) {
        btnText.innerHTML = 'Send Message <span>↗</span>';
      }
      focusFormBtn?.focus();
    }

    const resetBtn = document.getElementById('btn-send-another') || modalBtnClose;
    resetBtn?.addEventListener('click', closeSuccessModal);
    modalCloseIcon?.addEventListener('click', closeSuccessModal);

    successModal?.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (successModal && !successModal.hidden && e.key === 'Escape') {
        closeSuccessModal();
      }
    });

    // ========================================================================
    // LIVE VALIDATION LISTENERS
    // ========================================================================
    nameInput?.addEventListener('blur', () => {
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, 'name-error', 'Please enter your full name.');
      } else if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'name-error', 'Name must be at least 2 characters.');
      } else {
        setFieldError(nameInput, 'name-error', '');
      }
    });

    emailInput?.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        setFieldError(emailInput, 'email-error', 'Please enter your email address.');
      } else if (!emailRegex.test(val)) {
        setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
      } else {
        setFieldError(emailInput, 'email-error', '');
      }
    });

    reasonSelect?.addEventListener('change', () => {
      if (!reasonSelect.value) {
        setFieldError(customSelect, 'reason-error', 'Please select a reason.');
      } else {
        setFieldError(customSelect, 'reason-error', '');
      }
    });

    subjectInput?.addEventListener('blur', () => {
      const val = subjectInput.value.trim();
      if (!val) {
        setFieldError(subjectInput, 'subject-error', 'Please enter a subject.');
      } else if (val.length < 3) {
        setFieldError(subjectInput, 'subject-error', 'Subject must be at least 3 characters.');
      } else {
        setFieldError(subjectInput, 'subject-error', '');
      }
    });

    messageInput?.addEventListener('blur', () => {
      const val = messageInput.value.trim();
      if (!val) {
        setFieldError(messageInput, 'message-error', 'Please enter your message.');
      } else if (val.length < 20) {
        setFieldError(messageInput, 'message-error', `Please enter at least 20 characters (currently ${val.length}).`);
      } else {
        setFieldError(messageInput, 'message-error', '');
      }
    });

    urlInput?.addEventListener('blur', () => {
      const val = urlInput.value.trim();
      if (val && !/^https?:\/\//i.test(val)) {
        setFieldError(urlInput, 'url-error', 'URL must start with http:// or https://');
      } else {
        setFieldError(urlInput, 'url-error', '');
      }
    });

    // Clear error state on input
    [nameInput, emailInput, subjectInput, messageInput, urlInput].forEach(inp => {
      inp?.addEventListener('input', () => {
        const group = inp.closest('.form-group');
        group?.classList.remove('has-error');
        const errEl = group?.querySelector('.field-error');
        if (errEl) errEl.textContent = '';
      });
    });

    // Status Banner Helper with Actionable Mailto Fallback
    function showStatus(msg, type = 'error', fallbackData = null) {
      if (!statusBox) return;
      statusBox.hidden = false;
      statusBox.className = `form-status status-${type}`;
      statusBox.innerHTML = '';

      const msgP = document.createElement('p');
      msgP.className = 'status-text';
      msgP.textContent = msg;
      statusBox.appendChild(msgP);

      if (fallbackData && fallbackData.type === 'mailto') {
        const fallbackBox = document.createElement('div');
        fallbackBox.className = 'status-fallback-action';

        const infoP = document.createElement('p');
        infoP.className = 'fallback-instruction';
        infoP.textContent = 'You can send your message directly via your email client to sathwvikmanuri@gmail.com. Click below to launch your email client with all fields pre-filled (remember to click Send in your email app):';
        fallbackBox.appendChild(infoP);

        const mailtoBtn = document.createElement('a');
        mailtoBtn.className = 'mailto-fallback-btn';
        mailtoBtn.id = 'mailto-fallback-action';
        const mailtoUrl = `mailto:${encodeURIComponent(fallbackData.to || 'sathwvikmanuri@gmail.com')}?subject=${encodeURIComponent(fallbackData.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(fallbackData.body || '')}`;
        mailtoBtn.href = mailtoUrl;
        mailtoBtn.innerHTML = 'Open in Email App (mailto:) <span>↗</span>';
        fallbackBox.appendChild(mailtoBtn);

        statusBox.appendChild(fallbackBox);
      }
    }

    function clearStatus() {
      if (!statusBox) return;
      statusBox.hidden = true;
      statusBox.textContent = '';
      statusBox.innerHTML = '';
    }

    // Cooldown prevention (30 seconds client-side throttle)
    let lastSubmitTime = 0;

    // Form Submission Handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearStatus();

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const reason = reasonSelect?.value || '';
      const subject = subjectInput?.value.trim() || '';
      const message = messageInput?.value.trim() || '';
      const url = urlInput?.value.trim() || '';
      const gotcha = gotchaInput?.value || '';

      // Validate all fields
      let hasError = false;
      let firstInvalid = null;

      if (!name || name.length < 2) {
        setFieldError(nameInput, 'name-error', 'Please enter your full name (min 2 chars).');
        hasError = true;
        firstInvalid = firstInvalid || nameInput;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
        hasError = true;
        firstInvalid = firstInvalid || emailInput;
      }

      if (!reason) {
        setFieldError(customSelect, 'reason-error', 'Please select an inquiry type.');
        hasError = true;
        firstInvalid = firstInvalid || customTrigger;
      }

      if (!subject || subject.length < 3) {
        setFieldError(subjectInput, 'subject-error', 'Please enter a subject (min 3 chars).');
        hasError = true;
        firstInvalid = firstInvalid || subjectInput;
      }

      if (!message || message.length < 20) {
        setFieldError(messageInput, 'message-error', 'Please enter at least 20 characters.');
        hasError = true;
        firstInvalid = firstInvalid || messageInput;
      }

      if (url && !/^https?:\/\//i.test(url)) {
        setFieldError(urlInput, 'url-error', 'URL must start with http:// or https://');
        hasError = true;
        firstInvalid = firstInvalid || urlInput;
      }

      if (hasError) {
        firstInvalid?.focus();
        showStatus('Please correct the highlighted fields before submitting.', 'error');
        return;
      }

      // Prepare fallback mailto data in case of delivery unconfigured or network failure
      const fallbackData = {
        type: 'mailto',
        to: 'sathwvikmanuri@gmail.com',
        subject: `[Portfolio Inquiry] ${subject}`,
        body: `Hi Susatwik,\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${reason}\n${url ? `Website / URL: ${url}\n` : ''}\nMessage:\n${message}\n\n---\nSent via Portfolio Contact Form`
      };

      // Check client-side cooldown
      const now = Date.now();
      if (now - lastSubmitTime < 30000) {
        const remaining = Math.ceil((30000 - (now - lastSubmitTime)) / 1000);
        showStatus(`Please wait ${remaining} seconds before submitting another message.`, 'error');
        return;
      }

      // Prepare submission UI & prevent duplicate clicks
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.classList.remove('is-success');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending Message...';

      try {
        const payload = {
          name,
          email,
          reason,
          subject,
          message,
          url,
          _gotcha: gotcha
        };

        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          lastSubmitTime = Date.now();

          // 1. Transition button to success state
          submitBtn.classList.remove('is-loading');
          submitBtn.classList.add('is-success');
          if (btnText) {
            btnText.innerHTML = 'Message Sent <span>✓</span>';
          }

          // 2. Launch dual-edge confetti celebration
          launchContactConfetti();

          // 3. Open centered success celebration modal
          setTimeout(() => {
            openSuccessModal();
          }, 350);
        } else {
          // Recoverable error: preserve entered fields and offer direct mailto fallback
          const errorMsg = data.error || 'Unable to deliver message through mail server right now.';
          showStatus(errorMsg, 'error', data.fallback || fallbackData);
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading', 'is-success');
          if (btnText) {
            btnText.innerHTML = 'Send Message <span>↗</span>';
          }
        }
      } catch (err) {
        // Network / connection error: preserve fields and offer mailto fallback
        showStatus('Network connection error. Your entered message has been preserved below.', 'error', fallbackData);
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading', 'is-success');
        if (btnText) {
          btnText.innerHTML = 'Send Message <span>↗</span>';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
