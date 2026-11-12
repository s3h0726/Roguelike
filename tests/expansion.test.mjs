import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const require=createRequire(import.meta.url);
const C=require('../advanced-core.js');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=()=>({stage:35,bestStage:35,gold:1e8,bossMedal:0,kills:0});
const rich=()=>{const b=base();const a=C.create();for(const r of C.RES)a.res[r.id]=1e6;return {a,b};};
test('data content is large and uniquely identified',()=>{
 assert.equal(C.RES.length,16);assert.equal(C.BLD.length,14);assert.equal(C.RESEARCH.length,20);
 assert.equal(C.RELICS.length,18);assert.equal(C.TALENTS.length,18);assert.equal(C.RECIPES.length,16);
 assert.equal(C.EXPEDITIONS.length,9);assert.equal(C.CONTRACTS.length,8);
 for(const list of [C.RES,C.BLD,C.RESEARCH,C.RELICS,C.TALENTS,C.RECIPES])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
});
test('stage rush uses adaptive 1,2,3,5,10 wave caps',()=>{
 const code=readFileSync(resolve(root,'game.js'),'utf8');
 assert.match(code,/stage <= 5 \? 1 : stage <= 10 \? 2 : stage <= 20 \? 3 : stage <= 40 \? 5 : NORMAL_STAGE_WAVES/);
 assert.match(code,/if \(state.stageWave > stageWaveCap\(\)\)/);
 assert.match(readFileSync(resolve(root,'horde.js'),'utf8'),/sprint\?\(stage<=5\?3:4\)/);
});
test('builders require payment, do not go negative, outputs flow through economy',()=>{
 const a=C.create(),b=base();b.gold=35;
 assert.equal(C.buyBuilding(a,b,'mine'),1);assert.equal(C.buyBuilding(a,b,'mine'),0);
 C.tick(a,b,20);assert.ok(a.res.ore>0);assert.ok(a.res.ore>=0);assert.ok(b.gold>=0);
 assert.equal(C.buyBuilding(a,b,'cosmic'),false);
});
test('production input shortages stop dependent production',()=>{
 const a=C.create(),b=base();a.buildings.kiln=2;C.tick(a,b,20);assert.equal(a.res.ember,0);
 a.res.ore=100;a.res.ether=100;C.tick(a,b,2);assert.ok(a.res.ember>0);
});
test('research prerequisites enforce meaningful tech tree',()=>{
 const {a,b}=rich();assert.equal(C.study(a,b,'blades'),false);
 assert.equal(C.study(a,b,'ores'),true);assert.equal(C.study(a,b,'blades'),true);
 assert.equal(C.study(a,b,'blades'),false);
 assert.ok(C.stats(a,b).atk>0);
});
test('relic collections create set bonus and other bonuses',()=>{
 const {a,b}=rich();for(const id of ['flame1','flame2'])assert.equal(C.unlockRelic(a,b,id),true);
 assert.ok(C.stats(a,b).atk>=.38);assert.equal(C.unlockRelic(a,b,'flame1'),false);
});
test('talents, potion effects, and expiry are respected',()=>{
 const {a,b}=rich();assert.equal(C.train(a,b,'atk1'),true);assert.ok(C.stats(a,b).atk>=.08);
 assert.equal(C.brew(a,b,'rage',1000),true);assert.ok(C.stats(a,b,2000).atk>=.38);
 assert.ok(C.stats(a,b,200000).atk<.38);
});
test('craft consumes resources and gives output; cannot exceed means',()=>{
 const a=C.create(),b=base();a.res.ore=36;
 assert.equal(C.craft(a,b,'condense',3),2);
 assert.equal(a.res.ether,24);assert.equal(a.res.ore,8);
});
test('expeditions run in real time and claim after deadline',()=>{
 const {a,b}=rich();assert.equal(C.startExpedition(a,b,'ruins',1000),true);
 assert.equal(C.startExpedition(a,b,'mine',1000),false);
 assert.equal(C.claimExpedition(a,b,5000),false);
 assert.equal(C.claimExpedition(a,b,47000),true);
 assert.equal(a.explores,1);assert.equal(a.expedition,null);
});
test('kills, wave rewards, faction contracts, and market exchange',()=>{
 const a=C.create(),b=base();for(let i=0;i<15;i++)C.recordKill(a,b,{boss:false});
 assert.equal(a.progress.kills,15);assert.equal(C.claimContract(a,b,'hunter'),true);assert.equal(a.reputation.hunters,1);
 assert.equal(C.claimContract(a,b,'hunter'),false);
 for(let i=0;i<4;i++)C.recordWave(a,b);
 assert.equal(C.claimContract(a,b,'scout'),false);
 C.recordWave(a,b);assert.equal(C.claimContract(a,b,'scout'),true);
 assert.equal(C.market(a,b,'trade0'),true);
});
test('automation production, achievements, and dimension ascension persist',()=>{
 const {a,b}=rich();assert.equal(C.automationUpgrade(a,b),false);
 a.research.automation=true;assert.equal(C.automationUpgrade(a,b),true);
 a.auto.enabled=true;C.tick(a,b,60);assert.ok(a.buildings.mine>0);
 b.bestStage=50;assert.equal(C.claimAchievement(a,b,'s50'),true);assert.ok(a.tokens>=8);
 b.stage=60;assert.equal(C.ascend(a,b),true);assert.equal(a.ascensions,1);
 assert.ok(C.stats(a,b).atk>=.12);
});
test('normalize migrates missing advanced saves, and costs cannot go negative',()=>{
 const a=C.normalize(null),b={gold:5,stage:1};assert.equal(a.res.star,0);
 assert.equal(C.pay(a,b,{gold:10}),false);assert.equal(b.gold,5);
 assert.equal(C.pay(a,b,{gold:3}),true);assert.equal(b.gold,2);
 assert.deepEqual(C.normalize(JSON.parse(JSON.stringify(a))).res,a.res);
});
test('HTML loads expansion after horde, before battlefield; UI includes accessible actions',()=>{
 const html=readFileSync(resolve(root,'index.html'),'utf8');
 for(const f of ['advanced-core.js','advanced-ui.js','advanced.css'])assert.ok(html.includes(f));
 assert.ok(html.indexOf('src="horde.js"')<html.indexOf('src="advanced-ui.js"'));
 assert.ok(html.indexOf('src="advanced-ui.js"')<html.indexOf('src="battlefield.js"'));
 for(const id of ['chaosQuickPanel','expansionTabs','expansionContent','expansionSearch'])assert.ok(html.includes(`id="${id}"`));
});

test('earned achievement tokens can be invested in permanent constellations',()=>{
 const {a,b}=rich();b.bestStage=100;assert.equal(C.claimAchievement(a,b,'s100'),true);
 assert.equal(C.improveConstellation(a,b,'war'),true);assert.ok(C.stats(a,b).atk>=.025);
 assert.equal(a.constellations.war,1);assert.ok(a.tokens<16);
});
