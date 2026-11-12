import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const html = read('index.html');
const game = read('game.js');
const horde = read('horde.js');
const arena = read('battlefield.js');
test('HTML scripts and stylesheets are included', () => {
  for (const f of ['style.css', 'battlefield.css', 'game.js', 'horde.js', 'battlefield.js']) {
    assert.ok(existsSync(resolve(root, f)), f);
    assert.ok(html.includes(`"${f}"`), `HTML missing ${f}`);
  }
});
test('Topdown canvas and accessible inputs exist', () => {
  for (const id of ['chaosCanvas', 'chaosJoystick', 'chaosAttackBtn', 'chaosDashBtn', 'chaosBurstBtn', 'chaosFxBtn'])
    assert.match(html, new RegExp(`id="${id}"`));
});
test('Core game and independent horde modules exist', () => {
  assert.ok(game.length > 10000);
  assert.ok(horde.length > 3000);
  assert.ok(arena.length > 5000);
});
test('Canvas 2D renderer and graphics quality presets are present', () => {
  assert.match(arena, /getContext\(["']2d["']/);
  assert.match(arena, /ULTRA/);
  assert.match(arena, /LITE/);
});
