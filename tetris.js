'use strict';

// ── Canvas ─────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
const nxtCvs = document.getElementById('nextCanvas');
const nxtCtx = nxtCvs.getContext('2d');
const hldCvs = document.getElementById('holdCanvas');
const hldCtx = hldCvs.getContext('2d');

// ── Constants ──────────────────────────────────────────────────────────────────
const COLS = 10, ROWS = 20, SZ = 30;

const PALETTE = [
  null,
  '#00d4ff', // 1 I
  '#ffd700', // 2 O
  '#bf00ff', // 3 T
  '#00e676', // 4 S
  '#ff1744', // 5 Z
  '#ff6d00', // 6 J
  '#2979ff', // 7 L
];

const MINOS = [
  null,
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[2,2],[2,2]],                               // O
  [[0,3,0],[3,3,3],[0,0,0]],                   // T
  [[0,4,4],[4,4,0],[0,0,0]],                   // S
  [[5,5,0],[0,5,5],[0,0,0]],                   // Z
  [[6,0,0],[6,6,6],[0,0,0]],                   // J
  [[0,0,7],[7,7,7],[0,0,0]],                   // L
];

const SCORE_TABLE = [0, 100, 300, 500, 800];
const SPEEDS      = [800, 700, 600, 500, 400, 320, 240, 180, 130, 90, 60];

// ── Game state ─────────────────────────────────────────────────────────────────
let board, bag, queue, heldType, holdLocked;
let cur;      // { type, mat, x, y }
let score, level, lines;
let running, paused;
let dropAcc, lastTs, rafId;

// ── 7-bag randomizer ───────────────────────────────────────────────────────────
function refillBag() {
  bag = [1, 2, 3, 4, 5, 6, 7];
  for (let i = 6; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

function nextType() {
  if (!bag.length) refillBag();
  return bag.pop();
}

// ── Board helpers ──────────────────────────────────────────────────────────────
function emptyBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function fits(mat, cx, cy) {
  for (let r = 0; r < mat.length; r++) {
    for (let c = 0; c < mat[r].length; c++) {
      if (!mat[r][c]) continue;
      const x = cx + c, y = cy + r;
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && board[y][x]) return false;
    }
  }
  return true;
}

// Place piece onto board; returns true if any cell was above row 0
function stamp() {
  let overflow = false;
  for (let r = 0; r < cur.mat.length; r++) {
    for (let c = 0; c < cur.mat[r].length; c++) {
      if (!cur.mat[r][c]) continue;
      const y = cur.y + r, x = cur.x + c;
      if (y < 0) { overflow = true; continue; }
      board[y][x] = cur.mat[r][c];
    }
  }
  return overflow;
}

function clearFull() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) {
      board.splice(r, 1);
      board.unshift(new Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  return cleared;
}

// ── Rotation ───────────────────────────────────────────────────────────────────
function rotateCW(mat) {
  const R = mat.length, C = mat[0].length;
  const out = Array.from({ length: C }, () => new Array(R).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      out[c][R - 1 - r] = mat[r][c];
  return out;
}

function rotateCCW(mat) {
  return rotateCW(rotateCW(rotateCW(mat)));
}

const KICKS = [[0,0],[1,0],[-1,0],[0,-1],[1,-1],[-1,-1],[0,1]];

function tryRotate(fn) {
  if (!cur) return;
  const next = fn(cur.mat);
  for (const [dx, dy] of KICKS) {
    if (fits(next, cur.x + dx, cur.y + dy)) {
      cur.mat = next;
      cur.x += dx;
      cur.y += dy;
      return;
    }
  }
}

// ── Spawn ──────────────────────────────────────────────────────────────────────
function spawnPiece() {
  const type = queue.shift();
  queue.push(nextType());
  const mat = MINOS[type].map(r => [...r]);
  const x = (COLS >> 1) - (mat[0].length >> 1);
  cur = { type, mat, x, y: -1 };
  holdLocked = false;
  if (!fits(mat, x, -1)) {
    endGame();
  }
}

// ── Lock ───────────────────────────────────────────────────────────────────────
function lock() {
  const overflow = stamp(); // place cells; skip those above row 0
  if (overflow) {
    endGame();
    return;
  }
  const n = clearFull();
  if (n > 0) {
    lines += n;
    score += SCORE_TABLE[n] * level;
    level = Math.min(10, Math.floor(lines / 10) + 1);
    updateHUD();
  }
  spawnPiece();
}

// ── Ghost ──────────────────────────────────────────────────────────────────────
function ghostRow() {
  let gy = cur.y;
  while (fits(cur.mat, cur.x, gy + 1)) gy++;
  return gy;
}

// ── Player actions ─────────────────────────────────────────────────────────────
function moveLeft()  { if (cur && fits(cur.mat, cur.x - 1, cur.y)) cur.x--; }
function moveRight() { if (cur && fits(cur.mat, cur.x + 1, cur.y)) cur.x++; }

function softDrop() {
  if (!cur) return;
  if (fits(cur.mat, cur.x, cur.y + 1)) {
    cur.y++;
    score++;
    updateHUD();
    dropAcc = 0;
  } else {
    lock();
  }
}

function hardDrop() {
  if (!cur) return;
  const gy = ghostRow();
  score += (gy - cur.y) * 2;
  cur.y = gy;
  updateHUD();
  lock();
}

function doHold() {
  if (!cur || holdLocked) return;
  if (heldType === null) {
    const saved = cur.type;
    spawnPiece();          // spawn next; sets holdLocked=false
    heldType = saved;
  } else {
    const swap = heldType;
    heldType = cur.type;
    const mat = MINOS[swap].map(r => [...r]);
    const x = (COLS >> 1) - (mat[0].length >> 1);
    cur = { type: swap, mat, x, y: -1 };
  }
  holdLocked = true;       // prevent hold again until next piece
  renderHold();
}

// ── Drawing ────────────────────────────────────────────────────────────────────
function drawCell(c, col, row, colorIdx, alpha) {
  if (!colorIdx) return;
  c.globalAlpha = alpha ?? 1;
  const px = col * SZ, py = row * SZ;
  c.fillStyle = PALETTE[colorIdx];
  c.fillRect(px + 1, py + 1, SZ - 2, SZ - 2);
  c.fillStyle = 'rgba(255,255,255,0.28)';
  c.fillRect(px + 1, py + 1, SZ - 2, 4);
  c.fillRect(px + 1, py + 1, 4, SZ - 2);
  c.fillStyle = 'rgba(0,0,0,0.38)';
  c.fillRect(px + 1, py + SZ - 5, SZ - 2, 4);
  c.fillRect(px + SZ - 5, py + 1, 4, SZ - 2);
  c.globalAlpha = 1;
}

function renderBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      ctx.strokeRect(c * SZ, r * SZ, SZ, SZ);
  // Locked cells
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawCell(ctx, c, r, board[r][c]);
  if (!cur) return;
  // Ghost
  const gy = ghostRow();
  for (let r = 0; r < cur.mat.length; r++)
    for (let c = 0; c < cur.mat[r].length; c++)
      if (cur.mat[r][c] && gy + r >= 0)
        drawCell(ctx, cur.x + c, gy + r, cur.mat[r][c], 0.18);
  // Active piece
  for (let r = 0; r < cur.mat.length; r++)
    for (let c = 0; c < cur.mat[r].length; c++)
      if (cur.mat[r][c] && cur.y + r >= 0)
        drawCell(ctx, cur.x + c, cur.y + r, cur.mat[r][c]);
}

function drawMini(c, w, h, type) {
  c.clearRect(0, 0, w, h);
  if (!type) return;
  const mat = MINOS[type];
  const mw = mat[0].length, mh = mat.length;
  const cs = Math.min(((w - 16) / mw) | 0, ((h - 16) / mh) | 0);
  const ox = ((w - mw * cs) / 2) | 0;
  const oy = ((h - mh * cs) / 2) | 0;
  for (let r = 0; r < mh; r++) {
    for (let cc = 0; cc < mw; cc++) {
      if (!mat[r][cc]) continue;
      const px = ox + cc * cs, py = oy + r * cs;
      c.fillStyle = PALETTE[type];
      c.fillRect(px + 1, py + 1, cs - 2, cs - 2);
      c.fillStyle = 'rgba(255,255,255,0.28)';
      c.fillRect(px + 1, py + 1, cs - 2, 3);
      c.fillRect(px + 1, py + 1, 3, cs - 2);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.fillRect(px + 1, py + cs - 4, cs - 2, 3);
      c.fillRect(px + cs - 4, py + 1, 3, cs - 2);
    }
  }
}

function renderHold() {
  drawMini(hldCtx, hldCvs.width, hldCvs.height, heldType);
}

function renderNext() {
  nxtCtx.clearRect(0, 0, nxtCvs.width, nxtCvs.height);
  const slotH = (nxtCvs.height / 3) | 0;
  for (let i = 0; i < 3; i++) {
    const type = queue[i];
    if (!type) continue;
    const mat = MINOS[type];
    const mw = mat[0].length, mh = mat.length;
    const cs = Math.min(((nxtCvs.width - 16) / mw) | 0, ((slotH - 16) / mh) | 0);
    const ox = ((nxtCvs.width - mw * cs) / 2) | 0;
    const oyBase = i * slotH + ((slotH - mh * cs) / 2) | 0;
    for (let r = 0; r < mh; r++) {
      for (let c = 0; c < mw; c++) {
        if (!mat[r][c]) continue;
        const px = ox + c * cs;
        const py = oyBase + r * cs;
        nxtCtx.fillStyle = PALETTE[type];
        nxtCtx.fillRect(px + 1, py + 1, cs - 2, cs - 2);
        nxtCtx.fillStyle = 'rgba(255,255,255,0.28)';
        nxtCtx.fillRect(px + 1, py + 1, cs - 2, 3);
        nxtCtx.fillRect(px + 1, py + 1, 3, cs - 2);
        nxtCtx.fillStyle = 'rgba(0,0,0,0.35)';
        nxtCtx.fillRect(px + 1, py + cs - 4, cs - 2, 3);
        nxtCtx.fillRect(px + cs - 4, py + 1, 3, cs - 2);
      }
    }
    if (i < 2) {
      nxtCtx.strokeStyle = 'rgba(255,255,255,0.06)';
      nxtCtx.lineWidth = 1;
      nxtCtx.beginPath();
      nxtCtx.moveTo(8, (i + 1) * slotH);
      nxtCtx.lineTo(nxtCvs.width - 8, (i + 1) * slotH);
      nxtCtx.stroke();
    }
  }
}

// ── Game loop ──────────────────────────────────────────────────────────────────
function loop(ts) {
  if (!running || paused) return;
  const dt = ts - (lastTs ?? ts);
  lastTs = ts;
  dropAcc += dt;
  const spd = SPEEDS[Math.min(level - 1, SPEEDS.length - 1)];
  while (dropAcc >= spd) {
    dropAcc -= spd;
    if (cur) {
      if (fits(cur.mat, cur.x, cur.y + 1)) cur.y++;
      else lock();
    }
  }
  renderBoard();
  renderNext();
  if (running && !paused) rafId = requestAnimationFrame(loop);
}

// ── HUD ────────────────────────────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('score').textContent = score.toLocaleString();
  document.getElementById('level').textContent = level;
  document.getElementById('lines').textContent = lines;
}

function showScreen(id) {
  document.querySelectorAll('.overlay-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById(id).classList.remove('hidden');
}

function hideOverlay() {
  document.getElementById('overlay').style.display = 'none';
}

// ── Game control ───────────────────────────────────────────────────────────────
function startGame() {
  board = emptyBoard();
  bag = []; refillBag();
  queue = [nextType(), nextType(), nextType()];
  heldType = null; holdLocked = false;
  cur = null;
  score = 0; level = 1; lines = 0;
  dropAcc = 0; lastTs = null;
  running = true; paused = false;
  updateHUD();
  renderHold();
  spawnPiece();
  hideOverlay();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

function togglePause() {
  if (!running) return;
  paused = !paused;
  if (paused) {
    showScreen('pauseScreen');
  } else {
    hideOverlay();
    lastTs = null;
    rafId = requestAnimationFrame(loop);
  }
}

function endGame() {
  running = false;
  cancelAnimationFrame(rafId);
  document.getElementById('finalScore').textContent = score.toLocaleString();
  showScreen('gameOverScreen');
}

// ── Keyboard ───────────────────────────────────────────────────────────────────
let dasDir = null, dasTimeout = null, dasInterval = null;
const DAS_DELAY = 160, DAS_RATE = 40;

function startDAS(dir, fn) {
  if (dasDir === dir) return;
  stopDAS();
  dasDir = dir;
  fn();
  dasTimeout = setTimeout(() => {
    dasInterval = setInterval(() => {
      if (running && !paused) fn();
    }, DAS_RATE);
  }, DAS_DELAY);
}

function stopDAS(dir) {
  if (dir && dasDir !== dir) return;
  clearTimeout(dasTimeout);
  clearInterval(dasInterval);
  dasTimeout = dasInterval = null;
  dasDir = null;
}

document.addEventListener('keydown', e => {
  if (!running || paused) {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') togglePause();
    return;
  }
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      startDAS('left', moveLeft);
      break;
    case 'ArrowRight':
      e.preventDefault();
      startDAS('right', moveRight);
      break;
    case 'ArrowDown':
      e.preventDefault();
      softDrop();
      break;
    case 'ArrowUp':
    case 'x': case 'X':
      e.preventDefault();
      tryRotate(rotateCW);
      break;
    case 'z': case 'Z':
      e.preventDefault();
      tryRotate(rotateCCW);
      break;
    case ' ':
      e.preventDefault();
      hardDrop();
      break;
    case 'c': case 'C':
      e.preventDefault();
      doHold();
      break;
    case 'p': case 'P': case 'Escape':
      e.preventDefault();
      togglePause();
      break;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft')  stopDAS('left');
  if (e.key === 'ArrowRight') stopDAS('right');
});

// ── Mobile controls ────────────────────────────────────────────────────────────
function mbtn(id, fn, repeat) {
  const el = document.getElementById(id);
  if (!el) return;
  let iv = null;
  const go = () => { if (running && !paused) fn(); };
  const onStart = e => {
    e.preventDefault();
    go();
    if (repeat) iv = setInterval(go, DAS_RATE);
  };
  const onEnd = e => {
    e.preventDefault();
    clearInterval(iv);
    iv = null;
  };
  el.addEventListener('touchstart',  onStart, { passive: false });
  el.addEventListener('touchend',    onEnd,   { passive: false });
  el.addEventListener('touchcancel', onEnd,   { passive: false });
  el.addEventListener('mousedown',   onStart);
  el.addEventListener('mouseup',     onEnd);
  el.addEventListener('mouseleave',  onEnd);
}

mbtn('moveLeftBtn',    moveLeft,                   true);
mbtn('moveRightBtn',   moveRight,                  true);
mbtn('softDropBtn',    softDrop,                   true);
mbtn('hardDropBtn',    hardDrop);
mbtn('rotateRightBtn', () => tryRotate(rotateCW));
mbtn('rotateLeftBtn',  () => tryRotate(rotateCCW));
mbtn('holdBtn',        doHold);

// ── Button wiring ──────────────────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', startGame);

// ── Initial screen ─────────────────────────────────────────────────────────────
showScreen('startScreen');
