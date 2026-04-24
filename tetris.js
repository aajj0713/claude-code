'use strict';

// ── Constants ──────────────────────────────────────────────────────────────────
const COLS = 10;
const ROWS = 20;
const CELL = 30;
const COLORS = [
  null,
  '#00d4ff', // I - cyan
  '#ffd700', // O - yellow
  '#bf00ff', // T - purple
  '#00e676', // S - green
  '#ff1744', // Z - red
  '#ff6d00', // J - orange
  '#2979ff', // L - blue
];

const PIECES = [
  null,
  // I
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  // O
  [[2,2],[2,2]],
  // T
  [[0,3,0],[3,3,3],[0,0,0]],
  // S
  [[0,4,4],[4,4,0],[0,0,0]],
  // Z
  [[5,5,0],[0,5,5],[0,0,0]],
  // J
  [[6,0,0],[6,6,6],[0,0,0]],
  // L
  [[0,0,7],[7,7,7],[0,0,0]],
];

const SCORES = [0, 100, 300, 500, 800];
const DROP_INTERVAL = [800, 700, 600, 500, 400, 320, 240, 180, 130, 90, 60];

// ── Canvas setup ───────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdCtx = holdCanvas.getContext('2d');

// ── Game state ─────────────────────────────────────────────────────────────────
let board, piece, nextQueue, holdPiece, holdUsed;
let score, level, lines;
let gameRunning, paused, gameOver;
let dropTimer, lastTime;
let animationId;

// ── Bag randomizer ──────────────────────────────────────────────────────────────
let bag = [];
function refillBag() {
  bag = [1, 2, 3, 4, 5, 6, 7];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}
function nextFromBag() {
  if (bag.length === 0) refillBag();
  return bag.pop();
}

// ── Board utilities ─────────────────────────────────────────────────────────────
function createBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function isValid(matrix, ox, oy) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const nx = ox + c, ny = oy + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function lockPiece() {
  const { matrix, x, y } = piece;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const ny = y + r, nx = x + c;
      if (ny < 0) { triggerGameOver(); return; }
      board[ny][nx] = matrix[r][c];
    }
  }
  clearLines();
  spawnPiece();
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) {
      board.splice(r, 1);
      board.unshift(new Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared > 0) {
    lines += cleared;
    score += SCORES[cleared] * level;
    level = Math.min(10, Math.floor(lines / 10) + 1);
    updateUI();
  }
}

// ── Piece management ────────────────────────────────────────────────────────────
function spawnPiece() {
  const type = nextQueue.shift();
  nextQueue.push(nextFromBag());
  piece = {
    type,
    matrix: PIECES[type].map(row => [...row]),
    x: Math.floor(COLS / 2) - Math.floor(PIECES[type][0].length / 2),
    y: -1,
  };
  holdUsed = false;
  if (!isValid(piece.matrix, piece.x, piece.y)) {
    triggerGameOver();
  }
}

function rotateCW(matrix) {
  const n = matrix.length, m = matrix[0].length;
  const out = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < m; c++)
      out[c][n - 1 - r] = matrix[r][c];
  return out;
}

function rotateCCW(matrix) {
  return rotateCW(rotateCW(rotateCW(matrix)));
}

// Wall-kick offsets (SRS simplified)
const KICKS = [[0,0],[-1,0],[1,0],[0,-1],[-1,-1],[1,-1]];

function tryRotate(rotFn) {
  const rotated = rotFn(piece.matrix);
  for (const [dx, dy] of KICKS) {
    if (isValid(rotated, piece.x + dx, piece.y + dy)) {
      piece.matrix = rotated;
      piece.x += dx;
      piece.y += dy;
      return;
    }
  }
}

function ghostY() {
  let gy = piece.y;
  while (isValid(piece.matrix, piece.x, gy + 1)) gy++;
  return gy;
}

// ── Controls ────────────────────────────────────────────────────────────────────
function moveLeft()  { if (isValid(piece.matrix, piece.x - 1, piece.y)) piece.x--; }
function moveRight() { if (isValid(piece.matrix, piece.x + 1, piece.y)) piece.x++; }

function softDrop() {
  if (isValid(piece.matrix, piece.x, piece.y + 1)) {
    piece.y++;
    score++;
    updateUI();
    dropTimer = 0;
  } else {
    lockPiece();
  }
}

function hardDrop() {
  const gy = ghostY();
  score += (gy - piece.y) * 2;
  piece.y = gy;
  updateUI();
  lockPiece();
}

function hold() {
  if (holdUsed) return;
  holdUsed = true;
  if (holdPiece === null) {
    holdPiece = piece.type;
    spawnPiece();
  } else {
    const tmp = holdPiece;
    holdPiece = piece.type;
    piece = {
      type: tmp,
      matrix: PIECES[tmp].map(row => [...row]),
      x: Math.floor(COLS / 2) - Math.floor(PIECES[tmp][0].length / 2),
      y: -1,
    };
  }
  drawHold();
}

// ── Drawing ─────────────────────────────────────────────────────────────────────
function drawCell(context, x, y, colorIndex, alpha = 1) {
  if (!colorIndex) return;
  const color = COLORS[colorIndex];
  context.globalAlpha = alpha;
  context.fillStyle = color;
  context.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);

  // Highlight
  context.fillStyle = 'rgba(255,255,255,0.25)';
  context.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, 4);
  context.fillRect(x * CELL + 1, y * CELL + 1, 4, CELL - 2);

  // Shadow
  context.fillStyle = 'rgba(0,0,0,0.35)';
  context.fillRect(x * CELL + 1, y * CELL + CELL - 5, CELL - 2, 4);
  context.fillRect(x * CELL + CELL - 5, y * CELL + 1, 4, CELL - 2);

  context.globalAlpha = 1;
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
    }
  }
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawCell(ctx, c, r, board[r][c]);
}

function drawGhost() {
  const gy = ghostY();
  for (let r = 0; r < piece.matrix.length; r++)
    for (let c = 0; c < piece.matrix[r].length; c++)
      if (piece.matrix[r][c])
        drawCell(ctx, piece.x + c, gy + r, piece.matrix[r][c], 0.2);
}

function drawActivePiece() {
  for (let r = 0; r < piece.matrix.length; r++)
    for (let c = 0; c < piece.matrix[r].length; c++)
      if (piece.matrix[r][c] && piece.y + r >= 0)
        drawCell(ctx, piece.x + c, piece.y + r, piece.matrix[r][c]);
}

function drawMiniPiece(context, type, canvasW, canvasH) {
  context.clearRect(0, 0, canvasW, canvasH);
  if (!type) return;
  const matrix = PIECES[type];
  const mw = matrix[0].length, mh = matrix.length;
  const cellSize = Math.min(Math.floor((canvasW - 16) / mw), Math.floor((canvasH - 16) / mh));
  const ox = Math.floor((canvasW - mw * cellSize) / 2);
  const oy = Math.floor((canvasH - mh * cellSize) / 2);

  context.fillStyle = COLORS[type];
  for (let r = 0; r < mh; r++) {
    for (let c = 0; c < mw; c++) {
      if (!matrix[r][c]) continue;
      const px = ox + c * cellSize, py = oy + r * cellSize;
      context.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
      context.fillStyle = 'rgba(255,255,255,0.25)';
      context.fillRect(px + 1, py + 1, cellSize - 2, 3);
      context.fillRect(px + 1, py + 1, 3, cellSize - 2);
      context.fillStyle = 'rgba(0,0,0,0.3)';
      context.fillRect(px + 1, py + cellSize - 4, cellSize - 2, 3);
      context.fillRect(px + cellSize - 4, py + 1, 3, cellSize - 2);
      context.fillStyle = COLORS[type];
    }
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const slotH = nextCanvas.height / 3;
  for (let i = 0; i < 3; i++) {
    const type = nextQueue[i];
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = nextCanvas.width;
    tmpCanvas.height = slotH;
    const tmpCtx = tmpCanvas.getContext('2d');
    drawMiniPiece(tmpCtx, type, nextCanvas.width, slotH);
    nextCtx.drawImage(tmpCanvas, 0, i * slotH);
    if (i < 2) {
      nextCtx.strokeStyle = 'rgba(255,255,255,0.06)';
      nextCtx.lineWidth = 1;
      nextCtx.beginPath();
      nextCtx.moveTo(8, (i + 1) * slotH);
      nextCtx.lineTo(nextCanvas.width - 8, (i + 1) * slotH);
      nextCtx.stroke();
    }
  }
}

function drawHold() {
  drawMiniPiece(holdCtx, holdPiece, holdCanvas.width, holdCanvas.height);
}

function render() {
  drawBoard();
  if (piece) {
    drawGhost();
    drawActivePiece();
  }
  drawNext();
}

// ── Game loop ───────────────────────────────────────────────────────────────────
function gameLoop(ts) {
  if (!gameRunning || paused) return;
  const dt = ts - (lastTime || ts);
  lastTime = ts;

  dropTimer += dt;
  const interval = DROP_INTERVAL[Math.min(level - 1, DROP_INTERVAL.length - 1)];
  if (dropTimer >= interval) {
    dropTimer = 0;
    if (isValid(piece.matrix, piece.x, piece.y + 1)) {
      piece.y++;
    } else {
      lockPiece();
    }
  }

  render();
  if (gameRunning && !paused) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// ── UI helpers ──────────────────────────────────────────────────────────────────
function updateUI() {
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

// ── Start / pause / gameover ────────────────────────────────────────────────────
function initGame() {
  board = createBoard();
  bag = [];
  refillBag();
  nextQueue = [nextFromBag(), nextFromBag(), nextFromBag()];
  holdPiece = null;
  holdUsed = false;
  score = 0;
  level = 1;
  lines = 0;
  dropTimer = 0;
  lastTime = null;
  gameRunning = true;
  paused = false;
  gameOver = false;

  updateUI();
  drawHold();
  drawNext();
  spawnPiece();
  hideOverlay();

  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (!gameRunning || gameOver) return;
  paused = !paused;
  if (paused) {
    showScreen('pauseScreen');
  } else {
    hideOverlay();
    lastTime = null;
    animationId = requestAnimationFrame(gameLoop);
  }
}

function triggerGameOver() {
  gameRunning = false;
  gameOver = true;
  cancelAnimationFrame(animationId);
  document.getElementById('finalScore').textContent = score.toLocaleString();
  showScreen('gameOverScreen');
}

// ── Keyboard ────────────────────────────────────────────────────────────────────
let dasTimer = null, dasActive = false;
const DAS_DELAY = 170, DAS_RATE = 50;

function startDAS(fn) {
  fn();
  clearInterval(dasTimer);
  dasActive = true;
  dasTimer = setTimeout(() => {
    if (!dasActive) return;
    dasTimer = setInterval(() => { if (gameRunning && !paused) fn(); }, DAS_RATE);
  }, DAS_DELAY);
}

function stopDAS() {
  dasActive = false;
  clearTimeout(dasTimer);
  clearInterval(dasTimer);
  dasTimer = null;
}

document.addEventListener('keydown', e => {
  if (!gameRunning || paused) {
    if (e.key === 'p' || e.key === 'P') togglePause();
    return;
  }
  switch (e.key) {
    case 'ArrowLeft':  e.preventDefault(); startDAS(moveLeft);  break;
    case 'ArrowRight': e.preventDefault(); startDAS(moveRight); break;
    case 'ArrowDown':  e.preventDefault(); softDrop();           break;
    case 'ArrowUp':
    case 'x': case 'X': e.preventDefault(); tryRotate(rotateCW);  break;
    case 'z': case 'Z': e.preventDefault(); tryRotate(rotateCCW); break;
    case ' ':           e.preventDefault(); hardDrop();            break;
    case 'c': case 'C': e.preventDefault(); hold();               break;
    case 'p': case 'P': e.preventDefault(); togglePause();        break;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopDAS();
});

// ── Touch / mobile buttons ───────────────────────────────────────────────────────
function bindBtn(id, fn, repeat = false) {
  const el = document.getElementById(id);
  if (!el) return;

  let intervalId = null;
  function trigger() { if (gameRunning && !paused) fn(); }

  el.addEventListener('touchstart', e => {
    e.preventDefault();
    trigger();
    if (repeat) intervalId = setInterval(trigger, DAS_RATE);
  }, { passive: false });

  el.addEventListener('touchend', e => {
    e.preventDefault();
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }, { passive: false });

  el.addEventListener('mousedown', e => {
    e.preventDefault();
    trigger();
    if (repeat) intervalId = setInterval(trigger, DAS_RATE);
  });

  el.addEventListener('mouseup', () => {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  });
}

bindBtn('moveLeftBtn',    moveLeft,              true);
bindBtn('moveRightBtn',   moveRight,             true);
bindBtn('softDropBtn',    softDrop,              true);
bindBtn('hardDropBtn',    hardDrop);
bindBtn('rotateRightBtn', () => tryRotate(rotateCW));
bindBtn('rotateLeftBtn',  () => tryRotate(rotateCCW));
bindBtn('holdBtn',        hold);

// ── Button wiring ───────────────────────────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', initGame);

// ── Initial render ──────────────────────────────────────────────────────────────
showScreen('startScreen');
ctx.clearRect(0, 0, canvas.width, canvas.height);
