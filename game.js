(function () {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const startScreen = document.getElementById('startScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const scoreEl = document.getElementById('score');
  const livesEl = document.getElementById('lives');
  const finalScoreEl = document.getElementById('finalScore');

  const W = canvas.width;
  const H = canvas.height;

  let gameRunning = false;
  let score = 0;
  let lives = 3;
  let animationId = null;

  const player = {
    x: W / 2 - 20,
    y: H - 60,
    w: 40,
    h: 40,
    speed: 6,
    dx: 0
  };

  let bullets = [];
  let enemies = [];
  let stars = [];
  const keys = {};

  const BULLET_SPEED = -10;
  const BULLET_W = 4;
  const BULLET_H = 12;
  const ENEMY_SPEED = 2;
  const ENEMY_W = 36;
  const ENEMY_H = 28;
  const SPAWN_INTERVAL = 1200;
  let lastSpawn = 0;

  function initStars() {
    stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5
      });
    }
  }

  function drawStars() {
    stars.forEach(s => {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + s.r / 2})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y += s.speed;
      if (s.y > H) {
        s.y = 0;
        s.x = Math.random() * W;
      }
    });
  }

  function drawPlayer() {
    const { x, y, w, h } = player;
    ctx.save();
    ctx.fillStyle = '#00f5d4';
    ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w / 2, y + h - 8);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function shoot() {
    if (!gameRunning) return;
    bullets.push({
      x: player.x + player.w / 2 - BULLET_W / 2,
      y: player.y,
      w: BULLET_W,
      h: BULLET_H,
      dy: BULLET_SPEED
    });
  }

  function spawnEnemy() {
    const x = 30 + Math.random() * (W - 60 - ENEMY_W);
    enemies.push({
      x,
      y: -ENEMY_H,
      w: ENEMY_W,
      h: ENEMY_H,
      dy: ENEMY_SPEED
    });
  }

  function rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update(dt) {
    if (!gameRunning) return;

    player.x += player.dx * (dt / 16);
    player.x = Math.max(0, Math.min(W - player.w, player.x));

    bullets.forEach((b, i) => {
      b.y += b.dy;
      if (b.y + b.h < 0) bullets.splice(i, 1);
    });
    bullets = bullets.filter(b => b.y + b.h >= 0);

    enemies.forEach(e => {
      e.y += e.dy;
    });
    const escaped = enemies.filter(e => e.y > H);
    if (escaped.length) {
      lives -= escaped.length;
      livesEl.textContent = lives;
      enemies = enemies.filter(e => e.y <= H);
      if (lives <= 0) endGame();
    }

    const hitBullets = new Set();
    const hitEnemies = new Set();
    bullets.forEach((b, bi) => {
      enemies.forEach((e, ei) => {
        if (rectOverlap(b, e)) {
          hitBullets.add(bi);
          hitEnemies.add(ei);
          score += 10;
          scoreEl.textContent = score;
        }
      });
    });
    bullets = bullets.filter((_, i) => !hitBullets.has(i));
    enemies = enemies.filter((_, i) => !hitEnemies.has(i));

    const playerHit = enemies.find(e => rectOverlap(player, e));
    if (playerHit) {
      lives--;
      livesEl.textContent = lives;
      enemies = enemies.filter(e => e !== playerHit);
      if (lives <= 0) endGame();
    }

    const now = Date.now();
    if (now - lastSpawn > SPAWN_INTERVAL) {
      spawnEnemy();
      lastSpawn = now;
    }
  }

  function drawBullets() {
    ctx.fillStyle = '#00ffdd';
    ctx.shadowColor = 'rgba(0, 255, 221, 0.8)';
    ctx.shadowBlur = 6;
    bullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });
    ctx.shadowBlur = 0;
  }

  function drawEnemies() {
    enemies.forEach(e => {
      ctx.fillStyle = '#f72585';
      ctx.shadowColor = 'rgba(247, 37, 133, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(e.x + e.w / 2, e.y + e.h);
      ctx.lineTo(e.x + e.w, e.y);
      ctx.lineTo(e.x + e.w / 2, e.y + 8);
      ctx.lineTo(e.x, e.y);
      ctx.closePath();
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  function render() {
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, W, H);
    drawStars();
    drawPlayer();
    drawBullets();
    drawEnemies();
  }

  function gameLoop(timestamp) {
    const dt = timestamp - (gameLoop.last || timestamp);
    gameLoop.last = timestamp;
    update(dt);
    render();
    if (gameRunning) animationId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    bullets = [];
    enemies = [];
    lastSpawn = Date.now();
    player.x = W / 2 - player.w / 2;
    player.y = H - 60;
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    initStars();
    gameLoop.last = 0;
    requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
  }

  startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    startGame();
  });

  restartBtn.addEventListener('click', startGame);

  document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      keys.left = true;
      e.preventDefault();
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      keys.right = true;
      e.preventDefault();
    }
    if (e.code === 'Space') {
      e.preventDefault();
      shoot();
    }
  });

  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  });

  setInterval(() => {
    player.dx = 0;
    if (keys.left) player.dx = -player.speed;
    if (keys.right) player.dx = player.speed;
  }, 16);
})();
