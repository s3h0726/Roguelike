# ECLIPSE PROTOCOL — 2D REBORN

A fast, keyboard-and-touch cosmic **action roguelike** with cinematic **Canvas2D** combat effects. No WebGL, external libraries, asset downloads or CDN required.

## Play

Open the [GitHub Pages deployment](https://s3h0726.github.io/Roguelike/) (if Pages is enabled) or start a local server:

```bash
npm run dev
```

Browse to `http://localhost:8080`.

## Controls

- **WASD / Arrow keys:** move
- **Space / Shift:** dash (brief invulnerability)
- **R:** Supernova ultimate, once fully charged
- **P / Escape:** pause / resume
- Touchscreen: drag the joystick and use the on-screen dash/ultimate controls

The hero's normal attacks and learned skills activate automatically. Pick one of three upgrades whenever you level up and one of three unique relics upon clearing a stage. Boss appears at stage 4, then every 4 stages.

## Native 2D visuals

`src/render2d.js` is the main graphics engine, **not a fallback**. It provides parallax cosmic backgrounds, starfields, ritual arena glyphs, enemy silhouettes, motion-trail projectiles, neon damage numbers, dynamic light bloom via Canvas shadow, particle trails, spell runes, radial shockwaves, meteor strikes, electric arc paths, 2D laser beams, and a multi-stage Supernova with screen shake.

FX setting switches between **ULTRA** and **LITE**; LITE caps particle count and pixel density for lower-power devices. 2D visuals are fully self-contained in the repository.

## Project layout

- `index.html`, `styles.css`: game shell and HUD
- `src/data.js`: hero, abilities, enemy, upgrade and relic data
- `src/engine.js`: deterministic game state, stage progression and combat
- `src/render2d.js`: cinematic Canvas2D render/effects engine
- `src/main.js`: input, menus, HUD and game loop
- `tests/*.test.js`: game rules, 2D rendering contracts and performance guards

## Tests

```bash
npm test
npm run check
```
