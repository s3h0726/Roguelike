import {RESOURCES,RESOURCE_MAP,RESOURCE_GROUPS,BUILDINGS,BUILDING_MAP,TECHS,TECH_MAP,RECIPES,RECIPE_MAP,ARTIFACTS,ARTIFACT_MAP,MARKET,MISSION_TEMPLATES,MISSION_MAP,EXPEDITIONS,EXPEDITION_MAP,UPGRADES,UPGRADE_MAP,ACHIEVEMENTS,PRESTIGE} from './data.js';
export const SAVE_KEY = 'omega-incremental-universe-v1';
export const MAX_NUMBER=1e290;
const clamp=n=>Number.isFinite(n)?Math.min(MAX_NUMBER,Math.max(0,n)):0;
export const fmt=(n,compact=false)=>{
 if(!Number.isFinite(n))return '—';
 if(n<0)return '-'+fmt(-n,compact);
 if(n<.01&&n>0)return n.toExponential(1);
 if(n<1)return n.toFixed(2);
 if(n<1000)return n<10?n.toFixed(2).replace(/\.00$/,''):n<100?n.toFixed(1).replace(/\.0$/,''):Math.floor(n).toString();
 const suffix=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No'];
 const exp=Math.floor(Math.log10(n)/3);
 if(exp<suffix.length)return (n/(10**(exp*3))).toFixed(compact?1:2).replace(/\.00?$/,'')+suffix[exp];
 return n.toExponential(2).replace('e+','e');
};
export const fmtTime=s=>{s=Math.max(0,Math.ceil(s));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return h?`${h}h ${m}m`:m?`${m}m ${ss}s`:`${ss}s`};
const safeObj=o=>o && typeof o==='object' && !Array.isArray(o)?o:{};
export function makeState(now=Date.now()){
 const res=Object.fromEntries(RESOURCES.map(r=>[r.id,0]));
 Object.assign(res,{ore:90,energy:110,credits:180});
 const buildings=Object.fromEntries(BUILDINGS.map(b=>[b.id,['drill','reactor','exchange'].includes(b.id)?1:0]));
 return {version:1,createdAt:now,lastSavedAt:now,clock:0,played:0,res,buildings,disabled:{},tech:{},artifacts:{},upgrades:{},auto:{autobuy:false,autotrade:false,autoresearch:false,autocraft:false},autoRecipe:'bond',marketReserve:1000,buyCount:1,craftCount:1,missionDone:{},expedition:null,
   achievements:{}, metaUpgrades:{}, ledger:{},runPower:0,totalPower:0, stats:{reboots:0,ascensions:0,collapses:0,eternities:0,missions:0,expeditions:0,pulses:0,artifacts:0,largestRun:0},lastPulse:-999,pulseEnd:0,log:[{at:0,text:'Universe initialized. Construct your first production chain.',kind:'system'}]};
}
export function restoreState(raw,now=Date.now()){
 const s=makeState(now); if(!raw||raw.version!==1)return s;
 for(const [k,v] of Object.entries(s))if(['clock','played','runPower','totalPower','lastPulse','pulseEnd','marketReserve','buyCount','craftCount','lastSavedAt'].includes(k)&&Number.isFinite(raw[k]))s[k]=Math.max(-999,Math.min(1e290,raw[k]));
 s.createdAt=Number.isFinite(raw.createdAt)?raw.createdAt:now;
 s.res=Object.fromEntries(RESOURCES.map(r=>[r.id,clamp(raw.res?.[r.id]??s.res[r.id])]));
 s.buildings=Object.fromEntries(BUILDINGS.map(b=>[b.id,Math.floor(clamp(raw.buildings?.[b.id]??s.buildings[b.id]))]));
 for(const k of ['disabled','tech','artifacts','auto','upgrades','missionDone','achievements','metaUpgrades','ledger','stats'])s[k]={...s[k],...safeObj(raw[k])};
 for(const k of ['missionDone','upgrades','metaUpgrades'])for(const id of Object.keys(s[k]))s[k][id]=Math.floor(clamp(s[k][id]));
 for(const id of Object.keys(s.ledger))s.ledger[id]=clamp(s.ledger[id]);
 for(const k of Object.keys(s.stats))s.stats[k]=clamp(s.stats[k]);
 if(RECIPE_MAP[raw.autoRecipe])s.autoRecipe=raw.autoRecipe;
 if(raw.expedition&&EXPEDITION_MAP[raw.expedition.id]&&Number.isFinite(raw.expedition.endAt))s.expedition={id:raw.expedition.id,endAt:raw.expedition.endAt};
 s.log=Array.isArray(raw.log)?raw.log.slice(-30).filter(x=>typeof x?.text==='string'):s.log;
 s.lastSavedAt=Number.isFinite(raw.lastSavedAt)?Math.max(0,Math.min(now,raw.lastSavedAt)):now;
 return s;
}
export function hasCost(res,cost,mult=1){return Object.entries(cost).every(([id,n])=>(res[id]||0)+1e-8>=n*mult)}
export const multiplyCost=(cost,mult)=>Object.fromEntries(Object.entries(cost).map(([id,n])=>[id,clamp(n*mult)]));
export function payCost(res,cost,mult=1){if(!hasCost(res,cost,mult))return false;for(const [id,n] of Object.entries(cost))res[id]=clamp(res[id]-n*mult);return true}
const tags={fundamental:'Fundamental',industrial:'Industrial',advanced:'Advanced',cosmic:'Cosmic'};
const WEIGHTS={ore:1,energy:.6,credits:1.3,alloy:7,crystal:9,plasma:12,data:9,nanites:16,quantum:28,antimatter:45,stardust:50,nebula:70,chronons:85,entropy:110,darkMatter:135,void:200,aether:220,light:210,souls:240,runes:330,fractals:460,reality:900};
export const BUILDING_COUNT=BUILDINGS.length;
export class Engine {
 constructor(state=makeState()){this.s=restoreState(state,state.lastSavedAt??Date.now());this._autoT=0;}
 addLog(text,kind='info'){this.s.log.unshift({at:this.s.clock,text,kind});this.s.log=this.s.log.slice(0,30)}
 add(id,n,record=false){if(!RESOURCE_MAP[id]||n<=0||!Number.isFinite(n))return;this.s.res[id]=clamp(this.s.res[id]+n);if(record){this.s.ledger[id]=clamp((this.s.ledger[id]||0)+n);const score=(WEIGHTS[id]||0)*n;this.s.runPower=clamp(this.s.runPower+score);this.s.totalPower=clamp(this.s.totalPower+score);}}
 get countTech(){return Object.values(this.s.tech).filter(Boolean).length}
 get artifactsCount(){return Object.values(this.s.artifacts).filter(Boolean).length}
 get era(){return 1+Math.floor(this.countTech/5)}
 canBuild(id){const b=BUILDING_MAP[id];return !!b&&(!b.unlock||!!this.s.tech[b.unlock])}
 getBuildCost(id){const b=BUILDING_MAP[id];if(!b)return {};const lvl=this.s.buildings[id]||0;return multiplyCost(b.cost,Math.pow(1.32,Math.min(750,lvl)));}
 getUpgradeCost(id){const u=UPGRADE_MAP[id];return u?multiplyCost(u.cost,Math.pow(u.scale,Math.min(750,this.s.upgrades[id]||0))):{};}
 getBonuses(){const r={global:1,ore:1,energy:1,credits:1,industrial:1,advanced:1,cosmic:1};
  for(const t of TECHS)if(this.s.tech[t.id])for(const [key,v] of Object.entries(t.effects||{}))r[key]=(r[key]||1)*v;
  for(const a of ARTIFACTS)if(this.s.artifacts[a.id])for(const [key,v] of Object.entries(a.effects))r[key]=(r[key]||1)*v;
  r.global*=1+(this.s.res.cores||0)*.08;
  r.global*=1+(this.s.res.essence||0)*.32;
  r.global*=1+(this.s.res.singularities||0)*2;
  r.global*=1+(this.s.res.eternity||0)*7;
  r.global*=1+(this.s.upgrades.scanner||0)*.1;
  r.global*=1+(this.s.upgrades.synthesis||0)*.12;
  r.global*=Math.pow(1.16,this.s.metaUpgrades.coreAmp||0);
  r.global*=Math.pow(1.3,this.s.metaUpgrades.essenceAmp||0);
  r.global*=Math.pow(1.75,this.s.metaUpgrades.singularityAmp||0);
  r.global*=Math.pow(2.6,this.s.metaUpgrades.eternityAmp||0);
  if(this.s.clock<this.s.pulseEnd)r.global*=3;
  return r;
 }
 buildingMultiplier(b,bonuses){const id=Object.keys(b.outputs)[0],res=RESOURCE_MAP[id];return clamp(bonuses.global*(bonuses[id]||1)*(bonuses[res?.group]||1));}
 buildingPerSecond(b,bonuses=this.getBonuses()){let lvl=this.s.buildings[b.id]||0;if(!lvl||this.s.disabled[b.id])return {inputs:{},outputs:{}};
  const scale=b.base*lvl*Math.pow(1.11,Math.min(120,lvl-1))*this.buildingMultiplier(b,bonuses);
  return {inputs:multiplyCost(b.inputs,scale),outputs:multiplyCost(b.outputs,scale)};
 }
 rates(){const results={};const bonuses=this.getBonuses();for(const b of BUILDINGS){const p=this.buildingPerSecond(b,bonuses);for(const [k,v] of Object.entries(p.outputs))results[k]=(results[k]||0)+v;for(const [k,v] of Object.entries(p.inputs))results[k]=(results[k]||0)-v;}return results;}
 buyBuilding(id,count=1){if(!this.canBuild(id))return {ok:false,message:'Research is required.'};let n=0;const limit=count==='max'?1000:Math.min(1000,Math.max(1,Math.floor(count)));
  for(let i=0;i<limit;i++){const price=this.getBuildCost(id);if(!payCost(this.s.res,price))break;this.s.buildings[id]=(this.s.buildings[id]||0)+1;n++;}
  if(n)this.addLog(`Built ${n} × ${BUILDING_MAP[id].name}.`,'purchase');return {ok:n>0,count:n,message:n?`${n} purchased`:'Insufficient resources'};}
 toggleBuilding(id){if(!BUILDING_MAP[id]||!this.canBuild(id))return false;this.s.disabled[id]=!this.s.disabled[id];return true}
 research(id){const t=TECH_MAP[id];if(!t||this.s.tech[id]||!t.pre.every(k=>this.s.tech[k])||!payCost(this.s.res,t.cost))return false;this.s.tech[id]=true;this.addLog(`Technology unlocked: ${t.name}.`,'research');return true}
 craft(id,count=1){const r=RECIPE_MAP[id];if(!r||r.tech&&!this.s.tech[r.tech])return 0;let n=0;const lim=count==='max'?250:Math.max(1,Math.min(250,Math.floor(count)));for(let i=0;i<lim;i++){if(!payCost(this.s.res,r.input))break;for(const [key,v] of Object.entries(r.output))this.add(key,v,true);n++;}if(n)this.addLog(`Fabricated ${n} × ${r.name}.`,'craft');return n}
 forge(id){const a=ARTIFACT_MAP[id];if(!a||this.s.artifacts[id]||!payCost(this.s.res,a.cost))return false;this.s.artifacts[id]=true;this.s.stats.artifacts++;this.addLog(`Artifact forged: ${a.name}!`,'rare');return true}
 upgrade(id){const u=UPGRADE_MAP[id];if(!u||(this.s.upgrades[id]||0)>=u.max)return false;if(!payCost(this.s.res,this.getUpgradeCost(id)))return false;this.s.upgrades[id]=(this.s.upgrades[id]||0)+1;this.addLog(`${u.name} upgraded to Lv.${this.s.upgrades[id]}.`,'purchase');return true}
 marketPrice(id,side='sell'){const p=MARKET.find(m=>m.id===id);if(!p)return 0;const cycle=1+0.16*Math.sin(this.s.clock/140+MARKET.indexOf(p)*2.1);return p[side]*cycle*(side==='sell'?1+(this.s.upgrades.broker||0)*.08:1);}
 trade(id,side,count){if(!MARKET.some(p=>p.id===id))return 0;let qty=count==='max'?side==='sell'?Math.floor((this.s.res[id]||0)):Math.floor((this.s.res.credits||0)/this.marketPrice(id,'buy')):Math.max(1,Math.floor(count));qty=Math.min(qty,1e12);if(qty<1)return 0;
  if(side==='sell'){qty=Math.min(qty,Math.floor(this.s.res[id]||0));if(!qty)return 0;this.s.res[id]=clamp(this.s.res[id]-qty);this.add('credits',qty*this.marketPrice(id,'sell'),true);}else if(side==='buy'){qty=Math.min(qty,Math.floor((this.s.res.credits||0)/this.marketPrice(id,'buy')));if(!qty)return 0;this.s.res.credits=clamp(this.s.res.credits-qty*this.marketPrice(id,'buy'));this.add(id,qty);}else return 0;
  this.addLog(`${side==='sell'?'Sold':'Bought'} ${fmt(qty)} ${RESOURCE_MAP[id].name}.`,'trade');return qty;}
 missionPrice(id){const m=MISSION_MAP[id];if(!m)return null;const n=this.s.missionDone[id]||0;return {ask:multiplyCost(m.ask,Math.pow(1.3,Math.min(100,n))),reward:multiplyCost(m.reward,Math.pow(1.2,Math.min(100,n)))};}
 fulfillMission(id){const m=MISSION_MAP[id];if(!m)return false;const v=this.missionPrice(id);if(!payCost(this.s.res,v.ask))return false;for(const [key,n] of Object.entries(v.reward))this.add(key,n,true);this.s.missionDone[id]=(this.s.missionDone[id]||0)+1;this.s.stats.missions++;this.addLog(`Contract completed: ${m.name}.`,'mission');return true}
 startExpedition(id){const e=EXPEDITION_MAP[id];if(!e||this.s.expedition||!payCost(this.s.res,e.cost))return false;this.s.expedition={id,endAt:this.s.clock+e.duration};this.addLog(`Fleet dispatched: ${e.name}.`,'mission');return true}
 finishExpedition(){const active=this.s.expedition;if(!active||this.s.clock<active.endAt)return false;const e=EXPEDITION_MAP[active.id];if(!e){this.s.expedition=null;return false}const mul=1+(this.s.upgrades.fleet||0)*.25;for(const [k,v]of Object.entries(e.reward))this.add(k,v*mul,true);this.s.expedition=null;this.s.stats.expeditions++;this.addLog(`Fleet returned: ${e.name}. Rewards recovered!`,'rare');return true;}
 pulse(){if(this.s.clock-this.s.lastPulse<15)return false;this.s.lastPulse=this.s.clock;this.s.pulseEnd=this.s.clock+8;const k=1+(this.s.upgrades.pulse||0)*.3;const g=1+this.countTech*.14+(this.s.res.cores||0)*.05;this.add('ore',(32+this.s.buildings.drill*8)*k*g,true);this.add('energy',(38+this.s.buildings.reactor*12)*k*g,true);this.add('credits',(40+this.s.buildings.exchange*8)*k*g,true);this.s.stats.pulses++;this.addLog('OVERDRIVE PULSE! Production ×3 for 8 seconds.','rare');return true;}
 claimAchievement(id){const a=ACHIEVEMENTS.find(x=>x.id===id);if(!a||this.s.achievements[id]||this.achievementMetric(a)<a.target)return false;this.s.achievements[id]=true;for(const [k,v]of Object.entries(a.reward))this.add(k,v);this.addLog(`Achievement earned: ${a.name}.`,'rare');return true}
 achievementMetric(a){if(a.metric==='tech')return this.countTech;if(a.metric==='artifacts')return this.s.stats.artifacts;if(a.metric==='missions')return this.s.stats.missions;if(a.metric==='expeditions')return this.s.stats.expeditions;if(a.metric==='reboots')return this.s.stats.reboots;if(a.metric==='ascensions')return this.s.stats.ascensions;return this.s.ledger[a.metric]||0}
 prestigeGain(id){const p=PRESTIGE.find(x=>x.id===id);if(!p)return 0;let v=0;if(id==='reboot')v=this.s.runPower;else if(id==='ascend')v=this.s.res.cores;else if(id==='collapse')v=this.s.res.essence;else v=this.s.res.singularities;return v>=p.threshold?Math.max(1,Math.floor(Math.sqrt(v/p.threshold))):0;}
 prestige(id){const gained=this.prestigeGain(id);if(!gained)return 0;const keepMeta={...Object.fromEntries(PRESTIGE.map(p=>[p.currency,this.s.res[p.currency]]))};if(id==='reboot')keepMeta.cores+=gained;
 if(id==='ascend'){keepMeta.cores=0;keepMeta.essence+=gained;}
 if(id==='collapse'){keepMeta.cores=0;keepMeta.essence=0;keepMeta.singularities+=gained;}
 if(id==='eternity'){keepMeta.cores=0;keepMeta.essence=0;keepMeta.singularities=0;keepMeta.eternity+=gained;}
 const backup=this.s;const next=makeState(Date.now());next.res={...next.res,...keepMeta};next.stats={...backup.stats};next.stats.largestRun=Math.max(next.stats.largestRun,backup.runPower);const keys={reboot:'reboots',ascend:'ascensions',collapse:'collapses',eternity:'eternities'};next.stats[keys[id]]++;next.achievements={...backup.achievements};next.metaUpgrades={...backup.metaUpgrades};next.totalPower=backup.totalPower;next.ledger={...backup.ledger};next.played=backup.played;this.s=next;this.addLog(`${id.toUpperCase()} COMPLETE! +${gained} ${RESOURCE_MAP[PRESTIGE.find(p=>p.id===id).currency].name}.`,'rare');return gained;}
 metaCost(id){const lvl=this.s.metaUpgrades[id]||0;const data={coreAmp:['cores',3,1.6],essenceAmp:['essence',2,2.0],singularityAmp:['singularities',1,2.2],eternityAmp:['eternity',1,2.5]};const v=data[id];return v?{[v[0]]:Math.ceil(v[1]*Math.pow(v[2],Math.min(500,lvl)))}:null;}
 buyMeta(id){const cost=this.metaCost(id);if(!cost||!payCost(this.s.res,cost))return false;this.s.metaUpgrades[id]=(this.s.metaUpgrades[id]||0)+1;this.addLog(`Permanent upgrade activated: ${id}.`,'rare');return true;}
 canAutomate(id){const t={autobuy:'factoryAI',autotrade:'logistics',autocraft:'logistics',autoresearch:'dimensionalAI'}[id];return t&&!!this.s.tech[t];}
 toggleAutomation(id){if(!(id in this.s.auto)||!this.canAutomate(id))return false;this.s.auto[id]=!this.s.auto[id];return true;}
 step(seconds=1,options={}){let remaining=Math.min(3600*24,Math.max(0,Number(seconds)||0)),total=0;while(remaining>1e-8){const d=Math.min(remaining,Math.max(.25,options.offline?5:1));this._stepChunk(d);remaining-=d;total+=d;}return total;}
 _stepChunk(dt){const s=this.s;s.clock+=dt;s.played+=dt;const bonuses=this.getBonuses();
 for(const b of BUILDINGS){const perf=this.buildingPerSecond(b,bonuses);if(!Object.keys(perf.outputs).length)continue;
  let fraction=1;for(const [key,perSec]of Object.entries(perf.inputs)){if(perSec>0)fraction=Math.min(fraction,(s.res[key]||0)/(perSec*dt));}
  fraction=Math.min(1,Math.max(0,fraction));if(fraction<1e-10)continue;
  for(const [key,rate]of Object.entries(perf.inputs))s.res[key]=clamp(s.res[key]-rate*dt*fraction);
  for(const [key,rate]of Object.entries(perf.outputs))this.add(key,rate*dt*fraction,true);
 }
 if(s.expedition)this.finishExpedition();
 this._autoT+=dt;
 if(this._autoT>=4){this._autoT%=4;
  if(s.auto.autotrade&&this.canAutomate('autotrade')){const excess=Math.max(0,Math.floor((s.res.ore||0)-(s.marketReserve||0)));if(excess>=10)this.trade('ore','sell',excess);}
  if(s.auto.autobuy&&this.canAutomate('autobuy')){for(const b of BUILDINGS.filter(b=>this.canBuild(b.id))){if(!this.buyBuilding(b.id).ok)continue;break;}}
  if(s.auto.autocraft&&this.canAutomate('autocraft'))this.craft(s.autoRecipe,1);
  if(s.auto.autoresearch&&this.canAutomate('autoresearch')){const t=TECHS.find(t=>!s.tech[t.id]&&t.pre.every(k=>s.tech[k])&&hasCost(s.res,t.cost));if(t)this.research(t.id);}
 }
 }
 offline(now=Date.now()){let since=Math.max(0,(now-this.s.lastSavedAt)/1000);const cap=(2+(this.s.upgrades.vault||0))*3600;const duration=Math.min(since,cap);this.step(duration,{offline:true});this.s.lastSavedAt=now;if(duration>5)this.addLog(`Offline production: ${fmtTime(duration)} collected.`, 'system');return duration;}
 serialize(now=Date.now()){this.s.lastSavedAt=now;return JSON.stringify(this.s);}
}
export function money(cost){return Object.entries(cost).map(([id,v])=>`${RESOURCE_MAP[id]?.icon||'•'} ${fmt(v)} ${RESOURCE_MAP[id]?.name||id}`).join(' · ')}
