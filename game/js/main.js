// Keeneye Cove — bootstrap. Wires the page's buttons to the engine, runs
// the render loop, and answers the screenshot poses (?shot=cover, ?shot=
// bakery, ?shot=hollow, ?shot=win) that the entry's screenshots are taken
// from: each pose freezes a real mid-game moment — differences already
// ringed, several still hidden, the counter showing how many remain.

import { Game } from './engine.js';
import { SoundKit } from './audio.js';

const $ = (id) => document.getElementById(id);

const hud = {
  levelName: $('levelName'),
  counter: $('counter'),
  score: $('score'),
  hints: $('hints'),
  mistakes: $('mistakes'),
  timerBar: $('timerBar'),
  timerText: $('timerText'),
  hintText: $('hintText'),
  soundBtn: $('soundBtn'),
  doneTitle: $('doneTitle'),
  doneStats: $('doneStats'),
  timeupStats: $('timeupStats'),
  victoryStats: $('victoryStats'),
  ovTitle: $('ovTitle'),
  ovPaused: $('ovPaused'),
  ovDone: $('ovDone'),
  ovTimeup: $('ovTimeup'),
  ovVictory: $('ovVictory'),
};

const sound = new SoundKit();
const game = new Game($('panelLeft'), $('panelRight'), hud, sound);
window.KEENEYE = game; // a handle for play-testing and screenshot poses

$('bestLabel').textContent = game.best > 0 ? `Best score so far: ${game.best}` : '';

$('startBtn').addEventListener('click', () => game.startGame());
$('resumeBtn').addEventListener('click', () => game.resume());
$('nextBtn').addEventListener('click', () => game.nextLevel());
$('retryBtn').addEventListener('click', () => game.startGame());
$('againBtn').addEventListener('click', () => game.startGame());
$('hintBtn').addEventListener('click', () => { sound.ensure(); game.useHint(); });
$('pauseBtn').addEventListener('click', () => {
  if (game.phase === 'playing') game.pause();
  else if (game.phase === 'paused') game.resume();
});
$('soundBtn').addEventListener('click', () => game.toggleMute());

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot === 'cover') {
  game.poseForShot(0, ['harbour-moon', 'harbour-sail'], 97, 'harbour-lantern');
} else if (shot === 'bakery') {
  game.poseForShot(1, ['bakery-clock', 'bakery-cake', 'bakery-sign'], 121, 'bakery-cat');
} else if (shot === 'hollow') {
  game.poseForShot(2, ['hollow-owl', 'hollow-spots', 'hollow-door', 'hollow-lantern'], 143, 'hollow-firefly');
} else if (shot === 'win') {
  game.levelIndex = 2;
  ['hollow-owl', 'hollow-spots', 'hollow-door', 'hollow-lantern', 'hollow-star', 'hollow-stone', 'hollow-firefly']
    .forEach((id) => game.found.add(id));
  game.poseVictory(2840);
} else {
  game.showOverlay('title');
  game.syncHud();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!shot) game.update(dt, now); // poses stay frozen for the camera
  else game.draw && game.update(0, now);
  game.draw(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
