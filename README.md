# ECLIPSE PROTOCOL — REBORN

A real-time, cosmic action **roguelike**. This rebuild replaces the previous shop-and-board autobattler with direct hero movement, automatic spellcraft, procedurally escalating enemy waves, branching level-up choices and relics.

## Play

- Move: **WASD** / arrow keys (mobile virtual joystick).
- **Space** / Shift: dash with brief invulnerability.
- **R**: trigger **Supernova** after the energy meter reaches 100%.
- **P / Escape**: pause or resume.
- Basic attacks and equipped skills fire **automatically**. The player makes the movement, survival, dash and ultimate decisions.
- Each level-up pauses combat and presents **three upgrade choices**. Each stage completion presents **three relic choices**. Every fourth stage has a boss.
- Pick one of three classes: **Void Reaver**, **Storm Herald**, **Solar Seraph**.

## Graphics

The primary graphics engine is **Three.js r187 (0.187.0)**, loaded as an ES module through an import map and jsDelivr CDN. It uses `WebGLRenderer`, scene lighting, geometric 3D characters, `EffectComposer`, `UnrealBloomPass`, GPU particle shader, dynamic shockwave rings, lightning arcs, meteor lances, camera shake and an enhanced Supernova ultimate.

If WebGL, Three.js, or the CDN is unavailable, the game falls back to a **Canvas2D** renderer so that gameplay remains possible, including offline/local test environments. The graphics status in the top-right corner indicates which renderer is active. Set **LITE FX** on lower-end mobile devices. **3D mode requires an internet connection for the CDN on first load.**

The interface and skill names are in English.

## Development

Run locally from a static HTTP server (ES modules are not guaranteed to load from `file://`):

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

### File structure

- `index.html` — UI scaffold and pinned Three.js import map
- `styles.css` — responsive HUD, menus and mobile controls
- `src/data.js` — classes, abilities, relics, upgrades and enemy definitions
- `src/engine.js` — deterministic battle rules, roguelike progression, combat logic
- `src/render3d.js` — Three.js WebGL 3D renderer and custom VFX
- `src/fallback2d.js` — offline compatibility renderer
- `src/main.js` — UI, inputs, pause, menus and audio
- `tests/engine.test.js` — core game logic regression tests

### Tests

```bash
npm test
npm run check
```

## Deployment

The project is static and can be deployed using **GitHub Pages** from `main` and `/`.

## Notes

This is a fresh roguelike game mode; previous ECLIPSE autobattler run state does not migrate. No external images or assets are needed. Three.js is MIT-licensed; see https://github.com/mrdoob/three.js/blob/master/LICENSE.
