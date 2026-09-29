'use strict';
/* ===== Tiện ích ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const COLORS = ['#d9667f', '#f4a0b0', '#e3b25a', '#8fb08c', '#f7dc8f', '#c9485f'];
const GLYPHS = ['♥', '✦', '★', '●', '♡', '✿'];
const scrollTo = (el, block = 'start') => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
const show = el => { el.hidden = false; el.classList.add('pop'); };
let S = {}; // nội dung từ site.json

async function loadJSON(url, fallback) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) { console.warn('Không đọc được', url, e); return fallback; }
}

/* Chạy callback 1 lần khi phần tử hiện trong màn hình */
function once(el, cb, th = 0.3) {
  if (!el) return;
  if (!('IntersectionObserver' in window)) return cb();
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); cb(); } }, { threshold: th });
  io.observe(el);
}

/* ===== Hiệu ứng confetti / tim / mưa cánh hoa ===== */
function fx(glyph, color, size) {
  const e = document.createElement('span');
  e.className = 'fx'; e.textContent = glyph; e.style.color = color; e.style.fontSize = size + 'px';
  document.body.appendChild(e); return e;
}
function burst(x, y, n = 28) {
  if (reduce) n = Math.min(n, 6);
  for (let i = 0; i < n; i++) {
    const e = fx(pick(GLYPHS), pick(COLORS), rnd(12, 26));
    e.style.left = x + 'px'; e.style.top = y + 'px';
    const a = rnd(0, 6.28), v = rnd(60, 190), dx = Math.cos(a) * v, dy = Math.sin(a) * v - 80;
    e.animate([
      { transform: 'translate(-50%,-50%)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${rnd(-200, 200)}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx * 1.2}px),calc(-50% + ${dy + 220}px)) rotate(${rnd(-360, 360)}deg)`, opacity: 0 }
    ], { duration: rnd(1300, 2200), easing: 'ease-out' }).onfinish = () => e.remove();
  }
}
function hearts(x, y, n = 8) { // tim bay lên
  for (let i = 0; i < (reduce ? 2 : n); i++) {
    const e = fx('♥', pick(COLORS), rnd(16, 30));
    e.style.left = x + rnd(-60, 60) + 'px'; e.style.top = y + 'px';
    e.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(-${rnd(160, 300)}px) translateX(${rnd(-30, 30)}px)`, opacity: 0 }],
      { duration: rnd(1600, 2600), delay: i * 90, fill: 'backwards', easing: 'ease-out' }).onfinish = () => e.remove();
  }
}
let rainTimer;
function rain(glyphs, ms) {
  clearInterval(rainTimer);
  const end = Date.now() + ms;
  rainTimer = setInterval(() => {
    if (Date.now() > end) return clearInterval(rainTimer);
    const e = fx(pick(glyphs), pick(COLORS), rnd(14, 28));
    e.style.left = rnd(0, innerWidth) + 'px'; e.style.top = '-30px';
    e.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(${innerHeight + 60}px) rotate(${rnd(-300, 300)}deg)` }],
      { duration: rnd(3000, 5000), easing: 'linear' }).onfinish = () => e.remove();
  }, reduce ? 800 : 260);
}
function scatter(box, n) { // doodle nổi lơ lửng
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'dd'; s.textContent = pick(['♡', '✦', '★', '✿', '~', '♥', '☁']);
    s.style.cssText = `left:${rnd(2, 94)}%;top:${rnd(2, 92)}%;font-size:${rnd(16, 32)}px;color:${pick(COLORS)};--t:${rnd(4, 8)}s;--d:-${rnd(0, 6)}s`;
    box.appendChild(s);
  }
}

/* ===== SVG: nhẫn & bó hoa ===== */
const RING = `<svg class="ringsvg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="76" r="30" fill="none" stroke="#e3b25a" stroke-width="9"/><circle cx="60" cy="76" r="30" fill="none" stroke="#f7dc8f" stroke-width="3" stroke-dasharray="40 200" stroke-linecap="round"/><path d="M45 34 52 22H68L75 34 60 52Z" fill="#fff" stroke="#e58aa0" stroke-width="3" stroke-linejoin="round"/><path d="M45 34H75M52 22 60 52 68 22" stroke="#e58aa0" stroke-width="1.5" fill="none"/></svg>`;
const BOUQUET = `<svg viewBox="0 0 240 260" aria-hidden="true"><defs><g id="rose"><circle r="26" fill="#d9667f"/><circle r="18" fill="#e88aa0"/><path d="M-9 0a9 9 0 1 1 9 9a14 14 0 1 1-14-14" fill="none" stroke="#b64a63" stroke-width="3" stroke-linecap="round"/></g></defs>
<path d="M120 235 80 130M120 235 120 110M120 235 160 130M120 235 100 170M120 235 145 175" stroke="#7fa17b" stroke-width="5" stroke-linecap="round" fill="none"/>
<g fill="#8fb08c"><ellipse cx="92" cy="195" rx="18" ry="7" transform="rotate(-30 92 195)"/><ellipse cx="150" cy="198" rx="18" ry="7" transform="rotate(30 150 198)"/></g>
<g class="bl" style="--d:.1s"><use href="#rose" x="80" y="125"/></g><g class="bl" style="--d:.3s"><use href="#rose" x="160" y="125"/></g>
<g class="bl" style="--d:.5s"><use href="#rose" x="120" y="98"/></g><g class="bl" style="--d:.7s"><use href="#rose" x="98" y="165"/></g><g class="bl" style="--d:.9s"><use href="#rose" x="144" y="168"/></g>
<path d="M120 232 98 218V246ZM120 232 142 218V246Z" fill="#f4a0b0"/><circle cx="120" cy="232" r="7" fill="#d9667f"/></svg>`;

/* ===== Nội dung & hiệu ứng cuộn ===== */
function fillText() {
  $$('[data-t]').forEach(el => { const v = get(S, el.dataset.t); if (typeof v === 'string') el.textContent = v; });
  if (S.title) document.title = S.title;
}
function watchPages() {
  const pages = $$('.page');
  if (!('IntersectionObserver' in window)) return pages.forEach(p => p.classList.add('active'));
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('active', e.isIntersecting)), { rootMargin: '-35% 0px -35% 0px' });
  pages.forEach(p => io.observe(p));
}

/* ===== Section 1 ===== */
function initWelcome() {
  $('#enter').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 16);
    scrollTo($('#letter'));
  });
}

/* ===== Section 2: phong bì ===== */
let opened = false;
async function openEnvelope() {
  if (opened) return; opened = true;
  const env = $('#env');
  env.classList.add('wiggle'); await wait(1300);
  env.classList.add('open'); await wait(1800);
  $('#envWrap').classList.add('done');
  $('#letterBody').classList.add('show');
}
function initLetter() {
  const box = $('#letterText');
  const ps = get(S, 'letter.paragraphs') || [];
  ps.forEach((t, i) => {
    const p = document.createElement('p'); p.textContent = t; p.style.setProperty('--i', i);
    if (i === 0) p.className = 'greet'; if (i === ps.length - 1 && i > 0) p.className = 'close';
    box.appendChild(p);
  });
  const env = $('#env');
  env.addEventListener('click', openEnvelope);
  env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });
  once(env, openEnvelope, 0.7);
}

/* ===== Section 3: cassette + ảnh ===== */
async function initMusic() {
  const memories = await loadJSON('content/memories.json', []);
  const photos = Array.isArray(memories) ? memories.filter(m => m && m.image) : [];
  const cass = $('#cassette'), btn = $('#play'), fill = $('#fill'), bar = $('#bar'), time = $('#time'), note = $('#audioNote'), stage = $('#stage');
  const M = S.music || {};
  const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
  let ready = false, shown = -1;

  function addPolaroid(m) {
    const f = document.createElement('figure'); f.className = 'polaroid';
    f.style.setProperty('--r', rnd(-8, 8).toFixed(1) + 'deg'); f.style.setProperty('--x', rnd(-26, 26).toFixed(0) + 'px');
    const img = new Image(); img.alt = m.caption || 'Một kỷ niệm của hai đứa';
    img.onerror = () => f.classList.add('noimg'); // ảnh thiếu → hiện ô tim, không vỡ trang
    img.src = m.image;
    const ph = document.createElement('div'); ph.className = 'ph'; ph.textContent = '♡';
    const cap = document.createElement('figcaption'); cap.textContent = m.caption || '';
    if (m.date) { const d = document.createElement('small'); d.textContent = m.date; cap.appendChild(d); }
    f.append(img, ph, cap); stage.appendChild(f);
  }
  function showPhoto(i) {
    if (i === shown) return;
    if (i < shown) { stage.innerHTML = ''; shown = -1; } // tua lại → dựng lại chồng ảnh
    for (let k = Math.max(shown + 1, i - 2); k <= i; k++) addPolaroid(photos[k]);
    shown = i;
    while (stage.children.length > 5) stage.firstChild.remove();
  }
  // Chọn ảnh theo thời gian: nếu MỌI ảnh có "time" (giây) thì dùng mốc đó, không thì chia đều theo độ dài bài
  const timed = photos.length > 0 && photos.every(m => typeof m.time === 'number');
  function photoIndex(t, d) {
    if (timed) { let k = 0; photos.forEach((m, j) => { if (t >= m.time) k = j; }); return k; }
    return d ? Math.min(photos.length - 1, Math.floor(t / (d / photos.length))) : 0;
  }
  function update() {
    const d = a.duration, t = a.currentTime, pct = d ? t / d * 100 : 0;
    fill.style.width = pct + '%'; bar.setAttribute('aria-valuenow', Math.round(pct));
    time.textContent = fmt(t) + ' / ' + fmt(d);
    if (photos.length && (a.currentTime > 0 || !a.paused)) showPhoto(photoIndex(t, d));
  }
  const setPlaying = on => {
    cass.classList.toggle('playing', on); stage.classList.toggle('paused', !on);
    btn.textContent = on ? '❚❚' : '▶'; btn.setAttribute('aria-label', (on ? M.pauseLabel : M.playLabel) || (on ? 'Tạm dừng' : 'Phát nhạc'));
  };
  const fail = () => { ready = false; btn.disabled = true; setPlaying(false); note.textContent = M.placeholder || ''; note.hidden = false; };

  const a = new Audio(); a.preload = 'metadata';
  a.addEventListener('loadedmetadata', () => { ready = true; btn.disabled = false; note.hidden = true; update(); });
  a.addEventListener('error', fail);
  a.addEventListener('play', () => { setPlaying(true); update(); });
  a.addEventListener('pause', () => setPlaying(false));
  a.addEventListener('ended', () => setPlaying(false)); // ảnh dừng ở khung cuối
  a.addEventListener('timeupdate', update);
  note.textContent = M.placeholder || ''; // hiện lời nhắn cho tới khi tìm thấy file
  a.src = M.audio || 'audio/song.mp3';

  btn.addEventListener('click', async () => { // KHÔNG autoplay: chỉ phát khi bấm
    if (!ready) return;
    try { if (a.paused) await a.play(); else a.pause(); } catch (e) { console.warn(e); }
  });
  const seek = f => { if (ready && isFinite(a.duration)) { a.currentTime = Math.max(0, Math.min(a.duration, f)); update(); } };
  bar.addEventListener('pointerdown', e => { const r = bar.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * a.duration); });
  bar.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') seek(a.currentTime + 5); else if (e.key === 'ArrowLeft') seek(a.currentTime - 5);
  });
}

/* ===== Section 4: bánh + cầu hôn ===== */
function initCake() {
  const wrap = $('#cakeWrap'), wish = $('#wish');
  const xs = [...Array(6)].map((_, i) => 92 + i * 23.2);
  $('#candles').innerHTML = xs.map((x, i) =>
    `<rect x="${x - 4}" y="72" width="8" height="34" rx="3" fill="${i % 2 ? '#fff' : '#f4a0b0'}" stroke="#d9667f" stroke-width="1.5"/>` +
    `<g transform="translate(${x},70)"><g class="flame"><ellipse cy="-9" rx="6" ry="10" fill="#ffb347"/><ellipse cy="-7" rx="3" ry="6" fill="#fff3b0"/></g></g>`).join('');
  const flames = $$('.flame');

  once(wrap, async () => { // bánh trồi lên → 6 nến lần lượt sáng
    wrap.classList.add('in'); await wait(1300);
    for (const f of flames) { f.classList.add('lit'); await wait(280); }
    show(wish);
  }, 0.35);

  wish.addEventListener('click', async () => {
    wish.disabled = true;
    flames.forEach(f => { f.classList.remove('lit'); f.classList.add('out'); });
    xs.forEach(x => { // khói
      const s = document.createElement('i'); s.className = 'smoke';
      s.style.left = x / 300 * 100 + '%'; s.style.top = 60 / 280 * 100 + '%'; s.style.setProperty('--sx', rnd(-20, 20) + 'px');
      wrap.appendChild(s); setTimeout(() => s.remove(), 2000);
    });
    const r = wrap.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.3, 40); hearts(r.left + r.width / 2, r.top + r.height * 0.5, 9);
    wrap.classList.remove('bounce'); void wrap.offsetWidth; wrap.classList.add('bounce');
    wish.hidden = true; show($('#wishMsg'));

    await wait(2200); // chiếc nhẫn xuất hiện từ phía sau bánh
    const rb = $('#ringBox'); rb.innerHTML = RING +
      [[8, 12], [118, 20], [20, 100], [112, 96]].map(([l, t], i) => `<span class="sp" style="left:${l}px;top:${t}px;animation-delay:${i * .3}s">✦</span>`).join('');
    rb.hidden = false; scrollTo(rb, 'center');
    await wait(900); const q = rb.getBoundingClientRect(); burst(q.left + q.width / 2, q.top + q.height / 2, 18);

    await wait(1500); // dải ruy băng + lựa chọn
    show($('#ribbon')); await wait(700); show($('#choices')); scrollTo($('#ribbon'), 'center');
  });

  $('#yes').addEventListener('click', () => result('yes'));
  $('#no').addEventListener('click', () => result('no'));
  $('#close').addEventListener('click', () => { $('#result').hidden = true; clearInterval(rainTimer); });
}
function result(kind) {
  const P = S.proposal || {}, yes = kind === 'yes';
  $('#resTitle').textContent = (yes ? P.yesTitle : P.noTitle) || '';
  const t = $('#resText'); t.textContent = (yes ? P.yesText : P.noText) || ''; t.hidden = !t.textContent;
  $('#resArt').innerHTML = yes ? RING : BOUQUET;
  $('#result').hidden = false; $('#close').focus({ preventScroll: true });
  const cx = innerWidth / 2, cy = innerHeight / 2;
  burst(cx, cy, yes ? 60 : 30); hearts(cx, cy + 80, yes ? 14 : 8);
  if (yes) setTimeout(() => burst(cx, cy - 60, 40), 700);
  rain(yes ? ['♥', '♡', '✦', '★'] : ['✿', '❀', '♡'], yes ? 8000 : 6000);
}

/* ===== Khởi động (mỗi phần chạy riêng, một phần lỗi không làm hỏng cả trang) ===== */
async function main() {
  S = await loadJSON('content/site.json', null);
  const bad = !S;
  S = S || { title: 'Bin và Chin hay đi linh tinh', enterButton: 'Ai thèm ♡', letter: {}, music: {}, proposal: {} };
  fillText();
  if (bad) $('#subtitle').textContent = 'Không đọc được content/site.json — hãy mở trang qua server (xem README).';
  const steps = [watchPages, initWelcome, initLetter, initMusic, initCake,
    () => $$('.doodles').forEach(d => scatter(d, innerWidth < 600 ? 10 : 18)),
    () => $$('.reveal').forEach(el => once(el, () => el.classList.add('in'), 0.15))];
  for (const f of steps) { try { await f(); } catch (e) { console.error(e); } }
}
document.addEventListener('DOMContentLoaded', main);
