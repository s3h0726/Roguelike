const test=require('node:test');
const assert=require('node:assert/strict');
const R=require('../roguelike.js');

test('original grass dungeon has exactly ten floors',()=>assert.equal(R.MAX_FLOOR,10));
test('first room is battle',()=>assert.deepEqual(R.routes(1),['battle']));
test('final room is boss',()=>assert.deepEqual(R.routes(10),['boss']));
test('all midgame paths include battle and unique choices',()=>{
 for(let floor=2;floor<10;floor++)for(let i=0;i<50;i++){
  const routes=R.routes(floor);
  assert.equal(routes.length,3);
  assert.equal(new Set(routes).size,3);
  assert(routes.includes('battle'));
  assert(routes.every(x=>R.ROOMS[x]));
 }
});
test('stage branch options adapt to seeded RNG',()=>{
 const a=R.routes(7,()=>.02),b=R.routes(7,()=>.98);
 assert.notDeepEqual(a,b);
});
test('normal and elite encounter counts are finite',()=>{
 for(let floor=1;floor<=10;floor++){
  assert(R.encounterCount(floor,'battle')>=2);
  assert(R.encounterCount(floor,'battle')<=4);
  assert(R.encounterCount(floor,'elite')>=2);
  assert.equal(R.encounterCount(floor,'boss'),1);
 }
});
test('run starts clean with routes and no power',()=>{
 const s=R.newRun(4);
 assert.equal(s.number,4);assert.equal(s.floor,1);assert.equal(s.kills,0);
 assert.deepEqual(s.boons,{});assert.deepEqual(s.relics,[]);
 assert.deepEqual(s.routes,['battle']);
});
test('separate runs have separate mutable collections',()=>{
 const a=R.newRun();const b=R.newRun();a.relics.push('foo');a.boons.x=3;
 assert.deepEqual(b.relics,[]);assert.deepEqual(b.boons,{});
});
test('all boon entries have unique IDs and caps',()=>{
 assert.equal(R.BOONS.length,12);
 assert.equal(new Set(R.BOONS.map(x=>x.id)).size,12);
 assert(R.BOONS.every(x=>x.cap>0&&x.desc));
});
test('boon choices respect max rank',()=>{
 const capped=Object.fromEntries(R.BOONS.slice(0,10).map(x=>[x.id,x.cap]));
 const options=R.boonChoices(capped);
 assert.equal(options.length,2);
 assert(options.every(id=>!capped[id]));
});
test('boon choices do not repeat',()=>assert.equal(new Set(R.boonChoices({})).size,3));
test('all relic entries have unique IDs',()=>{
 assert.equal(R.RELICS.length,12);
 assert.equal(new Set(R.RELICS.map(x=>x.id)).size,12);
});
test('owned relics are excluded from choices',()=>{
 const owned=R.RELICS.slice(0,10).map(r=>r.id);
 const choices=R.relicChoices(owned);
 assert.equal(choices.length,2);
 assert(choices.every(id=>!owned.includes(id)));
});
test('relic pool exhaustion has no choices',()=>assert.deepEqual(R.relicChoices(R.RELICS.map(r=>r.id)),[]));
test('sampling does not mutate input',()=>{
 const src=[1,2,3,4];R.sample(src,2,()=>.4);assert.deepEqual(src,[1,2,3,4]);
});
test('relic query is safe for empty input',()=>assert.equal(R.hasRelic(null,'foo'),false));
