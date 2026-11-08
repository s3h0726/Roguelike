# ECLIPSE PROTOCOL — Astral Autobattler

A browser-native **auto-battler + roguelike** with responsive tactical placement, randomized shops, 3-of-a-kind fusion, 6 faction synergies, unique unit abilities, boss waves, relic drafts, and a manually triggered cinematic supernova.

## Run locally

Use a static HTTP server (ES modules require HTTP rather than `file://`):

```bash
python -m http.server 8000
```

Visit http://localhost:8000. For GitHub Pages, deploy the repository root from `main` and open its Pages URL.

## How to play

- Buy units from the 5-card shop, then select one on the bench and click a **blue** board tile. Drag/drop works on desktop.
- Put resilient tanks up front and ranged units in the rear. Reposition between stages.
- Three copies of the same unit and star tier fuse automatically; max tier is ★★★.
- Build 2/4-unit affinities (Celestial, Void, Ember, Storm, Arcane, Iron) to unlock team bonuses.
- Click **ENGAGE** (or Enter) to start automated battle. **SUPERNOVA** (or Space) activates once charged.
- Every second stage won, choose one of three run-defining relics.
- Use rerolls (2 gold), levels (4 gold), shop locks, and a 3-heart loss limit to survive. Bosses appear every fifth stage.
- Toggle 1×/2× speed, high/low VFX, and synthesized sound from the left controls.

## Code layout

| File | Responsibility |
|---|---|
| `index.html` | Semantic UI and layout |
| `styles.css` | Responsive interface styling |
| `src/data.js` | Heroes, traits, relics, stage templates |
| `src/engine.js` | Game state, recruitment, economy, combat, skills, rounds |
| `src/render.js` | Canvas arena, lighting, particles, telegraphs, attack effects |
| `src/app.js` | DOM state, interactions, sound, battle loop |
| `tests/engine.test.js` | Headless mechanics regression checks |

No third-party packages or external assets required. Saves only the best stage (via localStorage). Game runs are intentionally ephemeral; an earlier single-file save is not imported because the combat model is a full redesign.

## Credits

Original game mechanics, code and procedural visual effects written for this project. No Minecraft mod assets are used.