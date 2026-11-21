[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ArulAdiSanjaya/keeneye-cove-spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ArulAdiSanjaya/keeneye-cove-spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Keeneye Cove — Spot the Difference

An original spot-the-difference game for the desktop browser, written in
plain JavaScript with no libraries and no build step. Two pictures stand
side by side — and in the right-hand one, a few things are not as they
were. Click a difference in either picture to ring it on both.

Three hand-drawn canvas scenes of rising difficulty:

| Scene | Differences | Time |
| --- | --- | --- |
| Lantern Harbour — dusk over the water | 5 | 150s |
| The Clockwork Bakery — the morning rush | 6 | 170s |
| Mushroom Hollow — deep in the night forest | 7 | 190s |

A moon gone crescent. A beacon gone dark. A cat gone from its stool. A
clock that disagrees with itself. The differences are drawn into the
scenes themselves — colour swaps, missing objects, moved clock hands, a
letter lost from a sign — never pasted on top.

## Play

Open `game/index.html` from any static file server (or run the entry
program below and serve the output) in a desktop browser. It plays fully
offline; every sound — the find pop that climbs with your combo, the miss
thud, the last-seconds tick, the jingles — is synthesised live with
WebAudio.

| Input | Action |
| --- | --- |
| Mouse click | Ring the difference you spotted (either picture) |
| H | Spend a hint (3 for the whole hunt, −30 points) |
| P or Esc | Pause / resume |
| M | Sound on / off |
| Enter | Start |
| N | Next scene, once one is cleared |
| R | Start over, after time-up or victory |

Scoring: 100 points per find, +15 for each step of your running combo,
a time bonus of 2 points per second left when a scene is cleared. A miss
costs 15 points and 4 seconds, and breaks the combo.

## Hand in

`main.ts` (Node 22, standard library only) copies `game/` and
`screenshots/` to `/output` and writes the dossier the judge reads:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Serve the game locally with `node serve.ts`, then open
http://localhost:8080.

Entry for the make.fun bounty
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
MIT licensed — see `LICENSE`.
