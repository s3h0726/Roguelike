/* CHAOS EDEN EXPANSION — optional live economy, socketed relics and research dashboard. */
(() => {
'use strict';
if(!window.ChaosAdvancedCore||!window.ChaosHorde)return;
const C=window.ChaosAdvancedCore;
const $=id=>document.getElementById(id);
const fmtValue=x=>typeof fmt==='function'?fmt(x):Math.floor(x).toLocaleString('ko-KR');
let advanced=null,tab='overview',query='',lastSynced=-1;
function ensure(){
 if(state?.advanced!==advanced){advanced=C.normalize(state?.advanced);state.advanced=advanced;}
 return advanced;
}
function effect(){return C.stats(ensure(),state);}
function flash(message,good=true){const b=$('expansionMessage');if(b){b.textContent=message;b.style.color=good?'#9effca':'#ffadba';}if(typeof log==='function')log(message,good?'good':'warn');}
function price(items){return Object.entries(items).map(([k,v])=>`${C.names[k]||k} ${fmtValue(v)}`).join(' · ');}
function has(items){return C.afford(ensure(),state,items);}
function mkcard(icon,title,description,meta,cost,action,locked=false,btn='획득'){
 const afford=cost?has(cost):true;
 const button=action?`<button type="button" ${locked||!afford?'disabled':''} onclick="ChaosExpansion.action('${action}')">${btn}</button>`:'';
 return `<article class="exp-card ${locked?'exp-locked':''}"><div class="exp-heading"><b>${icon} ${title}</b><span>${meta||''}</span></div><p>${description||''}</p>${cost?`<div class="exp-cost ${afford?'':'exp-short'}">${price(cost)}</div>`:''}${button}</article>`;
}
function banner(text){return `<div class="exp-notice">${text}</div>`;}
const clickCost=(id,n)=>C.scaleCost(C.BLD.find(d=>d.id===id).cost,n,1.18);
function overview(){const a=ensure(),e=effect();const amount=Object.values(a.buildings).reduce((s,n)=>s+n,0);
 const income=C.BLD.filter(x=>a.buildings[x.id]).slice(0,5).map(x=>`${x.icon} ${x.name} Lv.${a.buildings[x.id]}`).join(' · ');
 const milestone=state.stage<=5?'초보자 전장을 1웨이브씩 돌파하세요.':state.stage<=10?'스테이지 10까지 2웨이브씩 빠르게 진행하세요.':state.stage<20?'시설과 기술을 연구하고 20스테이지를 돌파하세요.':state.stage<40?'유물을 조합하고 우주 재료를 모으세요.':'차원 순환을 준비하고 고급 유물을 조합하세요.';
 return banner(`<strong>지금 할 일:</strong> ${milestone}`)+`<div class="exp-summary-grid">
 <div><b>⚔ 공격 증폭</b><strong>+${Math.round(e.atk*100)}%</strong></div><div><b>⚙ 건물 수</b><strong>${fmtValue(amount)}</strong></div>
 <div><b>📚 연구</b><strong>${Object.values(a.research).filter(Boolean).length}/${C.RESEARCH.length}</strong></div><div><b>🔯 유물</b><strong>${Object.values(a.relics).filter(Boolean).length}/${C.RELICS.length}</strong></div>
 <div><b>✨ 초월 인장</b><strong>${fmtValue(a.tokens)}</strong></div><div><b>🌠 차원 순환</b><strong>${a.ascensions}회</strong></div></div>
 <h3 class="exp-subtitle">📦 보유 특수 재화 (${C.RES.length}종)</h3><div class="exp-wallet">${C.RES.map(r=>`<div><span>${r.icon} ${r.name}</span><b>${fmtValue(a.res[r.id])}</b></div>`).join('')}</div>
 <h3 class="exp-subtitle">✨ 현재 강화 효과</h3><p class="exp-note">공격 +${Math.round(e.atk*100)}%, 공격 속도 +${Math.round(e.speed*100)}%, 최대 체력 +${Math.round(e.hp*100)}%, 드롭 보너스 +${Math.round(e.drop*100)}%, 생산 +${Math.round(e.prod*100)}%, 골드 +${Math.round(e.gold*100)}%</p>
 <p class="exp-note">가동 시설: ${income||'아직 시설 없음'} · 탐사 완료 ${a.explores}회 · 적 격파 ${fmtValue(a.progress.kills)}마리</p>`;
}
function buildings(){const a=ensure();return banner('시설은 2초마다 생산합니다. 재료가 부족하면 해당 시설이 대기합니다. 생산·정제·우주 제조의 단계별 공급망을 구성하세요.')+
 `<div class="exp-grid">${C.BLD.filter(d=>!query||d.name.includes(query)).map(d=>{
 const n=a.buildings[d.id]||0,c=clickCost(d.id,n),flow=Object.entries(d.flow).map(([k,v])=>`${v<0?'소모':'생산'} ${C.names[k]} ${Math.abs(v)*n*2}/2초`).join(' · ');
 return mkcard(d.icon,d.name,`생산: ${n?flow:'시설 구매 후 가동'}`,`Lv.${n} / 500 · ${d.stage}층 해금`,c,`building:${d.id}`,state.stage<d.stage, '시설 건설');}).join('')}</div>`;}
function research(){const a=ensure();return banner('선행 연구와 필요 재화를 충족해야 해금됩니다. 모든 연구는 전투와 생산 보너스에 실제 적용됩니다.')+
 `<div class="exp-grid">${C.RESEARCH.filter(d=>!query||d.name.includes(query)).map(d=>mkcard('📖',d.name,
 `${d.prereq?'선행: '+(C.RESEARCH.find(x=>x.id===d.prereq)?.name||d.prereq)+' · ':''}효과: ${Object.entries(d.effect).map(([k,v])=>k==='auto'?'자동화 해금':`${({atk:'공격',speed:'공격 속도',hp:'체력',armor:'받는 피해 감소',drop:'드롭',gold:'골드',regen:'체력 회복',prod:'시설 생산'})[k]||k} +${v<1?Math.round(v*100)+'%':v}`).join(', ')}`,
 a.research[d.id]?'연구 완료':`${d.stage}층 해금`,a.research[d.id]?null:d.cost,a.research[d.id]?null:`research:${d.id}`,
 state.stage<d.stage||(d.prereq&&!a.research[d.prereq]),'기술 연구')).join('')}</div>`;}
function relics(){const a=ensure();const groups=['flame','void','chrono','star','earth','storm'];const names={flame:'🔥 홍염',void:'🌌 공허',chrono:'⌛ 시간',star:'🌠 별빛',earth:'🌿 대지',storm:'⚡ 뇌전'};
 return banner('유물은 6개 계열로 나뉩니다. 같은 계열 2개 획득 시 시너지, 3개 획득 시 추가 공격·생산 보너스가 활성화됩니다.')+
 `<div class="exp-sets">${groups.map(s=>`<span>${names[s]} ${C.RELICS.filter(r=>r.set===s&&a.relics[r.id]).length}/3</span>`).join('')}</div><div class="exp-grid">${C.RELICS.filter(d=>!query||d.name.includes(query)).map(d=>mkcard(d.icon,d.name,`${names[d.set]} · ${Object.entries(d.effect).map(([k,v])=>`${k} +${Math.round(v*100)}%`).join(' ')}`,a.relics[d.id]?'보유중':`${d.stage}층`,a.relics[d.id]?null:d.cost,a.relics[d.id]?null:`relic:${d.id}`,state.stage<d.stage,'유물 봉인 해제')).join('')}</div>`;}
function talents(){const a=ensure();return banner('성장 특성은 유물과 별도로 적용됩니다. 같은 계열을 집중 육성하면 고난도 전장에서 유리합니다.')+
 `<div class="exp-grid">${C.TALENTS.filter(d=>!query||d.name.includes(query)).map(d=>mkcard('🌟',d.name,Object.entries(d.effect).map(([k,v])=>`${k} +${v>=1?v:Math.round(v*100)+'%'}`).join(' '),a.talents[d.id]?'획득 완료':`${d.stage}층`,a.talents[d.id]?null:d.cost,a.talents[d.id]?null:`talent:${d.id}`,state.stage<d.stage,'특성 습득')).join('')}</div>`;}
function recipes(){const a=ensure();return banner('제작은 생산 재료를 고급 자원으로 변환합니다. 거래나 유물 제작으로 이어지는 공급망을 설계하세요.')+
 `<div class="exp-grid">${C.RECIPES.filter(d=>!query||d.name.includes(query)).map(d=>mkcard('⚒️',d.name,`제작 결과: ${price(d.out)}`,`${d.stage}층 해금`,d.cost,`craft:${d.id}`,state.stage<d.stage,'1회 제작')).join('')}</div>`;}
function potions(){const a=ensure(),now=Date.now();return banner('소모품은 일정 시간 동안 모든 전투·생산 활동에 버프가 적용됩니다. 같은 물약을 다시 사용하면 지속시간이 누적됩니다.')+
 `<div class="exp-grid">${C.POTIONS.filter(d=>!query||d.name.includes(query)).map(d=>mkcard('🧪',d.name,`${Object.entries(d.effect).map(([k,v])=>k==='regen'?`초당 회복 +${v}`:`${k} +${Math.round(v*100)}%`).join(' · ')} · 기본 ${d.seconds}초`,
 a.potions[d.id]>now?`남은 ${Math.ceil((a.potions[d.id]-now)/1000)}초`:`${d.stage}층 해금`,d.cost,`potion:${d.id}`,state.stage<d.stage,'물약 사용')).join('')}</div>`;}
function expedition(){const a=ensure(),active=a.expedition,now=Date.now();return banner('한 번에 한 탐사대만 파견할 수 있습니다. 탐사는 전투 중에도 진행되며 게임을 종료해도 시간이 누적됩니다.')+
 (active?`<div class="exp-expedition">🚩 현재 탐사: ${C.EXPEDITIONS.find(x=>x.id===active.id)?.name||active.id} · ${active.ends>now?`남은 ${Math.ceil((active.ends-now)/1000)}초`:'완료! 보상 획득 가능'} <button onclick="ChaosExpansion.action('claimExpedition')" ${active.ends>now?'disabled':''}>보상 수령</button></div>`:'')+
 `<div class="exp-grid">${C.EXPEDITIONS.filter(d=>!query||d.name.includes(query)).map(d=>mkcard('🧭',d.name,`탐사 ${d.seconds}초 · 보상 ${price(d.reward)}`,`${d.stage}층`,null,`expedition:${d.id}`,state.stage<d.stage||!!active,'탐사 출발')).join('')}</div>`;}
function contracts(){const a=ensure();return banner('의뢰는 적 처치·웨이브 돌파로 자동 진행됩니다. 의뢰를 완료하면 재화뿐 아니라 세력 평판을 얻어 추가 패시브 효과가 열립니다.')+
 `<div class="exp-grid">${C.CONTRACTS.filter(d=>!query||d.name.includes(query)).map(d=>{const period=Math.floor(a.progress.waves/40);const done=a.contracts[d.id+':'+period];const val=d.kind==='kill'?a.progress.kills:a.progress.waves;
 return mkcard('📋',d.name,`진행도 ${fmtValue(val)} / ${fmtValue(d.target*(period+1))} · 보상 ${price(d.reward)}`,done?'이번 주기 완료':`세력 ${C.FACTIONS.find(x=>x.id===d.faction)?.name}`,null,done?null:`contract:${d.id}`,val<d.target*(period+1),'보상 수령');}).join('')}</div>`;}
function market(){return banner('시장 가격은 매분 변합니다. 특정 원료가 막힐 때 교환으로 생산 체인을 이어 가세요.')+
 `<div class="exp-grid">${C.MARKETS.map(d=>mkcard('💱',`${C.names[d.from]} → ${C.names[d.to]}`,`교환 수량 ${fmtValue(d.gain)} 내외 (분당 시세 변동)`,null,{[d.from]:d.cost},`market:${d.id}`,false,'교환')).join('')}</div>`;}
function factions(){const a=ensure();return banner('세력 평판이 3오를 때마다 해당 세력 고유 패시브 보너스가 누적됩니다.')+
 `<div class="exp-grid">${C.FACTIONS.map(f=>mkcard(f.icon,f.name,`평판 보너스: ${Object.entries(f.effect).map(([k,v])=>`${k} +${Math.round(v*100)}% / 등급`).join('')}`,
 `평판 ${a.reputation[f.id]||0} · 등급 ${Math.floor((a.reputation[f.id]||0)/3)}`)).join('')}</div>`;}
function automation(){const a=ensure(),auto=a.auto,cost=C.scaleCost({alloy:20,blueprint:3},auto.levels,1.7);return banner('연구 트리의 「기계 자동화」를 먼저 완료하세요. 자동화 레벨별 기능: 채굴→에테르→선택 제작→자동 탐사→보상 회수→의뢰 수령.')+
 `<div class="exp-auto"><div><b>자동화 Lv.${auto.levels}/6</b> · ${auto.enabled?'가동 중':'정지'}</div>
 <button onclick="ChaosExpansion.action('automation')" ${!a.research.automation?'disabled':''}>자동화 증설 · ${price(cost)}</button>
 <button onclick="ChaosExpansion.action('autoToggle')" ${!auto.levels?'disabled':''}>${auto.enabled?'⏸ 정지':'▶ 가동'} 전환</button>
 <label>자동 제작 선택<select id="expAutoCraft" onchange="ChaosExpansion.chooseCraft(this.value)"><option value="">선택 안 함</option>${C.RECIPES.map(d=>`<option value="${d.id}" ${auto.craft===d.id?'selected':''}>${d.name}</option>`).join('')}</select></label>
 <label>자동 탐사 선택<select id="expAutoExplore" onchange="ChaosExpansion.chooseExpedition(this.value)">${C.EXPEDITIONS.map(d=>`<option value="${d.id}" ${auto.expedition===d.id?'selected':''}>${d.name}</option>`).join('')}</select></label></div>`;}
function ascension(){const a=ensure();return banner('별도 차원 순환: 기존 윤회석 환생과 별개입니다. 60스테이지 및 우주정수 8개·별조각 30개가 필요하며, 전투 스테이지를 1로 되돌리는 대신 영구 능력치를 강화합니다.')+
 `<div class="exp-summary-grid"><div><b>🌠 차원 순환</b><strong>${a.ascensions}회</strong></div><div><b>✨ 초월 인장</b><strong>${fmtValue(a.tokens)}개</strong></div></div>`+
 `<h3 class="exp-subtitle">✨ 초월 인장 투자 · 별자리 성장 (8계열)</h3><div class="exp-grid">${C.CONSTELLATIONS.map(d=>{const lv=a.constellations[d.id]||0;return mkcard(d.icon,d.name,`영구 효과: ${Object.entries(d.effect).map(([k,v])=>`${k} +${v>=1?v:Math.round(v*100)+'%'} / Lv.`).join(' ')}`,`Lv.${lv}/20`,lv>=20?null:{tokens:1+lv+Math.floor(lv/5)},lv>=20?null:`constellation:${d.id}`,false,'인장 투자');}).join('')}</div>`+
 mkcard('☄️','차원 재구성','완료 시 스테이지 1로 복귀 · 영구 공격력 +12%p · 시설 생산 +7%p · 골드 +4%p · 초월 인장 2개',
 '60스테이지 필요',{cosmos:8,star:30},'ascend',state.stage<60,'차원 순환 시작');}
function achievements(){const a=ensure();return banner('플레이 기록이 일정 조건에 도달하면 초월 인장을 얻습니다. 업적은 차원 순환 후에도 보존됩니다.')+
 `<div class="exp-grid">${C.ACHIEVEMENTS.map(d=>{const v=d.kind==='stage'?(state.bestStage||state.stage):d.kind==='kills'?a.progress.kills:d.kind==='buildings'?Object.values(a.buildings).reduce((x,v)=>x+v,0):d.kind==='research'?Object.values(a.research).filter(Boolean).length:d.kind==='relics'?Object.values(a.relics).filter(Boolean).length:a.explores;
 return mkcard('🏆',d.name,`달성 ${fmtValue(v)} / ${d.target} · 인장 ${d.token}개`,a.achievements[d.id]?'수령 완료':`${d.kind}`,null,a.achievements[d.id]?null:`achievement:${d.id}`,v<d.target,'인장 수령');}).join('')}</div>`;}
const TABS=[['overview','요약'],['buildings','생산'],['research','연구'],['relics','유물'],['talents','특성'],['recipes','제작'],['potions','물약'],['expedition','탐사'],['contracts','의뢰'],['market','시장'],['factions','세력'],['automation','자동화'],['ascension','차원 순환'],['achievements','업적']];
const screens={overview,buildings,research,relics,talents,recipes,potions,expedition,contracts,market,factions,automation,ascension,achievements};
function render(){if(!$('expansionContent'))return;
 const m=$('expansionTabs');if(!m.dataset.ready){m.innerHTML=TABS.map(([id,label])=>`<button type="button" data-name="${id}" onclick="ChaosExpansion.show('${id}')">${label}</button>`).join('');m.dataset.ready='1';}
 for(const el of m.querySelectorAll('button'))el.classList.toggle('active',el.dataset.name===tab);
 const q=$('expansionSearch');if(q&&q.value!==query)q.value=query;
 $('expansionContent').innerHTML=screens[tab]();snapshot();}
function snapshot(){const a=ensure(),E=effect(),cap=typeof stageWaveCap==='function'?stageWaveCap():10;
 if($('chaosQuickPanel'))$('chaosQuickPanel').innerHTML=`<div>⚡ <b>빠른 진행</b> <small>${state.stage}층 · ${state.stageWave||1}/${cap} 웨이브</small></div><div>⚔ <b>전투력 +${Math.round(E.atk*100)}%</b><small>시너지 적용</small></div><div>🏭 <b>생산시설 ${Object.values(a.buildings).reduce((x,v)=>x+v,0)}개</b><small>연구 ${Object.values(a.research).filter(Boolean).length}개</small></div><div>✨ <b>인장 ${a.tokens}</b><small>업적·순환 보상</small></div>`;}
function action(code){const a=ensure(),[kind,id]=code.split(':');let ok=false;
 switch(kind){case'building':ok=!!C.buyBuilding(a,state,id);break;
 case'research':ok=C.study(a,state,id);break;case'relic':ok=C.unlockRelic(a,state,id);break;
 case'talent':ok=C.train(a,state,id);break;case'craft':ok=!!C.craft(a,state,id);break;
 case'potion':ok=C.brew(a,state,id);break;case'expedition':ok=C.startExpedition(a,state,id);break;
 case'claimExpedition':ok=C.claimExpedition(a,state);break;case'contract':ok=C.claimContract(a,state,id);break;
 case'market':ok=C.market(a,state,id);break;case'automation':ok=C.automationUpgrade(a,state);break;
 case'autoToggle':if(a.auto.levels){a.auto.enabled=!a.auto.enabled;ok=true;}break;
 case'achievement':ok=C.claimAchievement(a,state,id);break;case'constellation':ok=C.improveConstellation(a,state,id);break;
 case'ascend':if(!confirm('60스테이지 이후의 차원 순환입니다. 현재 전투 스테이지를 1부터 다시 시작하겠습니까?'))return;
 ok=C.ascend(a,state);if(ok){state.bestStage=Math.max(state.bestStage||1,state.stage);state.stage=1;state.stageWave=1;state.field='normal';state.boss=false;state.towerMode=false;state.hp=getMaxHp();state.mp=getMaxMp();spawnEnemy();startLoops();renderAll();}break;
 }
 if(ok){saveGame();flash('성공! 새로운 성장 시스템에 반영되었습니다.');}else flash('해금 조건 또는 보유 재화를 확인하세요.',false);
 render();}
function show(name){if(!screens[name])return;tab=name;query='';render();}
function search(value){query=String(value||'').trim().slice(0,30);render();}
function chooseCraft(id){ensure().auto.craft=C.RECIPES.some(x=>x.id===id)?id:'';saveGame();}
function chooseExpedition(id){ensure().auto.expedition=C.EXPEDITIONS.some(x=>x.id===id)?id:'mine';saveGame();}
window.ChaosExpansion={action,show,search,chooseCraft,chooseExpedition,get data(){return ensure();},render};
window.ChaosSystems={
 modifyDamage(actor,amount){let extra=1;
   if(actor?.affix==='iron')extra*=.75;
   if(actor?.affix==='brittle')extra*=1.25;
   return Math.max(1,Math.floor(amount*extra));
 },
 incomingMultiplier(){const e=effect();return Math.max(.4,1-Math.min(.60,e.armor));}
};
// Player-controlled advanced systems feed into original combat equations.
const previousBaseDamage=baseDamage; baseDamage=function(){return Math.max(1,Math.floor(previousBaseDamage()*(1+effect().atk)));};
const previousAttackInterval=attackInterval;attackInterval=function(){return Math.max(145,Math.floor(previousAttackInterval()/(1+effect().speed)));};
const previousGetMaxHp=getMaxHp;getMaxHp=function(){return Math.floor(previousGetMaxHp()*(1+effect().hp));};
const prevReward=rebirthRewardBonus;rebirthRewardBonus=function(){return prevReward()+effect().gold;};
// Affixes are real combat modifiers and are visible through the arena HUD.
const affixes=[{id:'iron',name:'강철 장갑',effect:a=>{a.maxShield+=Math.floor(a.maxHp*.28);a.shield+=Math.floor(a.maxHp*.28);}},
 {id:'swift',name:'초고속',effect:a=>{a.speed*=1.42;}},{id:'berserk',name:'광폭화',effect:a=>{a.atk*=1.35;a.speed*=1.2;}},
 {id:'brittle',name:'취약핵',effect:a=>{a.hp=Math.ceil(a.hp*.82);a.maxHp=Math.ceil(a.maxHp*.82);}},
 {id:'ancient',name:'고대 각성',effect:a=>{a.hp=Math.ceil(a.hp*1.3);a.maxHp=Math.ceil(a.maxHp*1.3);}}];
window.ChaosHorde.on((type,data)=>{
 const a=ensure();
 if(type==='death'){C.recordKill(a,state,data.actor);const heal=effect().regen;if(heal>0)state.hp=Math.min(getMaxHp(),state.hp+heal*.35);}
 if(type==='wave'){
  if(a._lastWaveSeq===data.actors[0]?.id)return;
  const previous=a._lastWaveSeq;
  a._lastWaveSeq=data.actors[0]?.id;
  if(previous)C.recordWave(a,state);
  if(state.stage>=15){
   const rate=state.stage>=45?.50:.22;
   for(const actor of data.actors){if(Math.random()>rate||actor.boss)continue;
    const affix=affixes[Math.floor(Math.random()*affixes.length)];actor.affix=affix.id;actor.affixName=affix.name;affix.effect(actor);
   }
  }
  if(previous){saveGame();snapshot();}
 }
});
// Original prestiges create a new base state. Preserve all advanced progress.
const originalPrestige=prestige;
prestige=function(){const a=ensure(),counter=state.rebirthCount;originalPrestige();if(state.rebirthCount!==counter){state.advanced=a;advanced=a;saveGame();render();}};
// Restore elapsed production at most 2 hours; no exploit through clock travel.
ensure();const now=Date.now(),elapsed=Math.max(0,Math.min(7200000,now-advanced.lastTick));
if(elapsed>=2000){C.tick(advanced,state,elapsed/1000,{now});C.claimExpedition(advanced,state,now);}
advanced.lastTick=now;saveGame();render();
setInterval(()=>{
 try{const a=ensure(),now=Date.now(),elapsed=Math.min(60000,Math.max(0,now-a.lastTick));
  if(elapsed>=2000){C.tick(a,state,elapsed/1000,{now});a.lastTick=now;
   if(effect().regen>0 && state.hp>0)state.hp=Math.min(getMaxHp(),state.hp+effect().regen*elapsed/1000);
   saveGame();if(tab==='overview'||tab==='expedition'||tab==='potions'||tab==='automation')render();else snapshot();
  }
 }catch(e){console.error('고급 시스템 갱신 오류',e);}
},2000);
})();
