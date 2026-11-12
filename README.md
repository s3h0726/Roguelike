# OMEGA — The Infinite Foundry

A **complete replacement** for the earlier pixel-action and roguelike codebase: a responsive, dependency-free browser incremental universe with factories, resource conversion, research, fleets, contracts, artifacts, automation, and four prestige layers.

## Play

- **GitHub Pages:** deploy the repository root from `main` (`index.html`). No build step or third-party CDN is required.
- **Local (multi-file):** from this directory run `python -m http.server 8000` then open `http://localhost:8000`.
- **Offline standalone:** the separately packaged `OMEGA_INCREMENTAL_PLAYABLE.html` is a single-file version that also works without a web server.

## Content and progression

| System | Content | Notes |
|---|---:|---|
| Resources | **32** | Foundation → industry → exotic matter → cosmic realms → meta-currencies |
| Factories | **22** | Per-second inputs and outputs, unlocks and scaling costs; facilities can be disabled |
| Technologies | **27** | Research prerequisites, production boosts and automation unlocks |
| Fabrication formulas | **15** | Resource conversion, including alternate ways to bridge production chains |
| Artifacts | **12** | Rare production boosts; cost Relic Shards, Blueprints and high-level ingredients |
| Faction contracts | **10** | Delivery requirements and rewards scale after repeated completion |
| Expeditions | **4** | Real-duration missions with rare loot and offline completion |
| Intra-run upgrades | **6** | 12–20 levels each; fleet, storage, trading, pulse, and production boosts |
| Achievements | **14** | Claimable rewards for progress and statistics |
| Prestige layers | **4** | Reboot → Ascension → Collapse → Eternity |
| Permanent upgrade tracks | **4** | Compounding multipliers paid in respective prestige currencies |

### Gameplay loop

1. Activate **OVERDRIVE** for initial funding and a temporary 3× multiplier.
2. Build **Matter Extractors**, **Fusion Reactors**, and **Exchange Nodes**.
3. Unlock **Metallurgy I** in the Research Lab, then build an Alloy Smelter.
4. Expand increasingly interdependent supply chains through exotic matter to reality weaving.
5. Diversify with Contracts, timed Expeditions, Synthesis, Artifacts and market trading.
6. Automate industrial activities as the relevant research is unlocked.
7. Reboot after accumulating production score, then pursue higher prestige layers.

### Player controls

- Left navigation: select a system.
- 1–9: quick-select the first nine systems.
- **Space:** trigger OVERDRIVE when ready (15-second cooldown, 8-second boost).
- Click quantity selectors to buy/craft/trade in larger batches.
- Each facility can be switched off when it consumes a scarce input.
- Save is automatic, and **Chronicle → EXPORT SAVE** offers a JSON backup.

## Saves and compatibility

- Progress saves in the current browser's `localStorage` every five seconds and when the tab is hidden.
- An offline simulation grants up to **2 hours**, extended by one hour per Quantum Vault upgrade.
- **Exports are private, local JSON files**; there are no servers, user accounts, analytics or payments.
- Previous PIXEL CORE HUNTER and ECLIPSE saves are incompatible with OMEGA. Back them up before switching if needed.
- A new universe reset clears all progress. Prestige resets ordinary progress but preserves appropriate meta-currencies, permanent upgrades and career statistics.

## Code layout

- `index.html`: responsive application shell.
- `styles.css`: controls, cards, resource bar, visual system and responsive layouts.
- `src/data.js`: resource, factory, technology, artifact and event catalogs.
- `src/engine.js`: pure economy simulation and persistence validation.
- `src/ui.js`: template-rendered controls and views for 11 navigation systems.
- `src/main.js`: app lifecycle, event handling, local saves, offline gains and rendering cadence.
- `tests/economy.test.js`: catalog validation and economy regression tests.

Requires Node.js 18+ for tests. Run:

```bash
npm test
npm run check
```

No runtime dependencies. Designed to be hosted on GitHub Pages as static files.

## Implementation notes

This is a playable, extensible foundation—not a claim of complete endgame balance. Exotic and cosmic branches and higher prestige layers may need further tuning after real long-session playtests. The engine uses standard JavaScript floating-point arithmetic and an approximate chunked offline simulation, rather than arbitrary-precision numbers or exact high-frequency production scheduling.
