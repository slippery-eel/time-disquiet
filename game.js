let loopCount     = 0;
let eyesEl        = null;
let clickCount    = 0;
let eyesActive    = false;
let baseImgEl     = null;
let baseImgFn     = null;
let currentPeriod = null;
let phase         = 1;
let scrollDeck    = [];
let clarityDeck   = [];
const _tracks     = new Map();
let _audioStarted = false;
let phase4Clicks  = 0;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getPhasePools(p) {
  if (p === 1) return { scroll: PHASE1_SCROLL,  clarity: PHASE1_CLARITY };
  if (p === 2) return { scroll: PHASE2_SCROLL,  clarity: PHASE2_CLARITY };
  if (p === 3) return { scroll: PHASE3_SCROLL,  clarity: PHASE3_CLARITY };
  return             { scroll: PHASE4_SCROLL,  clarity: PHASE4_CLARITY };
}

function loadPhase(p) {
  phase = Math.min(p, 4);
  const pools = getPhasePools(phase);
  scrollDeck  = shuffle(pools.scroll);
  clarityDeck = shuffle(pools.clarity);
  if (phase === 1) {
    scrollDeck = ['scroll_meme', ...scrollDeck.filter(id => id !== 'scroll_meme')];
  }
  eyesActive = phase >= 2;
  setPhaseAudio(phase);
}

function advancePhase() { loadPhase(phase + 1); }

loadPhase(1);

function getPeriod() {
  const h = gameHour % 24;
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 20) return 'evening';
  return 'night';
}

function updateBaseImage() {
  const p = getPeriod();
  if (p !== currentPeriod && baseImgEl && baseImgFn) {
    currentPeriod = p;
    baseImgEl.src = baseImgFn();
  }
}

function doBlink() {
  const count = 1 + Math.floor(Math.random() * 3);
  let t = 0;
  for (let i = 0; i < count; i++) {
    const close = t;
    const open  = t + 110;
    setTimeout(() => { if (eyesEl) eyesEl.style.opacity = '0'; }, close);
    setTimeout(() => { if (eyesEl) eyesEl.style.opacity = '1'; }, open);
    t = open + 100;
  }
}

function scheduleNextBlink() {
  setTimeout(() => { doBlink(); scheduleNextBlink(); }, 3000 + Math.random() * 2000);
}

function scheduleNextShudder() {
  setTimeout(() => {
    shudderEl(eyesEl);
    scheduleNextShudder();
  }, 5000 + Math.random() * 3000);
}

function pickScroll() {
  if (scrollDeck.length === 0) advancePhase();
  return scrollDeck.shift();
}

function pickClarity() {
  if (clarityDeck.length === 0) advancePhase();
  return clarityDeck.shift();
}

// ── Glitch transition ─────────────────────────────────────────────────────────

const GLITCH_COLORS = [
  'rgba(255,0,68,0.7)',
  'rgba(0,220,255,0.7)',
  'rgba(255,210,0,0.7)',
  'rgba(0,255,100,0.7)',
  'rgba(255,0,255,0.7)',
];

function colorBars(count, maxH = 6) {
  return Array.from({ length: count }, () => {
    const top    = Math.random() * 92;
    const height = 1 + Math.random() * maxH;
    const offset = (Math.random() - 0.5) * 20;
    const color  = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];
    return `<div style="position:absolute;top:${top}%;left:0;right:0;height:${height}px;background:${color};transform:translateX(${offset}px)"></div>`;
  }).join('');
}

const GLITCH_EFFECTS = [
  { cls: 'glitching-corrupt', bars: () => colorBars(4) },
  { cls: 'glitching-hue',     bars: () => colorBars(3, 4) },
  { cls: 'glitching-neon',    bars: () => colorBars(5, 3) },
  { cls: 'glitching-invert',  bars: () => colorBars(3, 5) },
  { cls: 'glitching-rgb',     bars: () => '' },
];

function triggerEnding() {
  for (const a of _tracks.values()) a.pause();
  const phone = document.getElementById('phone');
  phone.style.transition = 'opacity 0.8s ease';
  phone.style.opacity    = '0';
  setTimeout(() => location.reload(), 5000);
}

function triggerGlitch(then) {
  const phone   = document.getElementById('phone');
  const overlay = document.getElementById('glitch-overlay');
  const effect  = GLITCH_EFFECTS[Math.floor(Math.random() * GLITCH_EFFECTS.length)];

  phone.classList.add(effect.cls);
  overlay.classList.add('active');
  overlay.innerHTML = effect.bars();

  setTimeout(() => {
    phone.classList.remove(effect.cls);
    overlay.classList.remove('active');
    overlay.innerHTML = '';
    then();
  }, 160);
}

// ── Router ────────────────────────────────────────────────────────────────────

function goTo(to) {
  if (to === '_next_clarity') {
    render(pickClarity());
    return;
  }
  if (to === '_glitch_return') {
    triggerGlitch(() => {
      loopCount++;
      render(pickScroll());
    });
    return;
  }
  render(to);
}

// ── Renderer ──────────────────────────────────────────────────────────────────

function applyPhaseStyles() {
  document.getElementById('status-time').style.color = phase >= 3 ? '#ff2244' : '';
  document.getElementById('status-bar').style.display = phase >= 4 ? 'none' : '';
}

function render(screenId) {
  applyPhaseStyles();
  const screen = SCREENS[screenId];
  if (!screen) { console.error('Missing screen:', screenId); return; }

  const textEl    = document.getElementById('screen-text');
  const imgsEl    = document.getElementById('screen-imgs');
  const choicesEl = document.getElementById('choices');

  imgsEl.innerHTML    = '';
  choicesEl.innerHTML = '';

  if (screen.image) {
    const fn  = screen.image === '_time_of_day'         ? getTimeOfDayImage
              : screen.image === '_time_of_day_clarity' ? getTimeOfDayClarityImage
              : null;
    const img = document.createElement('img');
    img.src   = fn ? fn() : screen.image;
    img.alt   = '';
    imgsEl.appendChild(img);
    baseImgEl     = img;
    baseImgFn     = fn;
    currentPeriod = getPeriod();

    if (eyesActive && phase < 4) {
      const body = document.createElement('img');
      body.src = 'art/body.png';
      body.alt = '';
      body.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:top;pointer-events:none;';
      imgsEl.appendChild(body);

      const eyes = document.createElement('img');
      eyes.src = 'art/eyes.png';
      eyes.alt = '';
      eyes.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:top;pointer-events:none;';
      imgsEl.appendChild(eyes);
      eyesEl = eyes;
    } else {
      eyesEl = null;
    }

    if (screen.image === '_time_of_day' && phase < 4 && Math.random() < 0.5) {
      const tiktok = document.createElement('img');
      tiktok.src = 'art/tiktok1.png';
      tiktok.alt = '';
      tiktok.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:top;pointer-events:none;';
      imgsEl.appendChild(tiktok);
    }
  }

  let html = '';
  if (screen.title) html += `<h1>${escHtml(screen.title)}</h1>`;
  if (screen.text)  html += `<p>${escHtml(screen.text)}</p>`;
  textEl.innerHTML = html;

  (screen.choices || []).forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice.text;
    btn.addEventListener('click', () => {
      skipRandomTime();
      clickCount++;
      if (phase >= 4) {
        phase4Clicks++;
        if (phase4Clicks >= 25) { triggerEnding(); return; }
      }
      goTo(choice.to);
    });
    choicesEl.appendChild(btn);
  });
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ── Game clock ────────────────────────────────────────────────────────────────

const _now = new Date();
let gameHour = _now.getHours(), gameMinute = _now.getMinutes();

function formatGameTime(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getTimeOfDayImage() {
  const h = gameHour % 24;
  if (h >= 6  && h < 12) return 'art/morning phone.png';
  if (h >= 12 && h < 17) return 'art/afternoon phone.png';
  if (h >= 17 && h < 20) return 'art/evening phone.png';
  return 'art/night phone.png';
}

function getTimeOfDayClarityImage() {
  const h = gameHour % 24;
  if (h >= 6  && h < 12) return 'art/morning.png';
  if (h >= 12 && h < 17) return 'art/afternoon.png';
  if (h >= 17 && h < 20) return 'art/evening.png';
  return 'art/night.png';
}

function tickGameTime() {
  gameMinute++;
  if (gameMinute >= 60) { gameMinute = 0; gameHour++; }
}

function shudderEl(el) {
  if (!el) return;
  el.classList.add('eyes-shuddering');
  el.addEventListener('animationend', () => el.classList.remove('eyes-shuddering'), { once: true });
}

function flashHour() {
  const el = document.getElementById('status-time');
  el.style.fontSize = '2.4rem';
  setTimeout(() => { el.style.fontSize = ''; }, 200);
  shudderEl(el);
}

function scheduleTimeShudder() {
  setTimeout(() => {
    if (eyesActive) shudderEl(document.getElementById('status-time'));
    scheduleTimeShudder();
  }, 5000 + Math.random() * 7000);
}

const SUBLIMINAL_TEXTS = ['keep scrolling', "don't think", 'consume', "it's good for you"];

function subliminalPos() {
  const r = Math.random();
  if (r < 0.4) return { top: 55 + Math.random() * 35, left: 5  + Math.random() * 40 }; // bottom-left
  if (r < 0.7) return { top: 2  + Math.random() * 8,  left: 5  + Math.random() * 60 }; // top 10%
  return               { top: 10 + Math.random() * 75, left: 5  + Math.random() * 60 }; // anywhere
}

function flashSubliminal() {
  const el        = document.getElementById('subliminal');
  const container = document.getElementById('image-area');
  const hard      = phase >= 3;

  el.textContent    = SUBLIMINAL_TEXTS[Math.floor(Math.random() * SUBLIMINAL_TEXTS.length)];
  el.style.fontSize = hard ? '1.2rem' : '';
  el.style.color    = hard ? '#ffffff' : '';

  const cw = container.offsetWidth;
  const ch = container.offsetHeight;
  const maxLeft = Math.max(0, ((cw - el.offsetWidth)  / cw) * 100);
  const maxTop  = Math.max(0, ((ch - el.offsetHeight) / ch) * 100);

  const pos     = subliminalPos();
  el.style.left = Math.min(pos.left, maxLeft) + '%';
  el.style.top  = Math.min(pos.top,  maxTop)  + '%';

  if (phase === 2) {
    el.style.transition = 'opacity 1s ease';
    el.style.opacity    = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 1000);
  } else {
    el.style.transition = '';
    el.style.opacity    = '1';
    const cls = hard ? 'eyes-shuddering-hard' : 'eyes-shuddering';
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
    setTimeout(() => { el.style.opacity = '0'; }, 300);
  }
}

function scheduleNextSubliminal() {
  const delay = phase >= 3 ? 1500 + Math.random() * 1500 : 3000 + Math.random() * 2000;
  setTimeout(() => {
    if (eyesActive && phase < 4) flashSubliminal();
    scheduleNextSubliminal();
  }, delay);
}

// ── Audio ─────────────────────────────────────────────────────────────────────
// Edit tracks and volumes per phase here.

const AUDIO_PHASES = {
  1: [
    { src: 'audio/underwater.mp3',    volume: 0.3 },
    { src: 'audio/ominous_drone.wav', volume: 0.8 },
  ],
  2: [
    { src: 'audio/underwater.mp3',    volume: 0.3 },
    { src: 'audio/ominous_drone.wav', volume: 0.8 },
  ],
  3: [
    { src: 'audio/underwater.mp3',    volume: 0.3 },
    { src: 'audio/ominous_drone.wav', volume: 0.8 },
  ],
  4: [
    { src: 'audio/underwater.mp3',    volume: 0.1 },
    { src: 'audio/ominous_drone.wav', volume: 1.0 },
  ],
};

function initAudio() {
  const srcs = new Set(Object.values(AUDIO_PHASES).flat().map(t => t.src));
  for (const src of srcs) {
    const a = new Audio(src);
    a.loop   = true;
    a.volume = 0;
    _tracks.set(src, a);
  }

  const pause = () => { if (_audioStarted) for (const a of _tracks.values()) a.pause(); };
  const resume = () => { if (_audioStarted) for (const a of _tracks.values()) a.play(); };

  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());
  window.addEventListener('blur',  pause);
  window.addEventListener('focus', resume);
}

function fadeToVolumes(targets, duration) {
  if (duration === 0) {
    for (const [src, a] of _tracks) a.volume = targets.get(src) ?? 0;
    return;
  }
  const start = performance.now();
  const from  = new Map([..._tracks].map(([src, a]) => [src, a.volume]));
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    for (const [src, a] of _tracks) {
      a.volume = from.get(src) + ((targets.get(src) ?? 0) - from.get(src)) * t;
    }
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setPhaseAudio(p, fadeDuration = 2000) {
  if (!_audioStarted) return;
  const config  = AUDIO_PHASES[p] || [];
  const targets = new Map([..._tracks.keys()].map(src => [src, 0]));
  for (const { src, volume } of config) if (targets.has(src)) targets.set(src, volume);
  fadeToVolumes(targets, fadeDuration);
}

function startAudio() {
  _audioStarted = true;
  for (const a of _tracks.values()) a.play();
  setPhaseAudio(phase, 0);
}

// ─────────────────────────────────────────────────────────────────────────────

function skipRandomTime() {
  gameMinute += Math.floor(Math.random() * 90) + 1;
  while (gameMinute >= 60) { gameMinute -= 60; gameHour++; }
  gameHour %= 24;
  const el = document.getElementById('status-time');
  el.textContent = formatGameTime(gameHour, gameMinute);
  if (gameMinute === 0) flashHour();
  updateBaseImage();
}

function clockDelay() {
  return Math.max(5, 450 - clickCount * 15);
}

function startGameClock() {
  const el = document.getElementById('status-time');
  el.textContent = formatGameTime(gameHour, gameMinute);
  function tick() {
    tickGameTime();
    el.textContent = formatGameTime(gameHour, gameMinute);
    if (gameMinute === 0) flashHour();
    updateBaseImage();
    setTimeout(tick, clockDelay());
  }
  setTimeout(tick, clockDelay());
}

// ── Intro sequence ────────────────────────────────────────────────────────────

function playIntro() {
  const overlay = document.getElementById('intro-overlay');
  const stack   = document.getElementById('intro-stack');
  const tagline = overlay.querySelector('.intro-tagline');
  const timeEl  = overlay.querySelector('.intro-time');
  const playBtn = document.getElementById('play-btn');

  timeEl.textContent = formatGameTime(gameHour, gameMinute);

  // Stage 1: tagline fades in
  setTimeout(() => tagline.classList.add('visible'), 600);

  // Stage 2: stack lifts, time slides up into view
  setTimeout(() => {
    stack.classList.add('lift-1');
    timeEl.classList.add('visible');

    let count = 0;
    const LIFT_AT = 5;
    const tick = setInterval(() => {
      tickGameTime();
      timeEl.textContent = formatGameTime(gameHour, gameMinute);
      count++;
      if (count === LIFT_AT) {
        // Stage 3: stack lifts again, play button slides up into view
        stack.classList.remove('lift-1');
        stack.classList.add('lift-2');
        playBtn.classList.add('visible');
      }
    }, 450);
  }, 2800);

  playBtn.addEventListener('click', () => {
    startAudio();
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      startGameClock();
      render(pickScroll());
    }, 1200);
  }, { once: true });
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => { initAudio(); playIntro(); scheduleNextBlink(); scheduleNextShudder(); scheduleTimeShudder(); scheduleNextSubliminal(); });
