let loopCount    = 0;
let lastScrollId  = null;
let lastClarityId = null;
let eyesEl        = null;
let clickCount    = 0;
let eyesActive    = false;
const eyesThreshold = 10 + Math.floor(Math.random() * 11);
let baseImgEl     = null;
let baseImgFn     = null;
let currentPeriod = null;

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

// Weighted random pick, never repeating the last result
function weightedPick(pool, lastId) {
  const candidates = pool.length > 1 ? pool.filter(e => e.id !== lastId) : pool;
  const total = candidates.reduce((sum, e) => sum + e.weight, 0);
  let r = Math.random() * total;
  for (const entry of candidates) {
    r -= entry.weight;
    if (r <= 0) return entry.id;
  }
  return candidates[candidates.length - 1].id;
}

let firstScroll = true;
function pickScroll() {
  if (firstScroll) { firstScroll = false; return lastScrollId = 'scroll_meme'; }
  return lastScrollId = weightedPick(SCROLL_POOL, lastScrollId);
}
function pickClarity()  { return lastClarityId = weightedPick(CLARITY_POOL, lastClarityId); }

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

function render(screenId) {
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

    if (eyesActive) {
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
      if (!eyesActive && clickCount >= eyesThreshold) eyesActive = true;
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
  const tagline = overlay.querySelector('.intro-tagline');
  const timeEl  = overlay.querySelector('.intro-time');

  // Reserve space immediately so layout is stable when tagline appears
  timeEl.textContent = formatGameTime(gameHour, gameMinute);

  // Fade in tagline
  setTimeout(() => tagline.classList.add('visible'), 600);

  // Fade in time, then immediately start ticking
  setTimeout(() => {
    timeEl.classList.add('visible');

    let count = 0;
    const FADE_AT = 8;
    const tick = setInterval(() => {
      tickGameTime();
      timeEl.textContent = formatGameTime(gameHour, gameMinute);
      count++;
      if (count === FADE_AT) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          clearInterval(tick);
          overlay.style.display = 'none';
          startGameClock();
          render(pickScroll());
        }, 1200);
      }
    }, 450);
  }, 2800);
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => { playIntro(); scheduleNextBlink(); scheduleNextShudder(); scheduleTimeShudder(); });
