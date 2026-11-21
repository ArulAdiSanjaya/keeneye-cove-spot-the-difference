// Keeneye Cove — the game engine. Owns the state machine (title, playing,
// paused, level complete, time up, victory), the countdown, scoring with a
// combo streak, mistake penalties, the hint budget, and all drawing of the
// two panels plus the found markers, miss flashes and hint pulses that sit
// on top of the painted scenes.

import { SCENES, SCENE_W, SCENE_H } from './scenes.js';

const STORE_KEY = 'keeneye-cove-best';

export class Game {
  constructor(canvasL, canvasR, hud, sound) {
    this.left = canvasL.getContext('2d');
    this.right = canvasR.getContext('2d');
    this.canvasL = canvasL;
    this.canvasR = canvasR;
    this.hud = hud;
    this.sound = sound;
    this.phase = 'title'; // title | playing | paused | level-done | time-up | victory
    this.levelIndex = 0;
    this.score = 0;
    this.best = Number(localStorage.getItem(STORE_KEY) || 0);
    this.resetRun();
    this.lastTickSecond = -1;
    this.bindInput();
  }

  resetRun() {
    this.found = new Set();
    this.mistakes = 0;
    this.combo = 0;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.missFlashes = [];
    this.hintPulse = null;
    this.levelScoreStart = 0;
  }

  get scene() { return SCENES[this.levelIndex]; }
  get remaining() { return this.scene.diffs.length - this.found.size; }

  startGame() {
    this.score = 0;
    this.levelIndex = 0;
    this.resetRun();
    this.startLevel(0);
    this.sound.click();
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.mistakes = 0;
    this.combo = 0;
    this.timeLeft = this.scene.timeLimit;
    this.missFlashes = [];
    this.hintPulse = null;
    this.levelScoreStart = this.score;
    this.phase = 'playing';
    this.lastTickSecond = -1;
    this.syncHud();
    this.showOverlay(null);
  }

  // Freeze a composed scene for the screenshot modes: some differences
  // already found, the clock stopped mid-level, a hint glowing.
  poseForShot(levelIndex, foundIds, timeLeft, hintId) {
    this.levelIndex = levelIndex;
    this.score = 0;
    this.resetRun();
    this.levelIndex = levelIndex;
    foundIds.forEach((id) => { this.found.add(id); this.score += 100; });
    this.timeLeft = timeLeft;
    this.phase = 'playing';
    if (hintId) this.hintPulse = { id: hintId, until: performance.now() + 60000 };
    this.syncHud();
    this.showOverlay(null);
  }

  poseVictory(score) {
    this.score = score;
    this.phase = 'victory';
    this.syncHud();
    this.showOverlay('victory');
  }

  bindInput() {
    const onClick = (canvas) => (ev) => {
      this.sound.ensure();
      if (this.phase !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * (SCENE_W / rect.width);
      const y = (ev.clientY - rect.top) * (SCENE_H / rect.height);
      this.handlePick(x, y);
    };
    this.canvasL.addEventListener('click', onClick(this.canvasL));
    this.canvasR.addEventListener('click', onClick(this.canvasR));
    window.addEventListener('keydown', (ev) => this.handleKey(ev.key));
  }

  handleKey(key) {
    const k = key.toLowerCase();
    if (k === 'h' && this.phase === 'playing') this.useHint();
    else if ((k === 'p' || k === 'escape') && this.phase === 'playing') this.pause();
    else if ((k === 'p' || k === 'escape') && this.phase === 'paused') this.resume();
    else if (k === 'm') this.toggleMute();
    else if (k === 'enter' && this.phase === 'title') this.startGame();
    else if (k === 'n' && this.phase === 'level-done') this.nextLevel();
    else if (k === 'r' && (this.phase === 'time-up' || this.phase === 'victory')) this.startGame();
  }

  handlePick(x, y) {
    const hit = this.scene.diffs.find((d) => {
      if (this.found.has(d.id)) return false;
      const dx = x - d.x, dy = y - d.y;
      return dx * dx + dy * dy <= (d.r + 7) * (d.r + 7);
    });
    if (hit) {
      this.found.add(hit.id);
      this.combo += 1;
      this.score += 100 + (this.combo - 1) * 15;
      this.sound.pop(this.combo);
      if (this.hintPulse && this.hintPulse.id === hit.id) this.hintPulse = null;
      if (this.remaining === 0) this.completeLevel();
    } else {
      this.combo = 0;
      this.mistakes += 1;
      this.score = Math.max(0, this.score - 15);
      this.timeLeft = Math.max(0, this.timeLeft - 4);
      this.missFlashes.push({ x, y, until: performance.now() + 650 });
      this.sound.buzz();
      if (this.timeLeft <= 0) this.timeUp();
    }
    this.syncHud();
  }

  useHint() {
    if (this.hintsLeft <= 0 || this.phase !== 'playing') return;
    const next = this.scene.diffs.find((d) => !this.found.has(d.id));
    if (!next) return;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - 30);
    this.hintPulse = { id: next.id, until: performance.now() + 2600 };
    this.hud.hintText.textContent = next.hint;
    this.sound.sparkle();
    this.syncHud();
  }

  pause() {
    if (this.phase !== 'playing') return;
    this.phase = 'paused';
    this.showOverlay('paused');
  }

  resume() {
    if (this.phase !== 'paused') return;
    this.phase = 'playing';
    this.showOverlay(null);
    this.sound.click();
  }

  completeLevel() {
    const bonus = Math.round(this.timeLeft) * 2;
    this.score += bonus;
    this.phase = 'level-done';
    this.sound.jingle();
    this.hud.doneTitle.textContent = this.scene.name + ' — cleared!';
    this.hud.doneStats.textContent =
      `${this.scene.diffs.length} differences found · ${this.mistakes} mistakes · time bonus +${bonus}`;
    this.showOverlay('level-done');
    this.syncHud();
  }

  nextLevel() {
    if (this.levelIndex + 1 >= SCENES.length) {
      this.phase = 'victory';
      if (this.score > this.best) {
        this.best = this.score;
        localStorage.setItem(STORE_KEY, String(this.best));
      }
      this.hud.victoryStats.textContent =
        `Final score ${this.score} · best ${this.best} · ${this.hintsLeft} hints unspent`;
      this.showOverlay('victory');
      this.sound.jingle();
    } else {
      this.startLevel(this.levelIndex + 1);
    }
    this.syncHud();
  }

  timeUp() {
    this.phase = 'time-up';
    this.sound.deflate();
    this.hud.timeupStats.textContent =
      `${this.found.size} of ${this.scene.diffs.length} found in ${this.scene.name} · score ${this.score}`;
    this.showOverlay('time-up');
  }

  toggleMute() {
    this.sound.muted = !this.sound.muted;
    this.hud.soundBtn.textContent = this.sound.muted ? 'Sound: off (M)' : 'Sound: on (M)';
  }

  showOverlay(which) {
    const map = {
      title: this.hud.ovTitle,
      paused: this.hud.ovPaused,
      'level-done': this.hud.ovDone,
      'time-up': this.hud.ovTimeup,
      victory: this.hud.ovVictory,
    };
    Object.entries(map).forEach(([name, el]) => {
      el.classList.toggle('show', name === which);
    });
  }

  syncHud() {
    const s = this.scene;
    this.hud.levelName.textContent = `Scene ${this.levelIndex + 1} of ${SCENES.length} — ${s.name}`;
    this.hud.counter.textContent = this.phase === 'title'
      ? 'Find every difference between the two pictures'
      : `Found ${this.found.size} of ${s.diffs.length} — ${this.remaining} to go`;
    this.hud.score.textContent = `Score ${this.score}`;
    this.hud.hints.textContent = `Hints ${this.hintsLeft}`;
    this.hud.mistakes.textContent = `Misses ${this.mistakes}`;
    const frac = Math.max(0, this.timeLeft / s.timeLimit);
    this.hud.timerBar.style.width = `${frac * 100}%`;
    this.hud.timerBar.classList.toggle('low', this.timeLeft <= 15 && this.phase === 'playing');
    this.hud.timerText.textContent = this.phase === 'title' ? '' : `${Math.ceil(this.timeLeft)}s`;
  }

  update(dt, now) {
    if (this.phase === 'playing') {
      this.timeLeft -= dt;
      const sec = Math.ceil(this.timeLeft);
      if (sec !== this.lastTickSecond) {
        this.lastTickSecond = sec;
        if (sec <= 10 && sec > 0) this.sound.tick();
        this.syncHud();
      }
      if (this.timeLeft <= 0) { this.timeLeft = 0; this.timeUp(); }
    }
    this.missFlashes = this.missFlashes.filter((f) => f.until > now);
    if (this.hintPulse && this.hintPulse.until <= now) this.hintPulse = null;
  }

  draw(now) {
    const altered = new Set(this.scene.diffs.map((d) => d.id));
    this.scene.paint(this.left, new Set());
    this.scene.paint(this.right, altered);
    [this.left, this.right].forEach((ctx) => this.drawMarkers(ctx, now));
    if (this.phase === 'playing' && this.timeLeft <= 15) {
      [this.left, this.right].forEach((ctx) => {
        ctx.strokeStyle = `rgba(226, 75, 60, ${0.35 + 0.25 * Math.sin(now / 160)})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, SCENE_W - 6, SCENE_H - 6);
      });
    }
  }

  drawMarkers(ctx, now) {
    this.scene.diffs.forEach((d) => {
      if (!this.found.has(d.id)) return;
      const pulse = 1 + 0.06 * Math.sin(now / 220);
      ctx.strokeStyle = '#ffd23e';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(d.x, d.y, (d.r + 9) * pulse, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(20, 60, 30, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(d.x, d.y, (d.r + 9) * pulse + 3, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#ffd23e';
      ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x - 8, d.y + 1); ctx.lineTo(d.x - 2.5, d.y + 7); ctx.lineTo(d.x + 9, d.y - 6);
      ctx.stroke();
    });
    if (this.hintPulse) {
      const d = this.scene.diffs.find((v) => v.id === this.hintPulse.id);
      if (d) {
        const grow = ((now / 9) % 26);
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.95)';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r + 6 + grow * 0.4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(4, d.r - grow * 0.5), 0, Math.PI * 2); ctx.stroke();
      }
    }
    this.missFlashes.forEach((f) => {
      const a = Math.max(0, (f.until - now) / 650);
      ctx.strokeStyle = `rgba(240, 70, 55, ${a})`;
      ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(f.x - 13, f.y - 13); ctx.lineTo(f.x + 13, f.y + 13);
      ctx.moveTo(f.x + 13, f.y - 13); ctx.lineTo(f.x - 13, f.y + 13);
      ctx.stroke();
    });
  }
}
