/* CHAOS EDEN: EXPANSION CORE — deterministic, browser/Node compatible economy. */
(function(root){
'use strict';
const RES=[
 ['ore','철광석','⛏️'],['ether','에테르','🫧'],['ember','홍염결정','🔥'],['frost','빙정','❄️'],
 ['storm','폭풍전하','⚡'],['void','공허분진','🌌'],['chrono','시간모래','⌛'],['star','별조각','✨'],
 ['blueprint','설계도','📜'],['relic','유물파편','🗿'],['memory','기억결정','🧠'],['alloy','성운합금','🔩'],
 ['sigil','봉인각인','🔯'],['catalyst','연금촉매','🧪'],['abyss','심연핵','🕳️'],['cosmos','우주정수','☄️']
].map(([id,name,icon])=>({id,name,icon}));
const BLD=[
 ['mine','광맥 채굴기','⛏️',1,{gold:30},{ore:3}],
 ['pump','에테르 집수기','🫧',1,{gold:75,ore:12},{ether:2}],
 ['kiln','홍염 제련로','🔥',5,{ore:35,ether:10},{ore:-2,ember:1}],
 ['frost','빙하 응축탑','❄️',8,{ore:55,ether:25},{ether:-2,frost:1}],
 ['coil','뇌전 발전기','⚡',10,{ore:80,ember:12},{ember:-1,storm:2}],
 ['rift','공허 채굴정','🕳️',15,{ether:100,storm:30},{ether:-2,void:1}],
 ['chronicle','시간 관측소','⌛',20,{void:45,storm:70},{void:-1,chrono:1}],
 ['observatory','천체 망원경','🔭',25,{chrono:40,alloy:25},{chrono:-1,star:1}],
 ['forge','성운 대장간','🔩',16,{ore:180,ember:40},{ore:-8,ember:-2,alloy:2}],
 ['archive','기억 기록원','🧠',30,{blueprint:5,chrono:80},{chrono:-1,memory:1}],
 ['inscriber','각인 공방','🔯',35,{void:75,relic:50},{void:-2,relic:-1,sigil:1}],
 ['laboratory','연금 실험실','🧪',18,{ether:120,ore:100},{ether:-4,ore:-3,catalyst:1}],
 ['abyssal','심연 반응로','🌑',45,{star:35,sigil:25},{void:-2,star:-1,abyss:1}],
 ['cosmic','우주 합성기','☄️',55,{abyss:15,memory:30},{abyss:-1,star:-1,cosmos:1}]
].map(([id,name,icon,stage,cost,flow])=>({id,name,icon,stage,cost,flow}));
const RESEARCH=[
 ['ores','광석 선별',1,null,{ore:20,ether:5},{prod:.12}],
 ['blades','신형 무장',2,'ores',{ore:45,gold:120},{atk:.09}],
 ['dynamos','동력 동기화',4,'ores',{ether:25,ore:45},{speed:.07}],
 ['engines','마력 엔진',6,'dynamos',{storm:12,ember:12},{prod:.15}],
 ['plating','성운 장갑',7,'blades',{alloy:10,ore:75},{hp:.10}],
 ['alchemy','연금학',10,'ores',{catalyst:10,ether:80},{drop:.16}],
 ['mercantilism','비전 상업',10,'dynamos',{gold:950,ore:100},{gold:.18}],
 ['starlight','별빛 구동',15,'engines',{void:15,storm:30},{atk:.12}],
 ['temporal','시간 재편',20,'starlight',{chrono:16,void:45},{speed:.12}],
 ['glyphs','정교한 각인',18,'alchemy',{sigil:5,alloy:24},{atk:.13}],
 ['meditation','고대 정신수련',18,'plating',{relic:22,ether:150},{regen:2}],
 ['harvest','다중 채굴망',22,'engines',{alloy:80,ore:250},{prod:.25}],
 ['protection','심연 저항',28,'plating',{void:90,sigil:12},{armor:.09}],
 ['automation','기계 자동화',12,'engines',{alloy:35,blueprint:4},{auto:1}],
 ['tradeAI','거래 알고리즘',30,'automation',{blueprint:12,gold:3500},{gold:.22}],
 ['astromancy','점성의 비밀',32,'temporal',{star:25,chrono:35},{drop:.25}],
 ['singularity','특이점 연구',40,'astromancy',{abyss:12,cosmos:4},{atk:.28}],
 ['deepcraft','유물 재구성',40,'glyphs',{relic:100,memory:28},{prod:.22}],
 ['limitless','무한 연산',50,'tradeAI',{cosmos:12,memory:45},{speed:.2}],
 ['apotheosis','초월 개화',60,'singularity',{cosmos:30,abyss:20},{atk:.45}]
].map(([id,name,stage,prereq,cost,effect])=>({id,name,stage,prereq,cost,effect}));
const RELICS=[
 ['flame1','불타는 심장','🔥','flame',5,{ember:12,relic:5},{atk:.10}],
 ['flame2','잿빛 왕관','👑','flame',12,{ember:55,relic:18},{atk:.15}],
 ['flame3','용의 화로','🐉','flame',26,{ember:160,alloy:40},{drop:.20}],
 ['void1','검은 프리즘','🔮','void',8,{void:8,relic:10},{atk:.11}],
 ['void2','허무의 반지','💍','void',20,{void:55,sigil:7},{speed:.11}],
 ['void3','무저갱의 눈','👁️','void',40,{void:200,abyss:8},{atk:.24}],
 ['chrono1','시계추','🕰️','chrono',10,{frost:25,relic:10},{speed:.08}],
 ['chrono2','영원의 모래','⌛','chrono',23,{chrono:25,memory:6},{speed:.12}],
 ['chrono3','멈춘 태양','🌞','chrono',46,{chrono:140,star:35},{atk:.23}],
 ['star1','유성의 파편','🌠','star',6,{storm:30,relic:8},{gold:.20}],
 ['star2','은하의 나침반','🧭','star',24,{star:18,alloy:50},{drop:.21}],
 ['star3','창세의 잔광','💫','star',55,{cosmos:8,star:120},{atk:.34}],
 ['earth1','거인의 피','🩸','earth',5,{ore:50,relic:5},{hp:.12}],
 ['earth2','성채의 방패','🛡️','earth',15,{alloy:20,frost:40},{armor:.10}],
 ['earth3','대지의 맹세','🌿','earth',34,{alloy:120,memory:10},{regen:4}],
 ['storm1','천둥의 송곳니','⚡','storm',10,{storm:20,relic:8},{speed:.10}],
 ['storm2','폭풍의 고리','🌀','storm',28,{storm:100,sigil:12},{atk:.17}],
 ['storm3','뇌신의 왕좌','🌩️','storm',48,{storm:300,cosmos:4},{speed:.22}]
].map(([id,name,icon,set,stage,cost,effect])=>({id,name,icon,set,stage,cost,effect}));
const TALENTS=[
 ['atk1','힘의 기원',1,{ore:40},{atk:.08}],['atk2','전투 기계',8,{ember:30},{atk:.11}],
 ['atk3','난폭한 성장',20,{void:55},{atk:.16}],['atk4','무한의 칼날',40,{star:35},{atk:.25}],
 ['hp1','불굴의 생명',2,{ore:45},{hp:.10}],['hp2','불사의 맹세',16,{alloy:22},{hp:.16}],
 ['hp3','행성의 심장',32,{memory:15},{hp:.22}],['res1','수호의 의지',8,{frost:25},{armor:.07}],
 ['res2','완전 방호',30,{sigil:14},{armor:.12}],['spd1','잔상의 사냥꾼',7,{storm:30},{speed:.09}],
 ['spd2','신속한 술식',23,{chrono:20},{speed:.15}],['drp1','자원 감별사',4,{ether:20},{drop:.15}],
 ['drp2','행운의 수호자',24,{star:12},{drop:.24}],['eco1','고대의 계약',6,{gold:330},{gold:.20}],
 ['eco2','금빛 항로',28,{blueprint:12},{gold:.30}],['prd1','산업의 조상',10,{alloy:10},{prod:.15}],
 ['prd2','성운의 수확자',35,{catalyst:30},{prod:.23}],['life','생명 순환',35,{memory:24},{regen:3}]
].map(([id,name,stage,cost,effect])=>({id,name,stage,cost,effect}));
const RECIPES=[
 ['melt','광석 용해',1,{ore:18},{gold:85,ember:2}],
 ['condense','에테르 응축',1,{ore:14},{ether:12}],
 ['energize','전하 추출',8,{ember:6,ether:12},{storm:8}],
 ['crystallize','빙정 형성',9,{ether:20},{frost:8}],
 ['alloy','합금 주조',12,{ore:45,ember:7},{alloy:7}],
 ['catalyst','연금 합성',15,{ether:35,frost:10},{catalyst:6}],
 ['blueprint','도면 복원',16,{ore:110,ether:80},{blueprint:2}],
 ['relic','유물 조립',18,{alloy:12,void:8},{relic:10}],
 ['void','공허 농축',20,{storm:30,ether:90},{void:14}],
 ['chronos','시계 재조립',24,{void:15,storm:20},{chrono:9}],
 ['memory','기억 증류',28,{chrono:10,ether:50},{memory:7}],
 ['sigil','봉인 각인',32,{relic:18,void:18},{sigil:5}],
 ['stardust','별가루 수집',36,{chrono:15,memory:10},{star:7}],
 ['abyss','심연 압축',45,{sigil:9,star:15},{abyss:4}],
 ['cosmos','우주 합성',55,{abyss:8,memory:15},{cosmos:3}],
 ['core','초월핵 제작',65,{cosmos:6,star:35},{bossMedal:10,blueprint:8}]
].map(([id,name,stage,cost,out])=>({id,name,stage,cost,out}));
const EXPEDITIONS=[
 ['mine','옛 광맥',1,24,{ore:45,ether:16}],['ruins','고대 폐허',5,45,{relic:13,blueprint:2}],
 ['glacier','영원의 설원',10,65,{frost:32,ether:30}],['storm','뇌운의 성채',13,90,{storm:48,ember:20}],
 ['void','갈라진 심연',20,120,{void:45,relic:30}],['clock','정지된 시간의 탑',25,150,{chrono:45,memory:8}],
 ['stellar','유성 지대',32,180,{star:35,blueprint:10}],['abyss','심연 우물',43,240,{abyss:14,sigil:24}],
 ['origin','창세 유적',60,360,{cosmos:12,memory:55}]
].map(([id,name,stage,seconds,reward])=>({id,name,stage,seconds,reward}));
const POTIONS=[
 ['rage','광전사의 영약',6,{ember:8,ether:15},90,{atk:.3}],
 ['haste','가속 비약',8,{storm:10,ether:16},90,{speed:.3}],
 ['fortune','황금 증폭제',10,{ore:25,catalyst:3},120,{gold:.6}],
 ['survival','대지의 맥동',10,{frost:10,alloy:3},120,{regen:5}],
 ['bounty','탐험가의 행운',16,{catalyst:6,void:6},130,{drop:.45}],
 ['industry','생산 과부하',22,{catalyst:10,alloy:9},180,{prod:.6}],
 ['guardian','수호자의 방벽',25,{sigil:4,frost:15},100,{armor:.30}],
 ['celestial','천체 각성',50,{cosmos:2,star:10},100,{atk:.7,speed:.3}]
].map(([id,name,stage,cost,seconds,effect])=>({id,name,stage,cost,seconds,effect}));
const MARKETS=[
 ['ore','ether',20,15],['ether','ore',20,20],['ore','gold',30,140],['ember','storm',12,8],
 ['frost','chrono',28,7],['storm','void',35,8],['alloy','relic',12,8],['relic','blueprint',20,2],
 ['chrono','star',20,7],['memory','sigil',12,5],['abyss','cosmos',6,2],['gold','ore',500,60]
].map(([from,to,cost,gain],i)=>({id:'trade'+i,from,to,cost,gain}));
const CONTRACTS=[
 ['hunter','추적자의 의뢰','kill',15,{gold:550,ore:45},'hunters'],
 ['scout','정찰대 지원','wave',5,{ether:70,blueprint:1},'hunters'],
 ['forge','대장장이의 주문','kill',30,{relic:18,ember:15},'forgers'],
 ['merchant','상단 운송 계약','wave',10,{gold:1800,alloy:10},'merchants'],
 ['hunt2','정예 섬멸 명령','kill',60,{void:30,memory:5},'hunters'],
 ['forge2','성운 재건','wave',20,{alloy:36,catalyst:9},'forgers'],
 ['merc2','장거리 교역','kill',100,{blueprint:10,star:5},'merchants'],
 ['abyss','심연 정화','wave',40,{abyss:8,sigil:12},'hunters']
].map(([id,name,kind,target,reward,faction])=>({id,name,kind,target,reward,faction}));
const ACHIEVEMENTS=[
 ['s10','초보 졸업','stage',10,2],['s25','새로운 차원','stage',25,4],['s50','영원한 탐구','stage',50,8],['s100','백의 전설','stage',100,16],
 ['k50','첫 학살자','kills',50,2],['k300','전장의 폭풍','kills',300,5],['k1500','혼돈의 군주','kills',1500,12],
 ['b5','공장의 새벽','buildings',5,2],['b50','산업 제국','buildings',50,7],
 ['r5','기술 선구자','research',5,2],['r15','지식의 제국','research',15,6],
 ['a3','유물 수집가','relics',3,2],['a12','성물 군주','relics',12,9],
 ['e3','개척자','explore',3,3],['e15','탐험왕','explore',15,8]
].map(([id,name,kind,target,token])=>({id,name,kind,target,token}));
const FACTIONS=[['hunters','별빛 사냥단','⚔️',{atk:.02}],['forgers','아르카나 공방','🔩',{prod:.03}],['merchants','황금 상단','💰',{gold:.03}]].map(([id,name,icon,effect])=>({id,name,icon,effect}));
const CONSTELLATIONS=[
 ['war','전쟁의 별자리','⚔️',{atk:.025}],['speed','찰나의 별자리','⚡',{speed:.02}],
 ['heart','생명의 별자리','❤️',{hp:.035}],['shield','수호의 별자리','🛡️',{armor:.015}],
 ['wealth','황금의 별자리','💰',{gold:.035}],['industry','산업의 별자리','🏭',{prod:.035}],
 ['fate','운명의 별자리','🎲',{drop:.035}],['sun','회복의 별자리','☀️',{regen:.4}]
].map(([id,name,icon,effect])=>({id,name,icon,effect}));
const names=Object.fromEntries(RES.map(r=>[r.id,r.name]));
Object.assign(names,{gold:'골드',manaCrystal:'마나수정',soul:'영혼석',dust:'유물가루',rune:'룬조각',bossMedal:'보스메달',tokens:'초월 인장'});
const ids=RES.map(r=>r.id);
const zero=()=>Object.fromEntries(ids.map(k=>[k,0]));
const num=(x)=>Number.isFinite(Number(x))?Math.max(0,Number(x)):0;
const cap=(x,a,b)=>Math.max(a,Math.min(b,x));
const clone=(o)=>JSON.parse(JSON.stringify(o));
function create(){return {version:2,res:zero(),buildings:{},research:{},relics:{},talents:{},potions:{},expedition:null,explores:0,
  progress:{kills:0,waves:0},contracts:{},reputation:{hunters:0,forgers:0,merchants:0},auto:{owned:0,enabled:false,craft:'',expedition:'mine',levels:0},
  achievements:{},constellations:{},tokens:0,ascensions:0,marketTick:0,lastTick:Date.now(),stats:{earned:0,spent:0},eventLog:[]};}
function normalize(raw){const a=raw&&typeof raw==='object'&&raw.version===2?raw:create();const fresh=create();
 for(const k of Object.keys(fresh))if(a[k]===undefined||a[k]===null)a[k]=fresh[k];
 for(const k of ids)a.res[k]=num(a.res[k]);
 for(const k of ['buildings','research','relics','talents','potions','contracts','achievements','reputation','constellations']){if(!a[k]||typeof a[k]!=='object')a[k]={};}
 for(const k of ['hunters','forgers','merchants'])a.reputation[k]=num(a.reputation[k]);
 a.tokens=num(a.tokens);a.ascensions=num(a.ascensions);a.progress.kills=num(a.progress.kills);a.progress.waves=num(a.progress.waves);
 if(!a.auto||typeof a.auto!=='object')a.auto=fresh.auto;
 a.auto.levels=num(a.auto.levels); a.auto.owned=num(a.auto.owned);a.auto.enabled=!!a.auto.enabled;
 a.lastTick=Number.isFinite(a.lastTick)?a.lastTick:Date.now();return a;
}
function amount(a,base,id){return id==='tokens'?num(a.tokens):id in a.res?num(a.res[id]):num(base[id]);}
function award(a,base,items,mult=1){for(const [id,n] of Object.entries(items)){if(!Number.isFinite(n)||n<0)continue;const v=Math.max(0,Math.floor(n*mult));
 if(id==='tokens')a.tokens+=v;else if(id in a.res)a.res[id]+=v;else base[id]=num(base[id])+v;
 a.stats.earned+=v;}}
function scaleCost(cost,n,rate=1.32){return Object.fromEntries(Object.entries(cost).map(([k,v])=>[k,Math.max(1,Math.ceil(v*Math.pow(rate,Math.max(0,n))))]));}
function afford(a,base,cost){return Object.entries(cost).every(([k,v])=>amount(a,base,k)>=v);}
function pay(a,base,cost){if(!afford(a,base,cost))return false;for(const [k,v] of Object.entries(cost)){
 if(k==='tokens')a.tokens-=v;else if(k in a.res)a.res[k]-=v;else base[k]=Math.max(0,num(base[k])-v);a.stats.spent+=v;
 }return true;}
function buyBuilding(a,base,id,count=1){const d=BLD.find(x=>x.id===id);if(!d||base.stage<d.stage)return false;
 let changed=0;for(let i=0;i<Math.min(100,count);i++){const lv=num(a.buildings[id]);if(lv>=500||!pay(a,base,scaleCost(d.cost,lv,1.18)))break;a.buildings[id]=lv+1;changed++;}return changed;}
function study(a,base,id){const r=RESEARCH.find(x=>x.id===id);if(!r||base.stage<r.stage||a.research[id]||(r.prereq&&!a.research[r.prereq]))return false;
 if(!pay(a,base,r.cost))return false;a.research[id]=true;return true;}
function unlockRelic(a,base,id){const r=RELICS.find(x=>x.id===id);if(!r||base.stage<r.stage||a.relics[id]||!pay(a,base,r.cost))return false;
 a.relics[id]=true;return true;}
function train(a,base,id){const t=TALENTS.find(x=>x.id===id);if(!t||base.stage<t.stage||a.talents[id]||!pay(a,base,t.cost))return false;
 a.talents[id]=true;return true;}
function craft(a,base,id,quantity=1){const recipe=RECIPES.find(x=>x.id===id);if(!recipe||base.stage<recipe.stage)return 0;let success=0;
 for(let i=0;i<Math.min(50,quantity);i++){if(!pay(a,base,recipe.cost))break;award(a,base,recipe.out);success++;}return success;}
function brew(a,base,id,now=Date.now()){const p=POTIONS.find(x=>x.id===id);if(!p||base.stage<p.stage||!pay(a,base,p.cost))return false;
 a.potions[id]=Math.max(now,num(a.potions[id]))+p.seconds*1000;return true;}
function startExpedition(a,base,id,now=Date.now()){const e=EXPEDITIONS.find(x=>x.id===id);if(!e||base.stage<e.stage||a.expedition)return false;
 a.expedition={id,ends:now+e.seconds*1000};return true;}
function claimExpedition(a,base,now=Date.now()){const active=a.expedition;if(!active||active.ends>now)return false;const e=EXPEDITIONS.find(x=>x.id===active.id);if(!e){a.expedition=null;return false;}
 award(a,base,e.reward,1+a.ascensions*.08);a.expedition=null;a.explores++;return true;}
function recordKill(a,base,actor){a.progress.kills++;const stage=num(base.stage)||1;const factor=1+stats(a,base).drop;
 award(a,base,{ore:1+Math.floor(Math.random()*2),ether:1},factor);
 if(stage>=5&&Math.random()<.22*factor)award(a,base,{ember:1});
 if(stage>=8&&Math.random()<.18*factor)award(a,base,{frost:1,storm:1});
 if(stage>=12&&Math.random()<.22*factor)award(a,base,{blueprint:1});
 if(stage>=18&&Math.random()<.27*factor)award(a,base,{relic:2,void:1});
 if(stage>=25&&Math.random()<.18*factor)award(a,base,{chrono:1,memory:1});
 if(stage>=35&&Math.random()<.15*factor)award(a,base,{star:1});
 if(actor?.boss){award(a,base,{relic:10,blueprint:3,star:Math.max(1,Math.floor(stage/12))});}
}
function recordWave(a,base){a.progress.waves++;const s=stats(a,base),boost=1+s.gold;
 award(a,base,{gold:Math.round((40+base.stage*14)*boost),ore:Math.max(2,Math.floor(base.stage/3))});}
function claimContract(a,base,id){const d=CONTRACTS.find(x=>x.id===id);if(!d||base.stage< (d.id==='abyss'?40:1))return false;
 const period=Math.floor((a.progress.waves||0)/40),key=id+':'+period;if(a.contracts[key])return false;
 const progress=d.kind==='kill'?a.progress.kills:a.progress.waves;const needed=d.target*(period+1);
 if(progress<needed)return false;
 award(a,base,d.reward,1+period*.45);a.reputation[d.faction]+=1;
 a.contracts[key]=true;return true;}
function market(a,base,id){const m=MARKETS.find(x=>x.id===id);if(!m)return false;
 const cycle=Math.floor(Date.now()/60000);const variation=0.8+(Math.abs((cycle*13+id.length*7)%7)/10);const v=Math.max(1,Math.floor(m.gain*variation));
 if(!pay(a,base,{[m.from]:m.cost}))return false;award(a,base,{[m.to]:v});return true;}
function automationUpgrade(a,base){if(!a.research.automation||a.auto.levels>=6||!pay(a,base,scaleCost({alloy:20,blueprint:3},a.auto.levels,1.7)))return false;
 a.auto.levels++;a.auto.owned=1;return true;}
function improveConstellation(a,base,id){const node=CONSTELLATIONS.find(x=>x.id===id);if(!node)return false;
 const lv=num(a.constellations[id]);if(lv>=20)return false;const cost=1+lv+Math.floor(lv/5);
 if(!pay(a,base,{tokens:cost}))return false;a.constellations[id]=lv+1;return true;}
function applyAutomations(a,base){if(!a.auto.owned||!a.auto.enabled)return;
 if(a.auto.levels>=1)buyBuilding(a,base,'mine',1);
 if(a.auto.levels>=2)buyBuilding(a,base,'pump',1);
 if(a.auto.levels>=3&&a.auto.craft)craft(a,base,a.auto.craft,1);
 if(a.auto.levels>=4&&!a.expedition)startExpedition(a,base,a.auto.expedition||'mine');
 if(a.auto.levels>=5)claimExpedition(a,base);
 if(a.auto.levels>=6)for(const c of CONTRACTS)claimContract(a,base,c.id);
}
function stats(a,base,now=Date.now()){const s={atk:0,speed:0,hp:0,armor:0,drop:0,gold:0,prod:0,regen:0};
 const add=eff=>{if(!eff)return;for(const [k,v] of Object.entries(eff))if(k in s)s[k]+=v;};
 for(const d of RESEARCH)if(a.research[d.id])add(d.effect);
 for(const d of RELICS)if(a.relics[d.id])add(d.effect);
 for(const d of TALENTS)if(a.talents[d.id])add(d.effect);
 for(const d of CONSTELLATIONS){const lv=num(a.constellations[d.id]);if(lv)for(const [k,v] of Object.entries(d.effect))s[k]+=v*lv;}
 for(const d of POTIONS)if(num(a.potions[d.id])>now)add(d.effect);
 for(const f of FACTIONS){const rank=Math.floor(num(a.reputation[f.id])/3);for(const [k,v] of Object.entries(f.effect))s[k]+=rank*v;}
 for(const set of ['flame','void','chrono','star','earth','storm']){const count=RELICS.filter(r=>r.set===set&&a.relics[r.id]).length;
 if(count>=2){if(set==='flame'||set==='void')s.atk+=.13;if(set==='chrono'||set==='storm')s.speed+=.12;if(set==='earth')s.hp+=.18;if(set==='star')s.drop+=.18;}
 if(count===3){s.atk+=.18;s.prod+=.15;}}
 s.atk+=a.ascensions*.12;s.prod+=a.ascensions*.07;s.gold+=a.ascensions*.04;
 return s;}
function tick(a,base,seconds,opts={}){const steps=cap(Math.floor(seconds/2),0,3600);const effect=stats(a,base,opts.now||Date.now());
 for(let i=0;i<steps;i++){
  for(const d of BLD){const n=num(a.buildings[d.id]);if(!n)continue;
   const mult=(1+effect.prod)*n*2;
   const requirements=Object.fromEntries(Object.entries(d.flow).filter(([,v])=>v<0).map(([k,v])=>[k,Math.ceil(-v*mult)]));
   if(!afford(a,base,requirements))continue;
   pay(a,base,requirements);
   const outputs=Object.fromEntries(Object.entries(d.flow).filter(([,v])=>v>0).map(([k,v])=>[k,v]));
   award(a,base,outputs,mult);
  }
  if(i%4===0)applyAutomations(a,base);
 }
}
function eligibleAchievement(a,base,d){switch(d.kind){case'stage':return num(base.bestStage||base.stage)>=d.target;
 case'kills':return a.progress.kills>=d.target;case'buildings':return Object.values(a.buildings).reduce((x,v)=>x+num(v),0)>=d.target;
 case'research':return Object.keys(a.research).filter(k=>a.research[k]).length>=d.target;
 case'relics':return Object.keys(a.relics).filter(k=>a.relics[k]).length>=d.target;
 case'explore':return num(a.explores)>=d.target;default:return false;}}
function claimAchievement(a,base,id){const d=ACHIEVEMENTS.find(x=>x.id===id);if(!d||a.achievements[id]||!eligibleAchievement(a,base,d))return false;
 a.achievements[id]=true;a.tokens+=d.token;return true;}
function ascend(a,base){if(base.stage<60||a.res.cosmos<8||a.res.star<30)return false;
 if(!pay(a,base,{cosmos:8,star:30}))return false;a.ascensions++;a.tokens+=2;return true;}
const api={RES,BLD,RESEARCH,RELICS,TALENTS,RECIPES,EXPEDITIONS,POTIONS,MARKETS,CONTRACTS,ACHIEVEMENTS,FACTIONS,CONSTELLATIONS,names,
 create,normalize,amount,award,scaleCost,afford,pay,buyBuilding,study,unlockRelic,train,craft,brew,startExpedition,claimExpedition,
 recordKill,recordWave,claimContract,market,automationUpgrade,improveConstellation,applyAutomations,stats,tick,eligibleAchievement,claimAchievement,ascend};
root.ChaosAdvancedCore=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
