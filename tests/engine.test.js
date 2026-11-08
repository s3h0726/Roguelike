import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
import {UNITS} from '../src/data.js';
function newGame(){return new Game();}
test('Initial state starts in preparation with a deployed ally and gold',()=>{const g=newGame();assert.equal(g.phase,'prep');assert.equal(g.board().length,1);assert.equal(g.bench().length,1);assert.equal(g.gold,12);});
test('Shop purchase deducts gold and adds a bench unit',()=>{const g=newGame();g.shop[0]='aether';const before=g.gold;assert.equal(g.buy(0),true);assert.equal(g.gold,before-1);assert.equal(g.bench().length,2);});
test('Three matching units fuse to a stronger star tier',()=>{const g=newGame();g.roster=[g.unit('aether'),g.unit('aether'),g.unit('aether')];g.fuse('aether',1);assert.equal(g.roster.length,1);assert.equal(g.roster[0].star,2);});
test('Board placement respects capacity and allows swapping',()=>{const g=newGame();const hero=g.bench()[0];assert.equal(g.place(hero.uid,0,0),true);assert.equal(g.board().length,2);const old=g.board().find(x=>x.uid!==hero.uid);assert.equal(g.place(hero.uid,old.col,old.row),true);assert.equal(old.col,0);assert.equal(old.row,0);});
test('Battle starts and produces combatants with valid health',()=>{const g=newGame();assert.equal(g.begin(),true);assert.equal(g.phase,'combat');assert(g.combatUnits.length>=3);assert(g.combatUnits.every(u=>u.hp>0));for(let i=0;i<100;i++)g.update(.016);});
test('Combat can resolve and grants rewards without triggering duplicate finish',()=>{const g=newGame();g.begin();g.living('enemy').forEach(x=>g.damage(x,1e6,g.living('ally')[0]));g.update(.02);assert.equal(g.phase,'result');const total=g.gold;g.update(.02);assert.equal(g.gold,total);assert(g.result.won);});
test('Relic selection becomes available on stage 2 victory',()=>{const g=newGame();g.round=2;g.begin();g.living('enemy').forEach(x=>g.damage(x,1e6,g.living('ally')[0]));g.update(.02);assert.equal(g.relicChoices.length,3);assert.equal(g.claimRelic(g.relicChoices[0].id),true);assert.equal(g.relics.length,1);});
test('Stage 5 forecasts a boss',()=>{const g=newGame();g.round=5;g.roundStage={...g.roundStage,boss:true};g.makeEnemy();assert(g.enemyPreview.some(u=>u.boss));});
test('All units have valid trait and ability definitions',()=>{const ids=new Set(UNITS.map(u=>u.id));assert.equal(ids.size,UNITS.length);for(const u of UNITS){assert(u.abilityName&&u.hp>0&&u.cost>0);assert.equal(u.traits.length,2);}});