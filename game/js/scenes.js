// Keeneye Cove — the three scenes. Each scene is painted twice from the same
// code: once plain (the left panel) and once with a set of difference ids
// "altered" (the right panel). A difference is a small, deliberate change —
// a colour swapped, an object missing, a hand of a clock moved — drawn at a
// known point, so the engine can test clicks against it and ring it when it
// is found. All art is original flat-colour canvas drawing, seeded so both
// panels and every screenshot render identically.

export const SCENE_W = 500;
export const SCENE_H = 620;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function rr(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
}

function tri(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();
}

function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
}

function lantern(ctx, x, y, s, colour) {
  ctx.strokeStyle = 'rgba(20,16,40,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 14 * s); ctx.lineTo(x, y - 6 * s); ctx.stroke();
  rr(ctx, x - 9 * s, y - 6 * s, 18 * s, 20 * s, 5 * s, colour);
  circle(ctx, x, y + 4 * s, 4.5 * s, 'rgba(255,244,190,0.95)');
}

/* ---------------- Scene 1: Lantern Harbour ---------------- */

function paintHarbour(ctx, alt) {
  const sky = ctx.createLinearGradient(0, 0, 0, 390);
  sky.addColorStop(0, '#171c46'); sky.addColorStop(0.55, '#472a58'); sky.addColorStop(1, '#c65b39');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 500, 390);

  const stars = rng(11);
  ctx.fillStyle = 'rgba(255,246,214,0.85)';
  for (let i = 0; i < 42; i++) {
    const x = stars() * 500, y = stars() * 200, r = stars() * 1.6 + 0.5;
    ctx.globalAlpha = 0.35 + stars() * 0.6;
    ctx.fillRect(x, y, r, r);
  }
  ctx.globalAlpha = 1;

  // DIFF harbour-moon: a full moon on the left, a crescent on the right.
  circle(ctx, 415, 80, 30, '#f6e7bd');
  circle(ctx, 405, 72, 6, '#e8d5a4'); circle(ctx, 428, 92, 4, '#e8d5a4');
  if (alt.has('harbour-moon')) { circle(ctx, 400, 70, 26, '#23204e'); }

  // Distant headland and the harbour houses (right).
  ctx.fillStyle = '#241b3d';
  ctx.beginPath(); ctx.moveTo(0, 390); ctx.lineTo(0, 330); ctx.quadraticCurveTo(90, 300, 180, 345); ctx.lineTo(260, 390); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2b2145';
  rr(ctx, 330, 268, 62, 122, 3, '#2b2145'); rr(ctx, 404, 244, 74, 146, 3, '#2b2145'); rr(ctx, 300, 300, 44, 90, 3, '#2b2145');
  tri(ctx, 322, 270, 361, 232, 400, 270, '#1c1533');
  tri(ctx, 396, 246, 441, 208, 486, 246, '#1c1533');
  ctx.fillStyle = '#ffd873';
  [[344, 292], [366, 292], [344, 330], [420, 268], [452, 268], [316, 322]].forEach(([x, y]) => rr(ctx, x, y, 11, 14, 2, '#ffd873'));
  // DIFF harbour-window: one lit window goes dark.
  if (alt.has('harbour-window')) rr(ctx, 452, 306, 11, 14, 2, '#171230');
  else rr(ctx, 452, 306, 11, 14, 2, '#ffd873');

  // The sea.
  const sea = ctx.createLinearGradient(0, 390, 0, 620);
  sea.addColorStop(0, '#2a3a66'); sea.addColorStop(1, '#0e1730');
  ctx.fillStyle = sea; ctx.fillRect(0, 390, 500, 230);
  ctx.strokeStyle = 'rgba(246,231,189,0.5)'; ctx.lineWidth = 2;
  const shimmer = rng(23);
  for (let i = 0; i < 16; i++) {
    const y = 400 + i * 13, w = 12 + shimmer() * 42, x = 415 - w / 2 + (shimmer() - 0.5) * 22;
    ctx.globalAlpha = 0.14 + shimmer() * 0.3;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(160,190,235,0.35)';
  for (let i = 0; i < 12; i++) {
    const y = 408 + i * 17, x = shimmer() * 460;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 16, y - 4, x + 32, y); ctx.stroke();
  }

  // Lighthouse on its rocks (left).
  ctx.fillStyle = '#191430';
  ctx.beginPath(); ctx.moveTo(18, 420); ctx.lineTo(52, 372); ctx.lineTo(96, 356); ctx.lineTo(140, 380); ctx.lineTo(152, 420); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(60, 356); ctx.lineTo(112, 356); ctx.lineTo(104, 208); ctx.lineTo(68, 208); ctx.closePath();
  ctx.fillStyle = '#e8e2d4'; ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.moveTo(60, 356); ctx.lineTo(112, 356); ctx.lineTo(104, 208); ctx.lineTo(68, 208); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#c8443c';
  [322, 272, 222].forEach((y) => ctx.fillRect(58, y, 58, 22));
  ctx.restore();
  rr(ctx, 62, 182, 48, 28, 3, '#241b3d');
  tri(ctx, 58, 184, 86, 158, 114, 184, '#15102a');
  // DIFF harbour-beacon: the beacon burns on the left, dark on the right.
  if (!alt.has('harbour-beacon')) {
    const glow = ctx.createRadialGradient(86, 196, 2, 86, 196, 46);
    glow.addColorStop(0, 'rgba(255,214,110,0.95)'); glow.addColorStop(1, 'rgba(255,214,110,0)');
    ctx.fillStyle = glow; ctx.fillRect(38, 148, 96, 96);
    circle(ctx, 86, 196, 8, '#ffd873');
    ctx.fillStyle = 'rgba(255,214,110,0.16)';
    ctx.beginPath(); ctx.moveTo(112, 188); ctx.lineTo(300, 150); ctx.lineTo(300, 226); ctx.lineTo(112, 204); ctx.closePath(); ctx.fill();
  } else {
    circle(ctx, 86, 196, 8, '#3a3358');
  }

  // The sailboat (centre).
  ctx.strokeStyle = '#0f0c22'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(300, 468); ctx.lineTo(300, 356); ctx.stroke();
  // DIFF harbour-sail: a white sail on the left, coral on the right.
  tri(ctx, 306, 362, 306, 452, 356, 452, alt.has('harbour-sail') ? '#e2604d' : '#f2ecdc');
  tri(ctx, 294, 376, 294, 452, 258, 452, '#d9d2bd');
  ctx.fillStyle = '#7a4430';
  ctx.beginPath(); ctx.moveTo(252, 468); ctx.lineTo(352, 468); ctx.lineTo(336, 492); ctx.lineTo(268, 492); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(226,96,77,0.35)'; ctx.fillRect(262, 496, 76, 4);

  // A rowboat (lower left) and a buoy (right).
  ctx.fillStyle = '#5d3626';
  ctx.beginPath(); ctx.moveTo(108, 528); ctx.lineTo(196, 528); ctx.lineTo(182, 548); ctx.lineTo(122, 548); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3c2417'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(150, 524); ctx.lineTo(196, 492); ctx.stroke();
  tri(ctx, 428, 486, 444, 486, 436, 462, '#c8443c');
  rr(ctx, 424, 486, 24, 16, 4, '#e8e2d4');

  // The dock along the bottom.
  ctx.fillStyle = '#4a2f1e'; ctx.fillRect(0, 566, 500, 54);
  ctx.fillStyle = '#5d3c26';
  for (let x = 6; x < 500; x += 46) ctx.fillRect(x, 566, 38, 54);
  ctx.fillStyle = '#33200f';
  [60, 210, 360, 470].forEach((x) => ctx.fillRect(x, 540, 12, 30));

  // The string of lanterns across the top.
  ctx.strokeStyle = 'rgba(15,12,30,0.9)'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(6, 16); ctx.quadraticCurveTo(250, 74, 494, 10); ctx.stroke();
  const lanternPts = [[70, 40], [158, 54], [250, 60], [342, 52], [428, 36]];
  lanternPts.forEach(([x, y], i) => {
    // DIFF harbour-lantern: the middle lantern is missing on the right.
    if (alt.has('harbour-lantern') && i === 2) return;
    lantern(ctx, x, y + 12, 1, ['#e2604d', '#f2a541', '#7fb069', '#5aa9e6', '#b565d8'][i]);
  });
}

/* ---------------- Scene 2: The Clockwork Bakery ---------------- */

function paintBakery(ctx, alt) {
  const wall = ctx.createLinearGradient(0, 0, 0, 620);
  wall.addColorStop(0, '#f3dfba'); wall.addColorStop(1, '#e8c491');
  ctx.fillStyle = wall; ctx.fillRect(0, 0, 500, 620);
  ctx.fillStyle = '#c99a5f'; ctx.fillRect(0, 470, 500, 150);
  ctx.strokeStyle = 'rgba(120,78,36,0.4)'; ctx.lineWidth = 2;
  for (let y = 492; y < 620; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(500, y); ctx.stroke(); }
  ctx.fillStyle = '#a9743c'; ctx.fillRect(0, 452, 500, 18);

  // Window (left) with the morning outside.
  rr(ctx, 36, 84, 158, 208, 8, '#8a5a2b');
  const morn = ctx.createLinearGradient(0, 92, 0, 284);
  morn.addColorStop(0, '#a8d3ea'); morn.addColorStop(1, '#f7e3ae');
  rr(ctx, 46, 94, 138, 188, 5, morn);
  circle(ctx, 84, 132, 20, '#ffd873');
  ctx.fillStyle = '#7fb069';
  ctx.beginPath(); ctx.moveTo(46, 282); ctx.quadraticCurveTo(110, 226, 184, 282); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(115, 94); ctx.lineTo(115, 282); ctx.moveTo(46, 188); ctx.lineTo(184, 188); ctx.stroke();
  ctx.fillStyle = '#c8443c';
  ctx.beginPath(); ctx.moveTo(36, 84); ctx.lineTo(76, 84); ctx.lineTo(66, 150); ctx.lineTo(36, 138); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(194, 84); ctx.lineTo(154, 84); ctx.lineTo(164, 150); ctx.lineTo(194, 138); ctx.closePath(); ctx.fill();

  // The hanging sign.
  ctx.strokeStyle = '#6d4423'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(196, 0); ctx.lineTo(216, 34); ctx.moveTo(388, 0); ctx.lineTo(368, 34); ctx.stroke();
  rr(ctx, 182, 34, 220, 58, 8, '#6d4423');
  rr(ctx, 188, 40, 208, 46, 6, '#8a5a2b');
  ctx.fillStyle = '#f7e3ae';
  ctx.font = '700 27px Georgia, serif'; ctx.textAlign = 'center';
  // DIFF bakery-sign: the H of FRESH never made it onto the right sign.
  ctx.fillText(alt.has('bakery-sign') ? 'FRESN BREAD' : 'FRESH BREAD', 292, 73);
  ctx.textAlign = 'left';

  // The wall clock.
  circle(ctx, 424, 118, 40, '#6d4423');
  circle(ctx, 424, 118, 33, '#fdf6e3');
  ctx.strokeStyle = '#6d4423'; ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(424 + Math.cos(a) * 27, 118 + Math.sin(a) * 27);
    ctx.lineTo(424 + Math.cos(a) * 31, 118 + Math.sin(a) * 31);
    ctx.stroke();
  }
  // DIFF bakery-clock: ten past nine on the left, twenty to four on the right.
  const hands = alt.has('bakery-clock')
    ? [[3.66, 19], [0.66, 26]]
    : [[9.17, 19], [0.17, 26]];
  ctx.strokeStyle = '#33302e'; ctx.lineCap = 'round';
  hands.forEach(([h, len], i) => {
    const a = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.lineWidth = i === 0 ? 5 : 3.5;
    ctx.beginPath(); ctx.moveTo(424, 118); ctx.lineTo(424 + Math.cos(a) * len, 118 + Math.sin(a) * len); ctx.stroke();
  });
  circle(ctx, 424, 118, 4, '#c8443c');

  // Bunting from the window to the clock.
  ctx.strokeStyle = 'rgba(109,68,35,0.7)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(30, 168); ctx.quadraticCurveTo(210, 218, 388, 158); ctx.stroke();
  const flagCols = ['#c8443c', '#f2a541', '#5aa9e6', '#7fb069', '#b565d8', '#e2604d', '#f2d541'];
  for (let i = 0; i < 7; i++) {
    const t = (i + 0.5) / 7;
    const x = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 210 + t * t * 388;
    const y = (1 - t) * (1 - t) * 168 + 2 * (1 - t) * t * 218 + t * t * 158;
    // DIFF bakery-flag: the middle flag flies teal on the left, purple on the right.
    const col = alt.has('bakery-flag') && i === 3 ? '#7a4fd0' : flagCols[i];
    tri(ctx, x - 13, y, x + 13, y, x, y + 26, i === 3 && !alt.has('bakery-flag') ? '#2aa198' : col);
  }

  // Shelves with jars and loaves (right).
  [228, 288].forEach((y) => { rr(ctx, 292, y, 188, 10, 3, '#8a5a2b'); });
  const jar = (x, y, col) => { rr(ctx, x, y - 30, 24, 32, 5, col); rr(ctx, x + 3, y - 38, 18, 9, 3, '#6d4423'); };
  jar(306, 228, '#b565d8'); jar(342, 228, '#e2604d');
  // DIFF bakery-jar: the tall jar holds green preserves, or amber ones.
  jar(384, 228, alt.has('bakery-jar') ? '#e8a33d' : '#7fb069');
  jar(420, 228, '#5aa9e6');
  ctx.fillStyle = '#d9a05b';
  [308, 348, 392, 436].forEach((x) => { ctx.beginPath(); ctx.ellipse(x, 282, 17, 10, 0, 0, Math.PI * 2); ctx.fill(); });
  ctx.strokeStyle = 'rgba(109,68,35,0.55)'; ctx.lineWidth = 2;
  [308, 348, 392, 436].forEach((x) => { ctx.beginPath(); ctx.moveTo(x - 8, 278); ctx.lineTo(x + 8, 278); ctx.stroke(); });

  // A pendant lamp over the counter.
  ctx.strokeStyle = '#33302e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(140, 108); ctx.lineTo(140, 158); ctx.stroke();
  tri(ctx, 112, 188, 168, 188, 140, 154, '#c8443c');
  circle(ctx, 140, 192, 7, '#ffd873');

  // The counter and its cakes.
  rr(ctx, 56, 402, 388, 66, 6, '#8a5a2b');
  rr(ctx, 56, 402, 388, 14, 6, '#a9743c');
  ctx.fillStyle = '#6d4423';
  [92, 196, 300].forEach((x) => rr(ctx, x, 424, 76, 32, 4, '#6d4423'));
  const dome = (x, cakeCol) => {
    rr(ctx, x - 30, 388, 60, 12, 4, '#6d4423');
    rr(ctx, x - 22, 356, 44, 32, 5, cakeCol);
    rr(ctx, x - 22, 372, 44, 7, 3, '#fdf6e3');
    circle(ctx, x, 350, 5, '#c8443c');
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath(); ctx.arc(x, 372, 34, Math.PI, Math.PI * 2); ctx.fill();
    rr(ctx, x - 36, 336, 72, 66, 30, 'rgba(255,255,255,0.16)');
  };
  // DIFF bakery-cake: a pink cake on the left, a blue one on the right.
  dome(150, alt.has('bakery-cake') ? '#5aa9e6' : '#ef7fa5');
  dome(258, '#f2d541');
  // Croissants on a tray (third spot).
  rr(ctx, 330, 388, 74, 12, 4, '#6d4423');
  ctx.fillStyle = '#d9a05b';
  [348, 372, 394].forEach((x) => { ctx.beginPath(); ctx.ellipse(x, 384, 13, 8, 0.4, 0, Math.PI * 2); ctx.fill(); });

  // The oven (right) with its warm door.
  rr(ctx, 356, 486, 118, 108, 8, '#4c4a52');
  rr(ctx, 372, 508, 86, 56, 6, '#2c2a33');
  const fire = ctx.createRadialGradient(415, 544, 4, 415, 544, 34);
  fire.addColorStop(0, 'rgba(255,190,90,0.95)'); fire.addColorStop(1, 'rgba(255,120,40,0.12)');
  ctx.fillStyle = fire; rr(ctx, 378, 514, 74, 44, 5, fire);
  circle(ctx, 415, 486 + 8, 0, '#000');
  [382, 415, 448].forEach((x) => circle(ctx, x, 500, 5, '#c8443c'));

  // The stool, and — on the left panel only — the cat asleep on it.
  rr(ctx, 84, 528, 52, 12, 5, '#8a5a2b');
  [90, 124].forEach((x) => rr(ctx, x, 540, 8, 34, 3, '#6d4423'));
  // DIFF bakery-cat: the cat is there on the left, gone on the right.
  if (!alt.has('bakery-cat')) {
    ctx.fillStyle = '#e8913a';
    ctx.beginPath(); ctx.ellipse(110, 516, 27, 15, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 132, 500, 13, '#e8913a');
    tri(ctx, 122, 492, 127, 480, 132, 491, '#e8913a');
    tri(ctx, 133, 491, 139, 480, 142, 493, '#e8913a');
    ctx.strokeStyle = '#e8913a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(86, 518); ctx.quadraticCurveTo(66, 506, 72, 488); ctx.stroke();
    ctx.strokeStyle = '#b96f24'; ctx.lineWidth = 2.5;
    [98, 108, 118].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 505); ctx.lineTo(x, 524); ctx.stroke(); });
    ctx.strokeStyle = '#7a4a12';
    ctx.beginPath(); ctx.moveTo(126, 500); ctx.lineTo(130, 500); ctx.moveTo(136, 500); ctx.lineTo(140, 500); ctx.stroke();
  }
}

/* ---------------- Scene 3: Mushroom Hollow ---------------- */

function paintHollow(ctx, alt) {
  const bg = ctx.createLinearGradient(0, 0, 0, 620);
  bg.addColorStop(0, '#0d2b2e'); bg.addColorStop(0.6, '#123a35'); bg.addColorStop(1, '#0a2018');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 500, 620);

  // Crescent moon and its neighbour star.
  circle(ctx, 70, 70, 24, '#eef3d0');
  circle(ctx, 84, 60, 20, '#0d2b2e');
  // DIFF hollow-star: a bright star keeps the moon company — or not.
  if (!alt.has('hollow-star')) star4(ctx, 126, 52, 11, '#ffe9a3');

  // Far trees.
  ctx.fillStyle = '#0a2422';
  for (let x = -10; x < 520; x += 46) {
    tri(ctx, x, 300, x + 24, 120, x + 48, 300, '#0a2422');
  }
  ctx.fillRect(0, 288, 500, 40);

  // The great tree (right) and its branch.
  ctx.fillStyle = '#2c1e14';
  ctx.beginPath(); ctx.moveTo(392, 620); ctx.quadraticCurveTo(404, 420, 396, 250); ctx.lineTo(452, 250); ctx.quadraticCurveTo(446, 430, 462, 620); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2c1e14'; ctx.lineWidth = 17; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(414, 268); ctx.quadraticCurveTo(350, 208, 268, 196); ctx.stroke();
  ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(428, 300); ctx.quadraticCurveTo(478, 260, 492, 214); ctx.stroke();
  ctx.fillStyle = '#173f2c';
  [[250, 168], [300, 150], [352, 176], [470, 180], [440, 140], [210, 196]].forEach(([x, y]) => {
    circle(ctx, x, y, 26, '#173f2c'); circle(ctx, x + 18, y + 8, 20, '#14402a');
  });

  // The owl on the branch.
  ctx.fillStyle = '#8a6a48';
  ctx.beginPath(); ctx.ellipse(330, 168, 21, 26, 0, 0, Math.PI * 2); ctx.fill();
  tri(ctx, 313, 150, 318, 136, 326, 148, '#8a6a48');
  tri(ctx, 334, 148, 342, 136, 347, 150, '#8a6a48');
  circle(ctx, 330, 162, 13, '#d9c39a');
  // DIFF hollow-owl: wide awake on the left, fast asleep on the right.
  if (alt.has('hollow-owl')) {
    ctx.strokeStyle = '#33302e'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(320, 162); ctx.lineTo(328, 162); ctx.moveTo(332, 162); ctx.lineTo(340, 162); ctx.stroke();
  } else {
    circle(ctx, 324, 162, 3.6, '#26221e'); circle(ctx, 336, 162, 3.6, '#26221e');
  }
  tri(ctx, 326, 168, 334, 168, 330, 174, '#e8a33d');
  ctx.strokeStyle = '#e8a33d'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(320, 192); ctx.lineTo(316, 198); ctx.moveTo(340, 192); ctx.lineTo(344, 198); ctx.stroke();

  // The little door in the left trunk.
  ctx.fillStyle = '#241708';
  ctx.beginPath(); ctx.moveTo(38, 620); ctx.quadraticCurveTo(48, 470, 44, 380); ctx.lineTo(120, 380); ctx.quadraticCurveTo(112, 490, 124, 620); ctx.closePath(); ctx.fill();
  rr(ctx, 58, 452, 48, 96, 22, '#5d3c26');
  rr(ctx, 64, 458, 36, 84, 17, '#6d4423');
  // DIFF hollow-door: the door's round window glows — or is dark.
  circle(ctx, 82, 486, 10, alt.has('hollow-door') ? '#241708' : '#ffd873');
  circle(ctx, 98, 516, 3.5, '#c9a227');
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2;
  [420, 500, 570].forEach((y) => { ctx.beginPath(); ctx.moveTo(46, y); ctx.quadraticCurveTo(84, y - 12, 118, y); ctx.stroke(); });

  // Mushrooms, big and small.
  const shroom = (x, y, s, spots) => {
    rr(ctx, x - 9 * s, y, 18 * s, 30 * s, 7 * s, '#e8dcc2');
    ctx.fillStyle = '#c8443c';
    ctx.beginPath(); ctx.arc(x, y + 2 * s, 34 * s, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fdf6e3';
    spots.forEach(([sx, sy, sr]) => circle(ctx, x + sx * s, y - sy * s, sr * s, '#fdf6e3'));
  };
  // DIFF hollow-spots: the big mushroom wears four spots, or only three.
  const bigSpots = [[-14, 12, 6], [10, 20, 7], [20, 6, 5], [-2, 26, 5]];
  shroom(140, 452, 1.25, alt.has('hollow-spots') ? bigSpots.slice(0, 3) : bigSpots);
  shroom(228, 492, 0.8, [[-8, 10, 5], [9, 14, 5]]);
  shroom(64, 540, 0.62, [[0, 12, 5]]);
  shroom(300, 520, 0.55, [[-6, 10, 4], [8, 8, 4]]);

  // Grass and ferns along the floor.
  ctx.fillStyle = '#0e2f1e'; ctx.fillRect(0, 576, 500, 44);
  ctx.strokeStyle = '#1d5c38'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const grass = rng(37);
  for (let i = 0; i < 46; i++) {
    const x = grass() * 500, h = 12 + grass() * 22;
    ctx.beginPath(); ctx.moveTo(x, 620); ctx.quadraticCurveTo(x + 4, 620 - h, x + (grass() - 0.5) * 14, 620 - h - 6); ctx.stroke();
  }

  // The stream (lower right) with its stepping stones.
  ctx.fillStyle = '#14424e';
  ctx.beginPath(); ctx.moveTo(268, 620); ctx.quadraticCurveTo(330, 556, 420, 560); ctx.quadraticCurveTo(486, 562, 500, 540); ctx.lineTo(500, 620); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(168,216,234,0.5)'; ctx.lineWidth = 2;
  [[330, 592, 44], [396, 584, 54], [452, 596, 36]].forEach(([x, y, w]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w / 2, y - 6, x + w, y); ctx.stroke();
  });
  ctx.fillStyle = '#5c6650';
  [[292, 574, 15], [382, 566, 12]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); });
  // DIFF hollow-stone: a third stepping stone, present or gone.
  if (!alt.has('hollow-stone')) {
    ctx.beginPath(); ctx.ellipse(336, 552, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
  }

  // The lantern on its stump.
  rr(ctx, 428, 500, 44, 26, 4, '#2c1e14');
  rr(ctx, 434, 470, 32, 34, 5, '#3a2c1c');
  // DIFF hollow-lantern: the lantern is lit on the left, out on the right.
  if (alt.has('hollow-lantern')) {
    rr(ctx, 439, 476, 22, 22, 4, '#141210');
  } else {
    const glow = ctx.createRadialGradient(450, 487, 2, 450, 487, 30);
    glow.addColorStop(0, 'rgba(255,205,100,0.9)'); glow.addColorStop(1, 'rgba(255,205,100,0)');
    ctx.fillStyle = glow; ctx.fillRect(418, 455, 64, 64);
    rr(ctx, 439, 476, 22, 22, 4, '#ffca66');
    circle(ctx, 450, 487, 5, '#fff3c4');
  }

  // Fireflies everywhere — one of them only on the left.
  const flies = rng(53);
  ctx.fillStyle = '#ffe9a3';
  for (let i = 0; i < 13; i++) {
    const x = 30 + flies() * 440, y = 90 + flies() * 380, r = 1.6 + flies() * 2.2;
    ctx.globalAlpha = 0.35 + flies() * 0.6;
    circle(ctx, x, y, r + 3.5, 'rgba(255,233,163,0.18)');
    circle(ctx, x, y, r, '#ffe9a3');
  }
  ctx.globalAlpha = 1;
  // DIFF hollow-firefly: one bright firefly hangs over the stream — or not.
  if (!alt.has('hollow-firefly')) {
    circle(ctx, 300, 300, 8, 'rgba(255,233,163,0.25)');
    circle(ctx, 300, 300, 3.4, '#ffe9a3');
  }
}

/* ---------------- The scene list ---------------- */

export const SCENES = [
  {
    id: 'harbour',
    name: 'Lantern Harbour',
    tagline: 'Dusk over the water. Five things are not as they were.',
    timeLimit: 150,
    diffs: [
      { id: 'harbour-moon', x: 415, y: 80, r: 30, hint: 'Something about the moon is off.' },
      { id: 'harbour-beacon', x: 86, y: 196, r: 27, hint: 'The lighthouse feels darker than it should.' },
      { id: 'harbour-sail', x: 306, y: 415, r: 30, hint: 'Check the sailboat amidships.' },
      { id: 'harbour-lantern', x: 250, y: 72, r: 23, hint: 'Count the lanterns on the string.' },
      { id: 'harbour-window', x: 457, y: 313, r: 20, hint: 'One harbour house has gone to bed early.' },
    ],
    paint: paintHarbour,
  },
  {
    id: 'bakery',
    name: 'The Clockwork Bakery',
    tagline: 'Morning rush. Six things have quietly changed.',
    timeLimit: 170,
    diffs: [
      { id: 'bakery-clock', x: 424, y: 118, r: 32, hint: 'Time does not agree with itself.' },
      { id: 'bakery-cat', x: 110, y: 505, r: 30, hint: 'The stool by the counter looks lonely.' },
      { id: 'bakery-cake', x: 150, y: 368, r: 25, hint: 'One cake changed flavour overnight.' },
      { id: 'bakery-sign', x: 292, y: 63, r: 34, hint: 'Read the sign again, letter by letter.' },
      { id: 'bakery-jar', x: 396, y: 210, r: 19, hint: 'A jar of preserves changed its colour.' },
      { id: 'bakery-flag', x: 218, y: 190, r: 20, hint: 'One bunting flag flies the wrong colour.' },
    ],
    paint: paintBakery,
  },
  {
    id: 'hollow',
    name: 'Mushroom Hollow',
    tagline: 'Deep in the night forest. Seven things hide in the green.',
    timeLimit: 190,
    diffs: [
      { id: 'hollow-owl', x: 330, y: 162, r: 23, hint: 'The owl is not as awake as it looks.' },
      { id: 'hollow-spots', x: 128, y: 424, r: 24, hint: 'Count the spots on the big mushroom.' },
      { id: 'hollow-firefly', x: 300, y: 300, r: 19, hint: 'One firefly over the stream has gone out.' },
      { id: 'hollow-door', x: 82, y: 486, r: 17, hint: 'Nobody is home in the little door — or are they?' },
      { id: 'hollow-stone', x: 336, y: 552, r: 20, hint: 'Crossing the stream just got harder.' },
      { id: 'hollow-star', x: 126, y: 52, r: 17, hint: 'The moon had a companion a moment ago.' },
      { id: 'hollow-lantern', x: 450, y: 487, r: 19, hint: 'The stump lantern by the great tree.' },
    ],
    paint: paintHollow,
  },
];
