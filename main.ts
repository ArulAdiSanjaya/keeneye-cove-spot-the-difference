// Keeneye Cove — a make.fun best-spot-the-difference-game-20261121-0451 entry
// (Node 22, standard library only).
//
// The game is this directory's game/ folder: an original spot-the-difference
// hunt that runs from plain static files in a desktop browser, fully offline.
// Three hand-drawn canvas scenes — Lantern Harbour at dusk, the Clockwork
// Bakery in the morning, and Mushroom Hollow at night — hide 5, 6 and 7
// differences apiece: a moon gone crescent, a beacon gone dark, a cat gone
// from its stool, a clock that disagrees with itself. Clicks ring what you
// find on both panels; misses cost points and seconds; three hints are
// shared across the whole hunt; the clock bar turns red as time runs thin.
// Every sound is synthesised live with WebAudio — no libraries, no assets,
// no network requests.
//
// This program hands the entry in. It copies game/ and screenshots/ from
// beside this file to /output and writes /output/dossier.json, the summary
// the judge reads, with the vendored make.fun library
// (vendor/makefun-game.ts, the kit's copy, unchanged).
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The dossier is capped so the judge's outline stays readable: the whole
// game source fits well under the text cap. The remaining caps refuse an
// entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files in game/ or 48 MiB of game files in all, or
// a path under game/ over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
