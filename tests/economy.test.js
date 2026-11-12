import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine,makeState,restoreState,hasCost,payCost,fmt} from '../src/engine.js';
import {RESOURCES,BUILDINGS,TECHS,RECIPES,ARTIFACTS,PRESTIGE,MISSION_TEMPLATES,EXPEDITIONS} from '../src/data.js';

const make=()=>new Engine(makeState(1700000000000));
const rich=e=>{for(const k of Object.keys(e.s.res))if(!['cores','essence','singularities','eternity'].includes(k))e.s.res[k]=1e8;return e};
test('content contract: 32 resources, 22 facilities, 27 technologies, 15 recipes, 12 artifacts, 4 prestige layers',()=>{
 assert.equal(RESOURCES.length,32);assert.equal(BUILDINGS.length,22);assert.equal(TECHS.length,27);assert.equal(RECIPES.length,15);assert.equal(ARTIFACTS.length,12);assert.equal(PRESTIGE.length,4);
});
test('resource identifiers are unique across each catalog',()=>{
 for(const list of [RESOURCES,BUILDINGS,TECHS,RECIPES,ARTIFACTS])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
});
test('every production resource and input exists',()=>{
 const ids=new Set(RESOURCES.map(r=>r.id));for(const b of BUILDINGS){for(const k of [...Object.keys(b.cost),...Object.keys(b.inputs),...Object.keys(b.outputs)])assert.ok(ids.has(k),`${b.id} uses unknown ${k}`)}
});
test('every research predecessor exists and graph is acyclic',()=>{
 const ids=new Set(TECHS.map(t=>t.id));let visited=new Set(),active=new Set();const walk=id=>{if(visited.has(id))return;assert.equal(active.has(id),false,`research cycle ${id}`);active.add(id);for(const q of TECHS.find(x=>x.id===id).pre){assert.ok(ids.has(q));walk(q);}active.delete(id);visited.add(id)};for(const t of TECHS)walk(t.id);
});
test('no resources go negative on failed purchase',()=>{
 const e=make();const old={...e.s.res};assert.equal(e.buyBuilding('weaver').ok,false);assert.equal(e.research('realityTech'),false);assert.equal(e.forge('omega'),false);assert.deepEqual(e.s.res,old);
});
test('starting economy produces raw matter, power and credits',()=>{
 const e=make(),ore=e.s.res.ore,energy=e.s.res.energy,credit=e.s.res.credits;e.step(10);assert.ok(e.s.res.ore>ore);assert.ok(e.s.res.energy>energy);assert.ok(e.s.res.credits>credit);
});
test('research unlocks facility and inputs are consumed',()=>{
 const e=make();assert.equal(e.canBuild('smelter'),false);assert.equal(e.research('metallurgy'),true);assert.equal(e.canBuild('smelter'),true);e.add('credits',1000);const n=e.buyBuilding('smelter');assert.ok(n.ok);e.step(5);assert.ok(e.s.res.alloy>0);
});
test('facility buy max stops at cost affordability',()=>{
 const e=make();const old=e.s.res.credits;e.buyBuilding('drill','max');assert.ok(e.s.buildings.drill>1);assert.ok(e.s.res.credits<old);assert.ok(e.s.res.credits>=0);
});
test('production pauses when insufficient ingredients and disabled buildings do not consume',()=>{
 const e=make();rich(e);e.s.tech.metallurgy=true;e.s.buildings.smelter=2;e.s.disabled.drill=true;e.s.res.ore=0;e.step(20);assert.equal(e.s.res.alloy,1e8);e.s.res.ore=200;assert.equal(e.toggleBuilding('smelter'),true);e.step(20);assert.equal(e.s.res.alloy,1e8);
});
test('crafting consumes inputs and creates correct outputs',()=>{
 const e=make();e.s.res.alloy=20;const before=e.s.res.energy;assert.equal(e.craft('battery',2),2);assert.equal(e.s.res.alloy,0);assert.ok(e.s.res.energy>=before+300);
});
test('market trade respects available credits and does not create free money',()=>{
 const e=make();const old=e.s.res.credits;e.trade('ore','buy',5);assert.ok(e.s.res.credits<old);const after=e.s.res.credits;e.trade('ore','sell',5);assert.ok(e.s.res.credits>after&&e.s.res.credits<old);
});
test('contract completion grants rare resources and scales next contract',()=>{
 const e=make(),m=MISSION_TEMPLATES[0];rich(e);const before=e.s.res.blueprints;const cost=e.missionPrice(m.id).ask.ore;assert.equal(e.fulfillMission(m.id),true);assert.ok(e.s.res.blueprints>before);assert.ok(e.missionPrice(m.id).ask.ore>cost);
});
test('expedition resolves after simulation time',()=>{
 const e=make();rich(e);const before=e.s.res.relics;assert.equal(e.startExpedition(EXPEDITIONS[0].id),true);e.step(26);assert.equal(e.s.expedition,null);assert.ok(e.s.res.relics>before);assert.equal(e.s.stats.expeditions,1);
});
test('artifact is one-time per run, multiplier applied',()=>{
 const e=make();rich(e);const before=e.getBonuses().global;assert.equal(e.forge('overdrive'),true);assert.equal(e.forge('overdrive'),false);assert.ok(e.getBonuses().global>before);
});
test('overdrive lasts 8 seconds and has a 15 second cooldown',()=>{
 const e=make();const before=e.getBonuses().global;assert.equal(e.pulse(),true);assert.equal(e.pulse(),false);assert.ok(e.getBonuses().global>before);e.step(9);assert.ok(e.getBonuses().global<=before*1.01);e.step(7);assert.equal(e.pulse(),true);
});
test('reboot rewards permanent cores while resetting ordinary economy',()=>{
 const e=make();rich(e);e.s.runPower=7500;e.s.tech.metallurgy=true;e.s.artifacts.overdrive=true;const gain=e.prestige('reboot');assert.equal(gain,1);assert.equal(e.s.res.cores,1);assert.equal(e.s.res.alloy,0);assert.equal(e.s.tech.metallurgy,undefined);assert.equal(e.s.stats.reboots,1);
});
test('ascension keeps higher tier currencies and purchases',()=>{
 const e=make();e.s.res.cores=36;e.s.res.eternity=2;e.s.metaUpgrades.coreAmp=3;assert.equal(e.prestige('ascend'),1);assert.equal(e.s.res.cores,0);assert.equal(e.s.res.essence,1);assert.equal(e.s.res.eternity,2);assert.equal(e.s.metaUpgrades.coreAmp,3);
});
test('four prestige layers can be independently claimed',()=>{
 for(const [id,key,source,amount] of [['reboot','cores','runPower',7500],['ascend','essence','cores',25],['collapse','singularities','essence',20],['eternity','eternity','singularities',12]]){
 const e=make();if(source==='runPower')e.s.runPower=amount;else e.s.res[source]=amount;assert.equal(e.prestige(id),1);assert.equal(e.s.res[key],1);}
});
test('saved timestamp survives restoration for offline progress',()=>{
 const now=1700000000000,e=make();e.s.lastSavedAt=now-20000;const restored=restoreState(JSON.parse(JSON.stringify(e.s)),now);assert.equal(restored.lastSavedAt,now-20000);const newEngine=new Engine(restored);assert.equal(newEngine.offline(now),20);assert.ok(newEngine.s.res.ore>90);
});
test('offline gain capped by vault limit',()=>{
 const e=make();e.s.lastSavedAt=1700000000000;e.s.upgrades.vault=1;const seconds=e.offline(1700000000000+9e7);assert.equal(seconds,3*3600);assert.equal(e.s.clock,10800);
});
test('automation cannot be enabled before research',()=>{
 const e=make();assert.equal(e.toggleAutomation('autobuy'),false);e.s.tech.factoryAI=true;assert.equal(e.toggleAutomation('autobuy'),true);assert.equal(e.s.auto.autobuy,true);
});
test('invalid save contents are sanitized',()=>{
 const s=makeState();s.res.ore=-100;s.res.credits=Infinity;s.buildings.drill=-1;s.ledger.ore=-5;const restored=restoreState(s);assert.equal(restored.res.ore,0);assert.equal(restored.res.credits,0);assert.equal(restored.buildings.drill,0);assert.equal(restored.ledger.ore,0);
});
test('number formatting can render high magnitudes',()=>{
 assert.equal(fmt(1500),'1.50K');assert.ok(fmt(1e50).includes('e'));
});
