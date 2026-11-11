'use strict';

const STORAGE_KEY = 'pixelCoreHunterV1';

const regions = [
  {
    id: 'grass', name: '초원', className: 'region-grass', start: 1, end: 10,
    monsters: [
      { id: 'slime', name: '슬라임', sprite: 'assets/monsters/slime.webp', grade: '일반', attr: '무속성', hp: 26, atk: 5, def: 0, exp: 3, gold: 6, trait: '약하지만 많이 등장' },
      { id: 'hornRabbit', name: '뿔토끼', sprite: 'assets/monsters/horn_rabbit.webp', grade: '일반', attr: '자연', hp: 30, atk: 6, def: 0, exp: 4, gold: 7, trait: '회피율이 높음', dodge: .12 },
      { id: 'grassWolf', name: '들늑대', sprite: 'assets/monsters/grass_wolf.webp', grade: '일반', attr: '물리', hp: 38, atk: 8, def: 1, exp: 5, gold: 9, trait: '공격 속도가 빠름', quick: true },
      { id: 'poisonMushroom', name: '독버섯', sprite: 'assets/monsters/poison_mushroom.webp', grade: '일반', attr: '독', hp: 42, atk: 6, def: 1, exp: 5, gold: 10, trait: '중독 효과', poison: true },
      { id: 'goblinScout', name: '고블린 정찰병', sprite: 'assets/monsters/goblin_scout.webp', grade: '일반', attr: '물리', hp: 46, atk: 9, def: 1, exp: 6, gold: 12, trait: '낮은 체력, 빠른 이동', quick: true },
      { id: 'redManeWolf', name: '붉은갈기 늑대', sprite: 'assets/monsters/red_mane_wolf.webp', grade: '정예', attr: '화염', hp: 95, atk: 14, def: 2, exp: 13, gold: 28, trait: '체력이 낮을수록 강해짐', enrage: true }
    ],
    boss: { id: 'giantBoar', name: '초원의 거대멧돼지', sprite: 'assets/monsters/giant_boar.webp', grade: '보스', attr: '자연', hp: 360, atk: 22, def: 4, exp: 80, gold: 220, medals: 2, trait: '주기적으로 돌진 공격', charge: true }
  }
];

const upgrades = [
  { key: 'atk', name: '공격 강화', desc: '기본 공격력이 2 증가합니다.', base: 20, grow: 1.16, apply: s => { s.player.atk += 2; } },
  { key: 'hp', name: '체력 강화', desc: '최대 체력이 12 증가합니다.', base: 18, grow: 1.15, apply: s => { s.player.maxHp += 12; s.player.hp += 12; } },
  { key: 'def', name: '방어 강화', desc: '방어력이 1 증가합니다.', base: 24, grow: 1.17, apply: s => { s.player.def += 1; } },
  { key: 'mp', name: '마나 강화', desc: '최대 마나가 8 증가합니다.', base: 22, grow: 1.15, apply: s => { s.player.maxMp += 8; s.player.mp += 8; } }
];

const skills = [
  { id: 'coreShot', name: '코어 샷', type: 'damage', mana: 8, power: 1.7, desc: '강한 단일 피해를 줍니다.' },
  { id: 'firstAid', name: '응급 회복', type: 'heal', mana: 10, power: .28, desc: '최대 체력의 일부를 회복합니다.' },
  { id: 'guardField', name: '보호장', type: 'shield', mana: 12, power: .35, desc: '짧은 보호막을 얻습니다.' },
  { id: 'poisonMark', name: '독 표식', type: 'dot', mana: 11, power: .38, desc: '지속 피해를 부여합니다.' },
  { id: 'weaken', name: '약화', type: 'debuff', mana: 10, power: .30, desc: '몬스터의 다음 공격 피해를 낮춥니다.' },
  { id: 'wideBurst', name: '범위 폭발', type: 'damage', mana: 16, power: 2.3, desc: '높은 피해를 줍니다. 후속 지역 확장용 스킬입니다.' },
  { id: 'manaFlow', name: '마나 순환', type: 'mana', mana: 0, power: 20, desc: '마나를 즉시 회복합니다.' },
  { id: 'goldSense', name: '보물 감지', type: 'reward', mana: 12, power: .50, desc: '다음 처치 보상을 증가시킵니다.' },
  { id: 'bloodDrain', name: '생명 흡수', type: 'drain', mana: 14, power: 1.2, desc: '피해를 주고 체력을 회복합니다.' },
  { id: 'focus', name: '집중', type: 'buff', mana: 14, power: .25, desc: '짧게 치명타 확률을 높입니다.' }
];

const gear = [
  { id: 'woodStaff', icon: '🪄', name: '나무 지팡이', cost: 0, atk: 1, def: 0, hp: 0, owned: true },
  { id: 'bronzeSword', icon: '🗡️', name: '청동검', cost: 90, atk: 4, def: 0, hp: 0 },
  { id: 'guardBuckler', icon: '🛡️', name: '수호 방패', cost: 140, atk: 1, def: 3, hp: 25 },
  { id: 'manaOrb', icon: '🔮', name: '마나 오브', cost: 180, atk: 2, def: 1, hp: 10, mp: 20 }
];

// Roguelike mode: every expedition starts with fresh combat stats; legacy v1 save is untouched.
const R = PixelRogue;
const ROGUE_KEY = 'pixelCoreHunterRogueV2';
const $ = id => document.getElementById(id);
let state = loadState();
let attackTimer = null;
let enemyTimer = null;
let auto = true;
let lastStrike = 0;
let toastTimer = null;

function freshState(meta = null) {
  return {
    gold:0, manaStone:10, dust:meta?.dust || 0, medals:meta?.medals || 0,
    player:{atk:10,maxHp:100,hp:100,def:3,maxMp:50,mp:50,crit:5,speed:1000,shield:0,poison:0},
    upgradeLv:{atk:0,hp:0,def:0,mp:0}, skillLv:Object.fromEntries(skills.map(s=>[s.id,1])),
    slots:['coreShot','firstAid','guardField'], gearOwned:{woodStaff:true}, equipped:'woodStaff',
    enemy:null, cooldowns:{}, effects:{dotTurns:0,dotDamage:0,weaken:0,focus:0,rewardBoost:1},
    meta:meta || {attempts:0,wins:0,bestFloor:0,medals:0,dust:0},
    run:null, log:[]
  };
}
function loadState() {
  try {
    const raw=localStorage.getItem(ROGUE_KEY);
    if(!raw) return freshState();
    const saved=JSON.parse(raw), base=freshState();
    if(!saved || !saved.player || !saved.meta) return base;
    const merge=(a,b)=>{
      for(const [k,v] of Object.entries(b)) {
        if(v && typeof v==='object' && !Array.isArray(v) && a[k] && typeof a[k]==='object' && !Array.isArray(a[k])) merge(a[k],v);
        else a[k]=v;
      } return a;
    };
    const data=merge(base,saved);
    if(data.run && !['route','combat','boon','relic','camp','merchant','event','victory','defeat'].includes(data.run.phase)) data.run=null;
    if(data.run) {
      data.run.floor=Math.min(R.MAX_FLOOR,Math.max(1,data.run.floor||1));
      if(data.run.phase==='combat' && !data.enemy) data.run.phase='route';
    }
    return data;
  }catch(err){console.warn('저장 데이터를 새로 구성합니다.',err);return freshState();}
}
function saveState(){try{localStorage.setItem(ROGUE_KEY,JSON.stringify(state));}catch(err){console.warn('저장 실패',err);}}
function format(n){n=Math.floor(n||0);return n.toLocaleString('ko-KR');}
function clamp(n,a,b){return Math.min(b,Math.max(a,n));}
function percent(v,max){return `${clamp(max>0?100*v/max:0,0,100)}%`;}
function pick(values){return values[Math.floor(Math.random()*values.length)];}
function regionForStage(){return regions[0];}
function currentGear(){return gear.find(g=>g.id===state.equipped)||gear[0];}
function playerAtk(){return state.player.atk+(currentGear().atk||0);}
function playerDef(){return state.player.def+(currentGear().def||0);}
function playerMaxHp(){return state.player.maxHp+(currentGear().hp||0);}
function playerMaxMp(){return state.player.maxMp+(currentGear().mp||0);}
function lvBoon(id){return state.run?.boons?.[id]||0;}
function hasRelic(id){return R.hasRelic(state.run,id);}
function combatActive(){return state.run?.phase==='combat' && state.player.hp>0 && !!state.enemy;}
function attackInterval(){return Math.max(330,Math.round(state.player.speed*(hasRelic('arcaneClock')?.85:1)));}
function skillPower(){return 1+lvBoon('focus')*.15+(hasRelic('stormCharm')?.3:0);}
function log(text){const time=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});state.log.push(`${time} · ${text}`);if(state.log.length>80)state.log.shift();}
function announce(text){const el=$('battleToast');el.textContent=text;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1800);}
function stopLoops(){clearInterval(attackTimer);clearInterval(enemyTimer);attackTimer=null;enemyTimer=null;}
function startLoops(){stopLoops();if(!combatActive())return;if(auto)attackTimer=setInterval(()=>playerAttack(1,'',false),attackInterval());enemyTimer=setInterval(enemyAttack,1270);}
function setPanel(id){document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('active',el.dataset.panel===id));document.querySelectorAll('.panel').forEach(el=>el.classList.toggle('active',el.id===id));}

function startRun(){
  stopLoops();
  const meta=state.meta;
  const next=meta.attempts+1;
  state=freshState(meta);
  state.meta.attempts=next;
  state.run=R.newRun(next);
  log(`제${next}차 초원 탐험을 시작했습니다.`);
  announce('새 모험이 시작되었습니다');
  showPhase();render();saveState();
}
function chooseRoute(type){
  if(state.run?.phase!=='route'||!state.run.routes.includes(type))return;
  state.run.room=type;
  state.run.path.push({floor:state.run.floor,type});
  state.run.merchantBought=[];
  if(type==='battle'||type==='elite'||type==='boss'){
    beginCombat(type);
  }else if(type==='treasure'){
    openReward(['relic']);
  }else{
    state.run.phase=type;
    showPhase();
  }
  render();saveState();
}
function beginCombat(type){
  const run=state.run;
  run.phase='combat';
  run.encounters=R.encounterCount(run.floor,type);
  run.encounterIndex=1;
  state.player.shield=Math.min(90,state.player.shield+(hasRelic('guardianSigil')?15:0));
  if(hasRelic('forestHeart')) heal(Math.round(playerMaxHp()*.1),false);
  spawnEnemy();
  hideOverlay();startLoops();
  announce(type==='boss'?'⚠️ 초원의 폭군이 깨어납니다':type==='elite'?'☠️ 정예의 영역 진입':'⚔️ 적의 기척이 느껴집니다');
}
function spawnEnemy(){
  const run=state.run;
  if(!run || run.phase!=='combat')return;
  const region=regionForStage();
  const boss=run.room==='boss';
  const elite=run.room==='elite'&&run.encounterIndex===run.encounters;
  let template;
  if(boss) template=region.boss;
  else if(elite) template=region.monsters.find(m=>m.id==='redManeWolf');
  else {
    const available=region.monsters.filter(m=>m.grade==='일반'&&(run.floor>=3||m.id!=='goblinScout'));
    const others=available.filter(m=>m.id!==run.lastEnemyId);
    template=pick(others.length?others:available);
  }
  run.lastEnemyId=template.id;
  const base=1+(run.floor-1)*.085;
  const boost=boss?.9:elite?1.12:1;
  const maxHp=Math.ceil(template.hp*base*boost);
  state.enemy={...template,maxHp,hp:maxHp,atkNow:Math.ceil(template.atk*(1+(run.floor-1)*.04)*(boss?.62:elite?.94:1)),
    isBoss:boss,isElite:elite,turns:0};
  state.effects.dotTurns=0;state.effects.dotDamage=0;state.effects.weaken=0;
  render();saveState();
}
function heal(amount,visual=true){
  const gained=Math.min(playerMaxHp()-state.player.hp,Math.max(0,Math.floor(amount)));
  state.player.hp=Math.min(playerMaxHp(),state.player.hp+gained);
  if(visual&&gained>0)floatText(`+${gained}`,'heal');
  return gained;
}
function mana(amount){state.player.mp=clamp(state.player.mp+amount,0,playerMaxMp());}
function damageEnemy(amount,source='기본 공격',cls='normal'){
  if(!combatActive())return 0;
  const enemy=state.enemy;
  if(Math.random()<(enemy.dodge||0)){floatText('MISS','bad');return 0;}
  let damage=Math.max(1,Math.floor(amount*(hasRelic('glassDagger')?1.25:1)-(enemy.def||0)));
  const critChance=clamp(state.player.crit+(state.effects.focus>0?20:0),0,85);
  const critical=Math.random()*100<critChance;
  if(critical)damage=Math.floor(damage*(hasRelic('runeCrown')?2.35:1.7));
  enemy.hp-=damage;
  floatText((critical?'✦ ':'')+format(damage),critical?'critical':'');
  boltFx(cls,critical);
  hitEnemy();
  if(source==='기본 공격'&&lvBoon('drain'))heal(Math.floor(damage*.06*lvBoon('drain')),true);
  checkEnemyDead();
  return damage;
}
function playerAttack(multiplier=1,label='',manual=false){
  if(!combatActive())return;
  const now=Date.now();
  if(manual && now-lastStrike<Math.max(260,attackInterval()*.72))return;
  lastStrike=now;
  const run=state.run;
  run.attacks++;
  const attackedEnemy=state.enemy;
  damageEnemy(playerAtk()*multiplier,label||'기본 공격','bolt');
  if(!combatActive()||state.enemy!==attackedEnemy) {mana(2+lvBoon('arcane')+(hasRelic('manaWell')?3:0));render();saveState();return;}
  mana(2+lvBoon('arcane')+(hasRelic('manaWell')?3:0));
  if(lvBoon('venom')>0&&Math.random()<Math.min(.8,.3+lvBoon('venom')*.1)){
    state.effects.dotTurns=3;
    state.effects.dotDamage=Math.max(2,Math.floor(playerAtk()*.23*lvBoon('venom')));
    floatText('독 중첩','heal');
  }
  if(hasRelic('lightningCore')&&run.attacks%4===0&&combatActive()){
    damageEnemy(playerAtk()*1.15,'번개','lightning');
    announce('⚡ 뇌전 코어 연쇄 발동');
  }
  if(state.effects.dotTurns>0&&combatActive()){
    state.effects.dotTurns--;
    const enemy=state.enemy;
    enemy.hp-=state.effects.dotDamage;
    floatText(`독 ${state.effects.dotDamage}`,'poison');
    checkEnemyDead();
  }
  if(state.effects.focus>0)state.effects.focus--;
  render();saveState();
}
function enemyAttack(){
  if(!combatActive())return;
  const enemy=state.enemy;
  enemy.turns++;
  if(state.player.poison>0){state.player.poison--;takeDamage(3,'중독');if(!combatActive())return;}
  const hits=enemy.quick?2:1;
  let attack=Math.max(1,enemy.atkNow-Math.floor(playerDef()*.65));
  if(state.effects.weaken>0)attack=Math.ceil(attack*.65);
  if(enemy.enrage&&enemy.hp/enemy.maxHp<.35)attack=Math.ceil(attack*1.35);
  if(enemy.charge && enemy.turns%4===0){attack=Math.ceil(attack*1.9);announce('🐗 거대멧돼지 돌진!');screenShake();}
  if(hasRelic('glassDagger'))attack=Math.ceil(attack*1.1);
  for(let i=0;i<hits;i++){
    takeDamage(attack,'피격');
    if(!combatActive())break;
    if(hasRelic('thornShell'))damageEnemy(6+Math.ceil(playerDef()*.45),'가시 반사','poison');
  }
  if(enemy.poison&&Math.random()<.22&&combatActive()){state.player.poison=3;floatText('중독!','bad');}
  state.effects.weaken=Math.max(0,state.effects.weaken-1);
  render();saveState();
}
function takeDamage(amount,reason){
  const block=Math.min(state.player.shield,amount);
  state.player.shield-=block;
  amount-=block;
  if(amount<=0){floatText('BLOCK','heal');return;}
  state.player.hp=Math.max(0,state.player.hp-amount);
  floatText(`-${amount}`,'bad');
  $('battleCard').classList.remove('hurt');void $('battleCard').offsetWidth;$('battleCard').classList.add('hurt');
  if(state.player.hp<=0){
    if(hasRelic('phoenixFeather')&&!state.run.usedPhoenix){
      state.run.usedPhoenix=true;
      state.player.hp=Math.max(1,Math.ceil(playerMaxHp()*.35));
      state.player.poison=0;
      state.player.shield=10;
      burstFx('phoenix');announce('🔥 불사조의 깃털 발동!');
    }else finishRun(false);
  }
}
function checkEnemyDead(){
  if(!combatActive()||state.enemy.hp>0)return;
  const run=state.run, enemy=state.enemy;
  let earned=Math.floor(enemy.gold*(1+lvBoon('treasure')*.25+(hasRelic('luckyCoin')?.4:0))*(state.effects.rewardBoost||1));
  state.gold+=earned;run.totalGold+=earned;run.kills++;
  if(run.kills%2===0)state.manaStone++;
  run.core=clamp(run.core+Math.round((enemy.isBoss?100:enemy.isElite?55:26)*(1+lvBoon('surge')*.35)),0,100);
  if(hasRelic('bloodChalice')&&(enemy.isBoss||enemy.isElite))heal(playerMaxHp()*.25);
  log(`${enemy.name} 처치 · 골드 +${earned}${enemy.isElite?' · 정예 격파':''}`);
  state.effects.rewardBoost=1;
  burstFx(enemy.isBoss?'boss':enemy.isElite?'elite':'kill');
  if(run.encounterIndex<run.encounters){run.encounterIndex++;spawnEnemy();}
  else {
    stopLoops();state.enemy=null;
    run.clearRooms++;
    if(!enemy.isBoss){heal(playerMaxHp()*.14,false);mana(12);}
    if(lvBoon('mender'))heal(playerMaxHp()*.08*lvBoon('mender'));
    if(run.room==='boss'){
      state.medals+=5;
      state.meta.medals=state.medals;
      run.bossKills++;
      log('초원의 거대멧돼지를 격파했습니다!');
      openReward(['relic']);
    }else if(run.room==='elite'){
      announce('🌟 정예 전리품 획득');openReward(['relic','boon']);
    }else openReward(['boon']);
  }
  render();saveState();
}
function openReward(kinds){
  state.run.rewardQueue=kinds.slice();
  nextReward();
}
function nextReward(){
  const run=state.run;
  const type=run.rewardQueue.shift();
  if(!type){
    if(run.returnToMerchant){run.returnToMerchant=false;run.phase='merchant';showPhase();saveState();return;}
    afterRoom();return;
  }
  run.phase=type;
  run.options=type==='boon'?R.boonChoices(run.boons):R.relicChoices(run.relics);
  if(!run.options.length){nextReward();return;}
  showPhase();saveState();
}
function chooseBoon(id){
  const run=state.run;
  if(run?.phase!=='boon'||!run.options.includes(id))return;
  const boon=R.BOONS.find(b=>b.id===id);
  if(!boon)return;
  run.boons[id]=(run.boons[id]||0)+1;
  switch(id){
    case 'ferocity':state.player.atk+=3;break;
    case 'vitality':state.player.maxHp+=22;heal(22);break;
    case 'swift':state.player.speed=Math.max(350,Math.floor(state.player.speed*.88));break;
    case 'arcane':state.player.maxMp+=16;mana(16);break;
    case 'crimson':state.player.crit+=7;break;
    case 'bulwark':state.player.def+=2;state.player.shield+=10;break;
  }
  log(`축복: ${boon.name} ${run.boons[id]}단계`);
  burstFx('relic');nextReward();render();saveState();
}
function chooseRelic(id){
  if(state.run?.phase!=='relic'||!state.run.options.includes(id)||hasRelic(id))return;
  const r=R.RELICS.find(t=>t.id===id);
  state.run.relics.push(id);
  log(`유물 획득: ${r.name}`);
  if(id==='guardianSigil')state.player.shield+=15;
  burstFx('relic');nextReward();render();saveState();
}
function afterRoom(){
  const run=state.run;
  if(!run)return;
  if(run.floor>=R.MAX_FLOOR){finishRun(true);return;}
  run.floor++;
  run.phase='route';
  run.room=null;
  run.encounterIndex=0;
  run.encounters=0;
  run.routes=R.routes(run.floor);
  run.options=[];
  state.enemy=null;
  showPhase();render();saveState();
}
function finishRun(won){
  const run=state.run;
  if(!run||['victory','defeat'].includes(run.phase))return;
  stopLoops();
  run.phase=won?'victory':'defeat';
  const dust=Math.max(1,Math.floor(run.kills/4)+run.floor-1+(won?20:0));
  state.dust+=dust;state.meta.dust=state.dust;
  state.meta.bestFloor=Math.max(state.meta.bestFloor,run.floor);
  if(won){state.meta.wins++;announce('🏆 초원 정복!');}
  else announce('💀 모험이 끝났습니다');
  run.earnedDust=dust;
  log(won?`모험 성공! 먼지 +${dust}`:`모험 실패 · ${run.floor}층 도달 · 먼지 +${dust}`);
  showPhase();render();saveState();
}
function restChoice(action){
  if(state.run?.phase!=='camp')return;
  if(action==='heal'){const h=heal(playerMaxHp()*.42);log(`모닥불 회복 +${h}`);}
  else if(action==='mana'){mana(playerMaxMp());state.player.poison=0;log('마나 및 중독 상태 회복');}
  else if(action==='train'){
    const equipped=state.slots.filter(Boolean);
    const chosen=pick(equipped);
    state.skillLv[chosen]=(state.skillLv[chosen]||1)+1;
    log(`${skillName(chosen)} 무료 강화`);
  }else return;
  afterRoom();
}
function eventChoice(action){
  if(state.run?.phase!=='event')return;
  if(action==='risk'){
    takeDamage(Math.max(1,Math.floor(playerMaxHp()*.16)),'제단의 저주');
    if(state.run.phase==='defeat')return;
    log('불안정한 제단: 체력을 바치고 유물 획득');
    openReward(['relic']);
  }else if(action==='safe'){state.gold+=38;log('안전한 공물: 골드 +38');afterRoom();}
  else if(action==='mana'){state.manaStone+=8;mana(18);log('마력의 축복: 수정 +8');afterRoom();}
}
function merchantChoice(action){
  if(state.run?.phase!=='merchant')return;
  if(action==='leave'){afterRoom();return;}
  const prices={heal:hasRelic('luckyCoin')?20:25,stone:32,relic:65};
  if(!Object.hasOwn(prices,action)||state.run.merchantBought.includes(action))return;
  if(state.gold<prices[action]){announce('골드가 부족합니다');return;}
  state.gold-=prices[action];state.run.merchantBought.push(action);
  if(action==='heal')heal(playerMaxHp()*.4);
  if(action==='stone')state.manaStone+=12;
  log(`상점 구매: ${action} (${prices[action]}G)`);
  if(action==='relic'){state.run.returnToMerchant=true;openReward(['relic']);}
  else showPhase();
  render();saveState();
}
function coreRelease(){
  if(!combatActive()||state.run.core<100)return;
  state.run.core=0;
  const e=state.enemy;
  e.hp-=Math.ceil(playerAtk()*5.0+e.maxHp*.14);
  state.player.shield+=18;
  burstFx('core');screenShake();announce('⚡ CORE BREAK — 코어 해방!');
  floatText('CORE BREAK','critical');checkEnemyDead();render();saveState();
}
function skillCost(id){return 4+Math.floor((state.skillLv[id]||1)*1.8);}
function skillName(id){return skills.find(s=>s.id===id)?.name||id;}
function cooldownMs(sk){return Math.floor((sk.type==='heal'||sk.type==='shield'?12000:sk.type==='mana'?9000:7500)*(hasRelic('stormCharm')?.85:1));}
function useSkill(slot){
  if(!combatActive())return;
  const id=state.slots[slot],sk=skills.find(s=>s.id===id);
  if(!sk)return;
  const lv=state.skillLv[id]||1;
  const cost=Math.max(0,sk.mana+Math.floor(lv*1.5));
  if(state.player.mp<cost){announce('마나가 부족합니다');return;}
  if(Date.now()<(state.cooldowns[id]||0)){announce('스킬 재사용 대기 중');return;}
  state.player.mp-=cost;
  state.cooldowns[id]=Date.now()+cooldownMs(sk);
  const power=skillPower();
  if(sk.type==='damage') damageEnemy(playerAtk()*(sk.power+lv*.08)*power,sk.name,sk.id);
  if(sk.type==='heal'){heal(playerMaxHp()*(sk.power+lv*.013));burstFx('heal');}
  if(sk.type==='shield'){state.player.shield+=Math.floor(playerMaxHp()*(sk.power+lv*.015));burstFx('shield');}
  if(sk.type==='dot'){state.effects.dotTurns=5;state.effects.dotDamage=Math.ceil(playerAtk()*(sk.power+lv*.03)*power);burstFx('poison');}
  if(sk.type==='debuff'){state.effects.weaken=5+Math.floor(lv/3);burstFx('poison');}
  if(sk.type==='mana'){mana(sk.power+lv*3);burstFx('mana');}
  if(sk.type==='reward'){state.effects.rewardBoost=1+sk.power+lv*.035;floatText('골드 강화','heal');}
  if(sk.type==='drain'){const dealt=damageEnemy(playerAtk()*(sk.power+lv*.07)*power,sk.name,'drain');heal(dealt*.45);}
  if(sk.type==='buff'){state.effects.focus=6+lv;burstFx('core');}
  render();saveState();
}
function upgradeCost(up){return Math.floor(up.base*Math.pow(up.grow,state.upgradeLv[up.key]||0));}
function buyUpgrade(key,count=1){
  if(!state.run||['defeat','victory'].includes(state.run.phase))return;
  const up=upgrades.find(u=>u.key===key);if(!up)return;
  let bought=0;
  for(let i=0;i<count;i++){
    const price=upgradeCost(up);if(state.gold<price)break;
    state.gold-=price;state.upgradeLv[key]++;up.apply(state);bought++;
  }
  if(bought){log(`${up.name} +${bought}`);render();saveState();}
}
function levelSkill(id){
  if(!state.run||['defeat','victory'].includes(state.run.phase))return;
  const cost=skillCost(id);if(state.manaStone<cost)return announce('마나수정이 부족합니다');
  state.manaStone-=cost;state.skillLv[id]=(state.skillLv[id]||1)+1;
  log(`${skillName(id)} Lv.${state.skillLv[id]}`);render();saveState();
}
function equipSkill(slot,id){
  if(!state.run||['defeat','victory'].includes(state.run.phase))return;
  if(!skills.some(s=>s.id===id)||slot<0||slot>2)return;
  const duplicate=state.slots.indexOf(id);
  if(duplicate!==-1&&duplicate!==slot)state.slots[duplicate]=state.slots[slot];
  state.slots[slot]=id;render();saveState();
}
function buyGear(id){
  if(!state.run||['defeat','victory'].includes(state.run.phase))return;
  const item=gear.find(g=>g.id===id);if(!item)return;
  if(!state.gearOwned[id]){
    if(state.gold<item.cost)return announce('골드가 부족합니다');
    state.gold-=item.cost;state.gearOwned[id]=true;
  }
  state.equipped=id;
  state.player.hp=Math.min(playerMaxHp(),state.player.hp);
  state.player.mp=Math.min(playerMaxMp(),state.player.mp);
  log(`${item.name} 장착`);render();saveState();
}

function optionCard(action,id,icon,title,desc,tag='',disabled=false){
  return `<button class="choice-card" data-action="${action}" data-id="${id}" ${disabled?'disabled':''}><span class="choice-icon">${icon}</span><span class="choice-body"><strong>${title}</strong><small>${desc}</small></span><em>${tag}</em></button>`;
}
function showPhase(){
  const overlay=$('choiceOverlay'),run=state.run;
  overlay.hidden=false;
  if(!run){
    $('choiceKicker').textContent='PIXEL CORE HUNTER · CORE ROGUE';
    $('choiceTitle').textContent='초원의 코어를 되찾아라';
    $('choiceDescription').textContent='원작 몬스터·스킬·장비를 그대로 활용한 10층 로그라이크. 길을 선택하고, 매번 달라지는 축복과 유물을 조합해 거대멧돼지에게 도전하세요.';
    $('choiceCards').innerHTML=optionCard('start','new','⚔️','새 모험 시작','공격력·장비·성장이 새롭게 초기화됩니다.','START');
    $('choiceFoot').textContent=`기록: 최고 ${state.meta.bestFloor}층 · 완주 ${state.meta.wins}회 · 도전 ${state.meta.attempts}회`;
    return;
  }
  const floor=run.floor;
  $('choiceKicker').textContent=`EXPEDITION ${run.number} · FLOOR ${floor}/10`;
  $('choiceFoot').textContent=`❤️ ${Math.ceil(state.player.hp)}/${playerMaxHp()}    🪙 ${format(state.gold)}    ⚡ ${run.core}%`;
  if(run.phase==='route'){
    $('choiceTitle').textContent=`${floor}층 · 운명의 갈림길`;
    $('choiceDescription').textContent=floor===10?'초원의 거대멧돼지가 기다리고 있습니다. 준비가 되었다면 마지막 문을 여세요.':'어느 길을 택하느냐에 따라 보상과 위험이 달라집니다.';
    $('choiceCards').innerHTML=run.routes.map(id=>{const room=R.ROOMS[id];return optionCard('route',id,room.icon,room.name,room.desc,room.tag);}).join('');
  } else if(run.phase==='boon'){
    $('choiceTitle').textContent='운명의 축복';$('choiceDescription').textContent='세 가지 힘 가운데 하나를 선택하세요. 축복은 이번 모험에서만 유지됩니다.';
    $('choiceCards').innerHTML=run.options.map(id=>{const b=R.BOONS.find(x=>x.id===id);return optionCard('boon',id,b.icon,b.name+` · ${run.boons[id]||0}/${b.cap}`,b.desc,b.rarity);}).join('');
  } else if(run.phase==='relic'){
    $('choiceTitle').textContent='봉인된 유물';$('choiceDescription').textContent='오직 하나만 소유할 수 있는 유물의 힘을 고르세요.';
    $('choiceCards').innerHTML=run.options.map(id=>{const r=R.RELICS.find(x=>x.id===id);return optionCard('relic',id,r.icon,r.name,r.desc,r.rarity);}).join('');
  } else if(run.phase==='camp'){
    $('choiceTitle').textContent='안식의 모닥불';$('choiceDescription').textContent='한 가지만 선택할 수 있습니다.';
    $('choiceCards').innerHTML=[optionCard('camp','heal','❤️','치유','최대 체력의 42% 회복'),optionCard('camp','mana','💠','명상','마나 완전 회복, 중독 해제'),optionCard('camp','train','📜','스킬 연마','장착한 스킬 중 하나 무료 레벨업')].join('');
  } else if(run.phase==='event'){
    $('choiceTitle').textContent='수상한 제단';$('choiceDescription').textContent='오래된 제단이 세 가지 거래를 제안합니다.';
    $('choiceCards').innerHTML=[optionCard('event','risk','🩸','체력의 대가','최대 체력의 16%를 잃고 무작위 유물 3개 중 1개 선택','고위험'),optionCard('event','safe','🪙','안전한 공물','골드 +38'),optionCard('event','mana','🔮','마력 채집','마나수정 +8, 마나 18 회복')].join('');
  } else if(run.phase==='merchant'){
    $('choiceTitle').textContent='방랑 상점';$('choiceDescription').textContent='물건을 구매하거나 다음 층으로 떠날 수 있습니다. 아래 장비 탭의 기존 4종 장비도 언제든 구매할 수 있습니다.';
    const done=run.merchantBought;
    $('choiceCards').innerHTML=[optionCard('merchant','heal','🧪','회복 물약',`최대 체력의 40% 회복 · ${hasRelic('luckyCoin')?20:25}G`,'구매',done.includes('heal')),optionCard('merchant','stone','🔮','마나수정 꾸러미','마나수정 +12 · 32G','구매',done.includes('stone')),optionCard('merchant','relic','💎','봉인된 유물','무작위 유물 3개 중 하나 선택 · 65G','구매',done.includes('relic')),optionCard('merchant','leave','➡️','상점 떠나기','다음 층으로 이동합니다.','다음 층')].join('');
  } else if(run.phase==='victory'||run.phase==='defeat'){
    const win=run.phase==='victory';
    $('choiceKicker').textContent=win?'RUN COMPLETE':'RUN ENDED';
    $('choiceTitle').textContent=win?'🏆 초원 정복 성공!':'💀 탐험이 끝났습니다';
    $('choiceDescription').textContent=`${floor}층 도달 · 몬스터 ${run.kills}마리 처치 · 유물 ${run.relics.length}개 · 축복 ${Object.values(run.boons).reduce((a,b)=>a+b,0)}회 · 기억의 가루 +${run.earnedDust}`;
    $('choiceCards').innerHTML=optionCard('start','new','🔁','새로운 운명의 모험','전투 성장과 장비는 초기화되지만, 완주 기록과 메타 보상은 남습니다.','RESTART');
    $('choiceFoot').textContent=`전체 기록: ${state.meta.wins}회 완주 · 최고 ${state.meta.bestFloor}층`;
  } else {
    overlay.hidden=true;
  }
}
function hideOverlay(){$('choiceOverlay').hidden=true;}
function dispatchChoice(action,id){
  if(action==='start')startRun();
  else if(action==='route')chooseRoute(id);
  else if(action==='boon')chooseBoon(id);
  else if(action==='relic')chooseRelic(id);
  else if(action==='camp')restChoice(id);
  else if(action==='event')eventChoice(id);
  else if(action==='merchant')merchantChoice(id);
}

function render(){
  const run=state.run,phase=run?.phase;
  const floor=run?.floor||1;
  $('battleCard').className=`battle-card region-grass ${floor>7?'region-late':floor>4?'region-deep':''}`;
  $('stageText').textContent=run?`초원 ${floor} / 10`:'초원 미궁';
  $('regionLabel').textContent=phase==='combat' ? (run.room==='boss'?'👑 최종 보스':run.room==='elite'?'☠️ 정예 토벌':'🌿 초원 전투') : '🌿 초원 지역';
  $('waveText').textContent=phase==='combat'?`${run.encounterIndex} / ${run.encounters}번째 적` : phase==='route'?'길 선택 대기':phase==='victory'?'모험 완수':phase==='defeat'?'모험 실패':'보상 / 준비';
  $('goldText').textContent=format(state.gold);
  $('manaStoneText').textContent=format(state.manaStone);
  $('dustText').textContent=format(state.dust);
  $('medalText').textContent=format(state.medals);
  $('atkText').textContent=playerAtk();$('defText').textContent=playerDef();
  $('speedText').textContent=(attackInterval()/1000).toFixed(2)+'초';
  $('playerHpBar').style.width=percent(state.player.hp,playerMaxHp());
  $('playerHpText').textContent=`${Math.ceil(state.player.hp)}/${playerMaxHp()}${state.player.shield?' +' +state.player.shield:''}`;
  $('playerMpBar').style.width=percent(state.player.mp,playerMaxMp());
  $('playerMpText').textContent=`${Math.ceil(state.player.mp)}/${playerMaxMp()}`;
  if(state.enemy){
    $('enemyName').textContent=state.enemy.name;
    $('enemyImage').src=state.enemy.sprite;$('enemyImage').alt=state.enemy.name;
    $('enemyImage').style.visibility='visible';
    $('enemyHpBar').style.width=percent(state.enemy.hp,state.enemy.maxHp);
    $('enemyHpText').textContent=`${Math.ceil(Math.max(0,state.enemy.hp))}/${state.enemy.maxHp}`;
    $('enemyTags').textContent=`${state.enemy.attr} · ${state.enemy.grade} · ${state.enemy.trait}`;
    $('enemyFrame').classList.toggle('boss',!!state.enemy.isBoss);
  }else{
    $('enemyName').textContent=phase==='victory'?'전설 달성':'다음 도전 대기';
    $('enemyImage').style.visibility='hidden';$('enemyHpBar').style.width='0%';
    $('enemyHpText').textContent='—';$('enemyTags').textContent='운명의 길을 선택하세요';$('enemyFrame').classList.remove('boss');
  }
  $('runBadge').textContent=run?`✦ ${run.number}회차 · ${phase==='combat'?'전투':'탐색'}`:'✦ NEW RUN';
  $('runChargeText').textContent=`⚡ ${run?.core||0}%`;
  $('floorTrack').innerHTML=Array.from({length:10},(_,i)=>`<i class="${i+1<floor?'passed':i+1===floor?'current':''}" title="${i+1}층"></i>`).join('');
  $('bossBtn').disabled=!combatActive()||run.core<100;
  $('bossBtn').textContent=run?.core>=100?'⚡ 코어 해방 (Q)':`⚡ 코어 ${run?.core||0}%`;
  $('autoBtn').textContent=auto?'자동 ON':'자동 OFF';
  $('attackBtn').disabled=!combatActive();
  for(let i=0;i<3;i++){
    const sk=skills.find(s=>s.id===state.slots[i]);const until=state.cooldowns[sk?.id]||0;
    const wait=Math.max(0,(until-Date.now())/1000);
    const btn=$(`skill${i+1}Btn`);
    btn.textContent=sk?`${sk.name}${wait>.1?' ('+wait.toFixed(0)+'s)':''}`:`빈 슬롯 ${i+1}`;
    btn.disabled=!combatActive()||!sk||wait>.1||state.player.mp<sk.mana+Math.floor((state.skillLv[sk.id]||1)*1.5);
  }
  renderUpgrades();renderSkills();renderGear();renderDungeon();renderLog();
}
function renderUpgrades(){
  $('upgradeGrid').innerHTML=upgrades.map(u=>`<div class="card"><h3>${u.name} <span class="pill">Lv.${state.upgradeLv[u.key]||0}</span></h3><p>${u.desc}</p><p>비용: 🪙 ${format(upgradeCost(u))}</p><div class="btn-row"><button onclick="buyUpgrade('${u.key}',1)">+1</button><button onclick="buyUpgrade('${u.key}',10)">+10</button></div></div>`).join('');
}
function renderSkills(){
  $('slotRow').innerHTML=state.slots.map((id,i)=>`<div class="slot">${i+1}번 슬롯<br>${skillName(id)}</div>`).join('');
  $('skillGrid').innerHTML=skills.map(s=>{
    const lv=state.skillLv[s.id]||1;
    return `<div class="card"><h3>${s.name} <span class="pill">Lv.${lv}</span></h3><p>${s.desc}</p><p>마나 ${s.mana+Math.floor(lv*1.5)} · 레벨업 🔮 ${skillCost(s.id)}</p><div class="btn-row"><button onclick="levelSkill('${s.id}')">강화</button>${state.slots.map((_,i)=>`<button onclick="equipSkill(${i},'${s.id}')">${i+1}번 장착</button>`).join('')}</div></div>`;
  }).join('');
}
function renderGear(){
  $('gearGrid').innerHTML=gear.map(g=>{
    const owned=!!state.gearOwned[g.id],equipped=state.equipped===g.id;
    return `<div class="card ${equipped?'equipped':''}"><span class="gear-icon">${g.icon}</span><h3>${g.name}</h3><p>공격 +${g.atk||0} / 방어 +${g.def||0} / 체력 +${g.hp||0} / 마나 +${g.mp||0}</p><p>${owned?'보유 중':'가격 🪙 '+g.cost}</p><div class="btn-row"><button onclick="buyGear('${g.id}')">${equipped?'장착 중':owned?'장착':'구매'}</button></div></div>`;
  }).join('');
}
function renderDungeon(){
  const run=state.run;
  $('runMetrics').innerHTML=run?`<div>🏁 <strong>${run.floor}/10층</strong><small>현재 위치</small></div><div>⚔️ <strong>${run.kills}마리</strong><small>처치 기록</small></div><div>💎 <strong>${run.relics.length}개</strong><small>유물</small></div><div>🏅 <strong>${state.meta.wins}회</strong><small>누적 완주</small></div>`:'<p>새 모험을 시작하세요.</p>';
  $('pathHistory').innerHTML=run?.path?.length?run.path.map(p=>`<span>${p.floor}층 ${R.ROOMS[p.type]?.icon||''} ${R.ROOMS[p.type]?.name||p.type}</span>`).join(''):'<span>아직 선택한 길이 없습니다.</span>';
  $('boonCollection').innerHTML=run?Object.entries(run.boons).map(([id,level])=>{const b=R.BOONS.find(x=>x.id===id);return b?`<div title="${b.desc}">${b.icon} ${b.name} ×${level}</div>`:'';}).join('')||'<p>아직 축복이 없습니다.</p>':'';
  $('relicCollection').innerHTML=run?run.relics.map(id=>{const r=R.RELICS.find(x=>x.id===id);return r?`<div title="${r.desc}">${r.icon} ${r.name}</div>`:'';}).join('')||'<p>아직 유물이 없습니다.</p>':'';
}
function renderLog(){const box=$('logBox');box.replaceChildren(...state.log.slice(-60).reverse().map(t=>{const div=document.createElement('div');div.className='log-item';div.textContent=t;return div;}));}
function boltFx(kind='bolt',crit=false){
  const layer=$('projectileLayer');
  const bolt=document.createElement('div');bolt.className=`bolt bolt-${kind} ${crit?'bolt-crit':''}`;
  layer.appendChild(bolt);setTimeout(()=>bolt.remove(),680);
}
function hitEnemy(){const frame=$('enemyFrame');frame.classList.remove('hit');void frame.offsetWidth;frame.classList.add('hit');}
function floatText(text,cls=''){
  const el=document.createElement('div');el.className=`float-text ${cls}`;el.textContent=text;
  $('battleCard').appendChild(el);setTimeout(()=>el.remove(),850);
}
function screenShake(){const el=$('battleCard');el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function burstFx(kind='kill'){
  const area=$('battleCard');
  const el=document.createElement('div');el.className=`burst burst-${kind}`;
  area.appendChild(el);setTimeout(()=>el.remove(),1050);
  if(['core','boss','phoenix'].includes(kind))screenShake();
}
function bindUI(){
  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>setPanel(btn.dataset.panel)));
  $('skill1Btn').addEventListener('click',()=>useSkill(0));
  $('skill2Btn').addEventListener('click',()=>useSkill(1));
  $('skill3Btn').addEventListener('click',()=>useSkill(2));
  $('bossBtn').addEventListener('click',coreRelease);
  $('attackBtn').addEventListener('click',()=>playerAttack(1,'',true));
  $('autoBtn').addEventListener('click',()=>{auto=!auto;startLoops();render();});
  $('prevStageBtn').addEventListener('click',()=>setPanel('dungeonPanel'));
  $('nextStageBtn').addEventListener('click',()=>setPanel('upgradePanel'));
  $('routeBtn').addEventListener('click',()=>{if(state.run?.phase==='combat')announce('전투 중에는 길을 바꿀 수 없습니다');else showPhase();});
  $('giveUpBtn').addEventListener('click',()=>{
    if(!confirm('현재 모험을 포기하고 새로운 모험을 시작할까요?'))return;
    if(state.run&&state.run.phase!=='victory'&&state.run.phase!=='defeat')finishRun(false);
    startRun();
  });
  $('resetBtn').addEventListener('click',()=>{
    if(!confirm('코어 로그의 모든 저장과 완주 기록을 삭제할까요? 기존 v1 저장 데이터는 삭제되지 않습니다.'))return;
    stopLoops();localStorage.removeItem(ROGUE_KEY);state=freshState();showPhase();render();
  });
  $('choiceCards').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b&&!b.disabled)dispatchChoice(b.dataset.action,b.dataset.id);});
  window.addEventListener('keydown',e=>{
    if(['Digit1','Digit2','Digit3','KeyQ','KeyA','Space'].includes(e.code))e.preventDefault();
    if(e.repeat)return;
    if(e.code==='Digit1')useSkill(0);
    if(e.code==='Digit2')useSkill(1);
    if(e.code==='Digit3')useSkill(2);
    if(e.code==='KeyQ')coreRelease();
    if(e.code==='KeyA'||e.code==='Space')playerAttack(1,'',true);
  });
  $('playerSprite').addEventListener('click',()=>playerAttack(1,'',true));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopLoops();else startLoops();
  });
}
bindUI();
render();
if(state.run?.phase==='combat'){startLoops();hideOverlay();}
else showPhase();
// Update cooldown labels without recreating choices.
setInterval(()=>{if(combatActive()){
  for(let i=0;i<3;i++){
    const sk=skills.find(s=>s.id===state.slots[i]);if(!sk)continue;
    const wait=Math.max(0,(state.cooldowns[sk.id]||0)-Date.now());
    const btn=$(`skill${i+1}Btn`);btn.textContent=sk.name+(wait>100?` (${Math.ceil(wait/1000)}s)`:'');
    btn.disabled=wait>0||state.player.mp<sk.mana+Math.floor((state.skillLv[sk.id]||1)*1.5);
  }
}},450);
