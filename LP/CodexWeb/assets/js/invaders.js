// Simple Space Invaders-like mini game
(() => {
  const canvas = document.getElementById('invaders');
  const scoreEl = document.getElementById('iv-score');
  const livesEl = document.getElementById('iv-lives');
  const levelEl = document.getElementById('iv-level');
  const btn = document.getElementById('iv-btn');
  if (!canvas || !btn) return;

  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const BASE_W = 960, BASE_H = 600;
  let scale = 1;

  function resize() {
    const parent = canvas.parentElement;
    const maxW = Math.min(BASE_W, parent ? parent.clientWidth : BASE_W);
    scale = maxW / BASE_W;
    canvas.style.width = `${Math.floor(BASE_W * scale)}px`;
    canvas.style.height = `${Math.floor(BASE_H * scale)}px`;
    canvas.width = Math.floor(BASE_W * scale * DPR);
    canvas.height = Math.floor(BASE_H * scale * DPR);
    ctx.setTransform(DPR * scale, 0, 0, DPR * scale, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Game state
  const state = {
    running: false,
    paused: false,
    level: 1,
    score: 0,
    lives: 3,
    t: 0,
    last: performance.now(),
  };

  const player = { x: BASE_W/2 - 28, y: BASE_H - 60, w: 56, h: 16, speed: 360, cooldown: 0 };
  let bullets = [];
  let aliens = [];
  let dir = 1; // 1: right, -1: left
  let alienSpeed = 60;
  let stepDown = false;

  function spawnAliens(level) {
    aliens = [];
    const rows = 5, cols = 10;
    const ox = 140, oy = 80; // origin
    const dx = 64, dy = 48;
    for (let r=0; r<rows; r++){
      for (let c=0; c<cols; c++){
        aliens.push({ x: ox + c*dx, y: oy + r*dy, w: 32, h: 20, alive: true, v: 1 + r*0.05 + level*0.05 });
      }
    }
    dir = 1;
    alienSpeed = 60 + (level-1) * 10;
  }

  function resetGame() {
    state.level = 1; state.score = 0; state.lives = 3;
    player.x = BASE_W/2 - player.w/2; player.cooldown = 0;
    bullets = [];
    spawnAliens(state.level);
    updateHUD();
  }

  function updateHUD(){
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (livesEl) livesEl.textContent = String(state.lives);
    if (levelEl) levelEl.textContent = String(state.level);
  }

  // Input
  const keys = new Set();
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft','ArrowRight',' ','KeyA','KeyD'].includes(e.code)) e.preventDefault();
    keys.add(e.code);
    if (e.code === 'KeyP') togglePause();
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));

  function shoot(){
    if (player.cooldown > 0) return;
    bullets.push({ x: player.x + player.w/2 - 2, y: player.y - 10, w: 4, h: 12, vy: -540 });
    player.cooldown = 0.25;
  }

  function togglePause(){
    if (!state.running) return;
    state.paused = !state.paused;
    btn.textContent = state.paused ? 'Resume' : 'Pause';
  }

  btn.addEventListener('click', () => {
    if (!state.running){ start(); return; }
    if (state.paused){ state.paused = false; btn.textContent = 'Pause'; return; }
    state.paused = true; btn.textContent = 'Resume';
  });

  function start(){
    resetGame();
    state.running = true; state.paused = false; btn.textContent = 'Pause';
  }

  function aabb(a,b){ return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  // Loop
  function loop(now){
    const dt = Math.min(0.033, (now - state.last) / 1000);
    state.last = now; state.t += dt;
    drawBackground();
    if (state.running && !state.paused){ update(dt); }
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function drawBackground(){
    // Clear
    ctx.clearRect(0,0,BASE_W,BASE_H);
    // Subtle starfield
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i=0;i<120;i++){
      const x = (i*73 % BASE_W);
      const y = (i*139 % BASE_H);
      const r = (i % 3) + 0.5;
      ctx.fillStyle = i % 7 === 0 ? '#a8e8ff' : '#b1c2ff';
      ctx.fillRect((x + (state.t*10)%BASE_W)%BASE_W, y, r, r);
    }
    ctx.restore();
  }

  function update(dt){
    // Player move
    const left = keys.has('ArrowLeft') || keys.has('KeyA');
    const right = keys.has('ArrowRight') || keys.has('KeyD');
    if (left && !right) player.x -= player.speed * dt;
    if (right && !left) player.x += player.speed * dt;
    player.x = Math.max(20, Math.min(BASE_W - player.w - 20, player.x));
    // Shoot
    if (keys.has('Space')) shoot();
    if (player.cooldown > 0) player.cooldown -= dt;

    // Bullets
    for (const b of bullets) b.y += b.vy * dt;
    bullets = bullets.filter(b => b.y + b.h > 0);

    // Aliens movement
    stepDown = false;
    let minX = Infinity, maxX = -Infinity;
    for (const a of aliens){ if (!a.alive) continue; minX = Math.min(minX, a.x); maxX = Math.max(maxX, a.x + a.w); }
    if (minX === Infinity){ // cleared
      state.level += 1; updateHUD(); spawnAliens(state.level);
    } else {
      const speed = alienSpeed;
      if (dir > 0 && maxX + speed*dt > BASE_W - 20){ dir = -1; stepDown = true; }
      if (dir < 0 && minX - speed*dt < 20){ dir = 1; stepDown = true; }
      for (const a of aliens){ if (!a.alive) continue; a.x += dir * speed * dt; if (stepDown) a.y += 24; }
    }

    // Collisions bullets vs aliens
    for (const b of bullets){
      for (const a of aliens){
        if (!a.alive) continue;
        if (aabb(b,a)){
          a.alive = false; b.y = -9999; state.score += 10; updateHUD();
        }
      }
    }
    bullets = bullets.filter(b => b.y > -50);

    // Aliens reach player line
    for (const a of aliens){
      if (a.alive && a.y + a.h >= player.y - 6){ loseLife(); break; }
    }
  }

  function loseLife(){
    state.lives -= 1; updateHUD();
    player.x = BASE_W/2 - player.w/2; player.cooldown = 0; bullets = [];
    spawnAliens(state.level);
    if (state.lives <= 0){
      state.running = false; state.paused = false; btn.textContent = 'Restart';
      // Simple game-over flash
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0,0,BASE_W,BASE_H); ctx.restore();
    }
  }

  function draw(){
    // Player
    drawPlayer();
    // Bullets
    ctx.fillStyle = '#9ef0f0';
    for (const b of bullets){ ctx.fillRect(b.x, b.y, b.w, b.h); }
    // Aliens
    for (const a of aliens){ if (!a.alive) continue; drawAlien(a); }
    // Overlay when not running
    if (!state.running){
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.5)';
      ctx.fillRect(0,0,BASE_W,BASE_H);
      ctx.fillStyle = '#e7ecff';
      ctx.font = '700 32px ui-sans-serif, system-ui, -apple-system, Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText('SPACE INVADERS', BASE_W/2, BASE_H/2 - 10);
      ctx.font = '500 16px ui-sans-serif, system-ui';
      ctx.fillStyle = '#a7b0c6';
      ctx.fillText('Press Start to play', BASE_W/2, BASE_H/2 + 18);
      ctx.restore();
    }
    if (state.paused){
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.35)';
      ctx.fillRect(0,0,BASE_W,BASE_H);
      ctx.fillStyle = '#e7ecff';
      ctx.font = '700 28px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', BASE_W/2, BASE_H/2);
      ctx.restore();
    }
  }

  function drawPlayer(){
    const {x,y,w,h} = player;
    ctx.fillStyle = '#7aa2ff';
    // Simple ship
    ctx.fillRect(x, y, w, h);
    ctx.fillRect(x + w*0.2, y - h*0.6, w*0.6, h*0.6);
  }

  function drawAlien(a){
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.fillStyle = '#b1c2ff';
    // pixel-ish invader
    const s = 2;
    const pattern = [
      '00111100',
      '01111110',
      '11111111',
      '11011011',
      '11111111',
      '00100100',
    ];
    for (let r=0;r<pattern.length;r++){
      for (let c=0;c<8;c++){
        if (pattern[r][c] === '1') ctx.fillRect(c*s, r*s, s, s);
      }
    }
    ctx.restore();
  }
})();

