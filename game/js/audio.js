// Keeneye Cove — sound kit. Every sound is synthesised live with WebAudio:
// no audio files, no network, nothing to load. A tiny envelope-and-oscillator
// kit that the engine calls for finds, misses, ticks, hints and jingles.

export class SoundKit {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, start, dur, type = 'sine', gain = 0.16, slideTo = null) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A find: a bright pop that climbs with the combo streak.
  pop(combo = 0) {
    const base = 520 + Math.min(combo, 8) * 60;
    this.tone(base, 0, 0.14, 'triangle', 0.22, base * 1.6);
    this.tone(base * 2, 0.03, 0.1, 'sine', 0.1);
  }

  // A miss: a dull thud that slides down.
  buzz() {
    this.tone(150, 0, 0.18, 'sawtooth', 0.07, 90);
  }

  // The last-seconds clock tick.
  tick() {
    this.tone(1150, 0, 0.05, 'square', 0.05);
  }

  // A hint being spent: a soft sparkle.
  sparkle() {
    this.tone(880, 0, 0.12, 'sine', 0.12);
    this.tone(1320, 0.07, 0.16, 'sine', 0.1);
  }

  // Level complete: a short rising jingle.
  jingle() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this.tone(n, i * 0.11, 0.22, 'triangle', 0.16));
  }

  // Game over: three falling notes.
  deflate() {
    const notes = [392, 330, 262];
    notes.forEach((n, i) => this.tone(n, i * 0.16, 0.26, 'triangle', 0.14));
  }

  click() {
    this.tone(660, 0, 0.06, 'sine', 0.08);
  }
}
