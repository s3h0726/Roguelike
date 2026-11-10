import {ARENA,CLASSES,ENEMIES,ABILITIES,UPGRADES,RELICS} from './data.js';
const TWO_PI=Math.PI*2;
export const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function seededRandom(seed=Date.now()){let v=(seed>>>0)||1;return ()=>{v^=v<<13;v^=v>>>17;v^=v<<5;return (v>>>0)/4294967296;};}
const rand=(s,a,b)=>a+(b-a)*s.random();
const pick=(s,a)=>a[Math.floor(s.random()*a.length)];
const emit=(s,e)=>{if(s.events.length<250)s.events.push(e);};
export function createGame(seed=1234){return {random:seededRandom(seed),phase:'menu',stage:1,elapsed:0,stageElapsed:0,spawnClock:0,bossSpawned:false,bossDead:false,bossId:0,enemySeq:0,score:0,kills:0,level:1,xp:0,xpNeed:22,queuedLevels:0,choices:[],hero:null,upgradeLv:{},relics:[],enemies:[],shots:[],enemyShots:[],pickups:[],events:[],floaters:[],timeScale:1,hitStop:0,blink:0,toast:'',seed,summary:null};}
export function startRun(s,classId='void'){
 const cls=CLASSES.find(c=>c.id===classId)||CLASSES[0];let n=createGame(s.seed);Object.assign(s,n);s.phase='playing';
 s.hero={x:0,y:0,hp:cls.hp,maxHp:cls.hp,shield:0,maxShield:0,shieldRegen:0,atk:cls.atk,rate:cls.rate,range:cls.range,speed:cls.speed,classId:cls.id,color:cls.color,
  damageMult:1,haste:1,crit:.07,moveMult:1,cooldownMult:1,abilityMult:1,pickup:3.3,energy:12,energyMax:100,attackClock:0,attackCount:0,invuln:0,dashCooldown:0,dashTime:0,dx:0,dy:0,aim:0,abilities:{[cls.starter]:1},abilityClock:{},kills:0,revived:false};
 s.upgradeLv[cls.starter]=1; for(let i=0;i<5;i++)spawnAtEdge(s,i%3===0?'crawler':'wraith'); emit(s,{type:'banner',text:'RIFT BREACHED',color:cls.color});emit(s,{type:'pulse',x:0,y:0,r:8,color:cls.color});return s;
}
function nextChoices(s,pool,exclude=[],n=3){const available=pool.filter(a=>!exclude.includes(a.id));let result=[];while(result.length<n&&available.length){const idx=Math.floor(s.random()*available.length);result.push(available.splice(idx,1)[0]);}return result;}
function levelPause(s){s.phase='level';let capped=UPGRADES.filter(u=>(s.upgradeLv[u.id]||0)<(u.kind==='ability'?5:8));s.choices=nextChoices(s,capped);emit(s,{type:'banner',text:'ASCENSION',color:'#ddbbff'});}
export function grantXp(s,value){if(s.phase==='menu'||s.phase==='dead')return;s.xp+=value;
 while(s.xp>=s.xpNeed){s.xp-=s.xpNeed;s.level++;s.queuedLevels++;s.xpNeed=Math.floor(22*Math.pow(s.level,1.35));}
 if(s.queuedLevels>0&&s.phase==='playing')levelPause(s);
}
export function chooseUpgrade(s,id){if(s.phase!=='level')return false;const choice=s.choices.find(a=>a.id===id);if(!choice)return false;const h=s.hero;
 s.upgradeLv[id]=(s.upgradeLv[id]||0)+1;
 if(choice.kind==='ability'){h.abilities[id]=(h.abilities[id]||0)+1;h.abilityClock[id]=0;}
 else{switch(id){case'damage':h.damageMult*=1.18;break;case'haste':h.haste*=1.15;break;case'vitality':h.maxHp+=26;h.hp=Math.min(h.maxHp,h.hp+26);break;case'stride':h.moveMult*=1.10;break;case'crit':h.crit+=.08;break;case'shield':h.maxShield+=20;h.shield+=20;break;case'cooldown':h.cooldownMult*=.9;break;case'magnet':h.pickup+=1.5;break;}}
 s.queuedLevels=Math.max(0,s.queuedLevels-1);emit(s,{type:'burst',x:h.x,y:h.y,color:choice.color,count:48});
 if(s.queuedLevels){levelPause(s);}else{s.phase='playing';s.choices=[];}return true;
}
export function chooseRelic(s,id){if(s.phase!=='relic')return false;const r=s.choices.find(v=>v.id===id);if(!r)return false;const h=s.hero;s.relics.push(r.id);
 if(id==='glass'){h.damageMult*=1.55;h.maxHp=Math.max(30,Math.round(h.maxHp*.8));h.hp=Math.min(h.hp,h.maxHp);}
 if(id==='lunar'){h.maxShield+=35;h.shield+=35;h.shieldRegen+=1.3;}
 if(id==='serpent'){h.haste*=1.18;h.moveMult*=1.18;}
 if(id==='echo'){h.cooldownMult*=.75;}
 if(id==='celestial'){h.abilityMult*=1.35;}
 s.stage++;s.stageElapsed=0;s.spawnClock=0;s.bossSpawned=false;s.bossDead=false;s.bossId=0;s.enemies=[];s.shots=[];s.enemyShots=[];s.pickups=[];s.phase='playing';s.choices=[];
 h.hp=Math.min(h.maxHp,h.hp+Math.ceil(h.maxHp*.24));h.energy=Math.min(h.energyMax,h.energy+30);h.shield=Math.min(h.maxShield,h.shield+15);
 emit(s,{type:'banner',text:`STAGE ${s.stage} — ${s.stage%4===0?'BOSS RIFT':'THE ABYSS'}`,color:'#ffe0a1'});emit(s,{type:'pulse',x:0,y:0,r:15,color:r.color});return true;
}
function spawnEnemy(s,type,x,y){const def=ENEMIES[type];const scale=1+Math.max(0,s.stage-1)*.19;const m={id:++s.enemySeq,type,x,y,hp:def.hp*scale,maxHp:def.hp*scale,r:def.r,speed:def.speed*(1+.02*s.stage),dmg:def.dmg*(1+.12*(s.stage-1)),xp:def.xp,color:def.color,attack:0,ai:rand(s,0,3),slow:0,stun:0,phase:0};s.enemies.push(m);emit(s,{type:'spawn',x,y,color:m.color});return m;}
function spawnAtEdge(s,type){const h=s.hero;let angle=rand(s,0,TWO_PI),r=type==='boss'?17:rand(s,11.5,15.5);let x=clamp(h.x+Math.cos(angle)*r,-ARENA.width/2+1,ARENA.width/2-1),y=clamp(h.y+Math.sin(angle)*r,-ARENA.height/2+1,ARENA.height/2-1);return spawnEnemy(s,type,x,y);}
function alive(s){return s.enemies.filter(m=>m.hp>0);}
function nearest(s,x=s.hero.x,y=s.hero.y,r=Infinity){let best=null,dist=r;for(const m of s.enemies){if(m.hp<=0)continue;let d=Math.hypot(m.x-x,m.y-y);if(d<dist){best=m;dist=d;}}return best;}
function hit(s,m,amount,color='#fff',source='attack'){
 if(!m||m.hp<=0)return;const h=s.hero;let damage=amount*(source==='ability'?h.abilityMult:1);if(m.type==='boss'&&s.relics.includes('hunt'))damage*=1.32;
 let crit=s.random()<h.crit;if(crit)damage*=1.8;m.hp-=damage;emit(s,{type:'hit',x:m.x,y:m.y,color:crit?'#ffe7a1':color,crit,amount:Math.round(damage)});
 if(m.hp<=0){kill(s,m);}return damage;
}
function kill(s,m){if(m.dead)return;m.dead=true;m.hp=0;s.kills++;s.hero.kills++;s.score+=m.type==='boss'?2000:20+(s.stage*5);
 emit(s,{type:'burst',x:m.x,y:m.y,color:m.color,count:m.type==='boss'?180:16});emit(s,{type:'pulse',x:m.x,y:m.y,r:m.type==='boss'?15:2.5,color:m.color});s.pickups.push({x:m.x,y:m.y,value:m.xp*(1+Math.floor(s.stage/4)*.16)});
 s.hero.energy=clamp(s.hero.energy+(s.relics.includes('eclipse')?7.2:4.5),0,s.hero.energyMax);
 if(s.relics.includes('blood')&&s.kills%5===0)s.hero.hp=Math.min(s.hero.maxHp,s.hero.hp+3);
 if(m.type==='boss'){s.bossDead=true;emit(s,{type:'banner',text:'STAR DEVOURER DESTROYED',color:'#ffe69e'});}
}
function areaDamage(s,x,y,r,damage,color,source='ability'){for(const m of s.enemies){if(m.hp<=0)continue;let d=Math.hypot(m.x-x,m.y-y);if(d<r+m.r)hit(s,m,damage*(1-Math.min(.7,d/(r*1.9))),color,source);}}
function fireShot(s,from,to,damage,color,count=1){if(!to)return;let angle=Math.atan2(to.y-from.y,to.x-from.x);for(let j=0;j<count;j++){let a=angle+(j-(count-1)/2)*.13;s.shots.push({x:from.x,y:from.y,vx:Math.cos(a)*23,vy:Math.sin(a)*23,ttl:1.05,r:.25,damage,color,penetrate:0,hit:new Set()});}emit(s,{type:'muzzle',x:from.x,y:from.y,color});}
function useAbility(s,id,lv){const h=s.hero,col=ABILITIES[id].color,bonus=h.atk*h.damageMult;const target=nearest(s,h.x,h.y,25);
 if(id==='nova'){const radius=5.4+lv*.85;areaDamage(s,h.x,h.y,radius,bonus*(1.45+lv*.5),col);emit(s,{type:'pulse',x:h.x,y:h.y,r:radius,color:col});emit(s,{type:'burst',x:h.x,y:h.y,color:col,count:35+lv*12});}
 if(id==='chain'&&target){let targets=alive(s).sort((a,b)=>distance(a,target)-distance(b,target)).slice(0,2+lv*2),last={x:h.x,y:h.y};for(let m of targets){hit(s,m,bonus*(.60+lv*.30),col);emit(s,{type:'beam',x:last.x,y:last.y,toX:m.x,toY:m.y,color:col,kind:'lightning'});last=m;}}
 if(id==='meteor'&&target){const x=target.x,y=target.y,r=2.5+lv*.5;areaDamage(s,x,y,r,bonus*(2+lv*.6),col);emit(s,{type:'meteor',x,y,color:col,r});}
 if(id==='beam'&&target){let a=Math.atan2(target.y-h.y,target.x-h.x),len=25,x2=h.x+Math.cos(a)*len,y2=h.y+Math.sin(a)*len;for(let m of s.enemies){if(m.hp<=0)continue;let px=m.x-h.x,py=m.y-h.y,t=clamp((px*Math.cos(a)+py*Math.sin(a))/len,0,1),d=Math.hypot(px-t*len*Math.cos(a),py-t*len*Math.sin(a));if(d<m.r+.5)hit(s,m,bonus*(2.2+lv*.7),col);}emit(s,{type:'beam',x:h.x,y:h.y,toX:x2,toY:y2,color:col,kind:'laser'});emit(s,{type:'pulse',x:h.x,y:h.y,r:4,color:col});}
 if(id==='frost'){const radius=5+lv*.85;for(let m of s.enemies){if(distance(m,h)<radius+m.r){hit(s,m,bonus*(.75+lv*.42),col);m.slow=2.4+lv*.4;}}emit(s,{type:'pulse',x:h.x,y:h.y,r:radius,color:col});emit(s,{type:'burst',x:h.x,y:h.y,color:col,count:44});}
}
function orbitTick(s,dt,now){const h=s.hero,lv=h.abilities.orbit||0;if(!lv)return;let blades=1+Math.floor(lv*.8),r=2.4+lv*.32;for(let i=0;i<blades;i++){const a=now*2.5+i*TWO_PI/blades,x=h.x+Math.cos(a)*r,y=h.y+Math.sin(a)*r;for(const m of s.enemies){if(m.hp>0&&Math.hypot(m.x-x,m.y-y)<m.r+.65){m.orbitHit=m.orbitHit||{};if((m.orbitHit[i]??0)<now-.55){m.orbitHit[i]=now;hit(s,m,(h.atk*h.damageMult)*(.35+lv*.1)*1.1,ABILITIES.orbit.color,'ability');}}}}}
function updateAbilities(s,dt){let h=s.hero;for(const [id,lv]of Object.entries(h.abilities)){if(!lv||id==='orbit')continue;let cd=ABILITIES[id].cd*h.cooldownMult;
 if(s.relics.includes('echo')){} h.abilityClock[id]=(h.abilityClock[id]||0)+dt;
 if(h.abilityClock[id]>=cd){if(['chain','beam','meteor'].includes(id)&&!nearest(s,h.x,h.y,23))continue;h.abilityClock[id]=0;useAbility(s,id,lv);}
 }}
function contactHero(s,damage,fromX,fromY){const h=s.hero;if(h.invuln>0||s.phase!=='playing')return;h.invuln=.63;let left=damage;if(h.shield>0){let absorb=Math.min(h.shield,left);h.shield-=absorb;left-=absorb;}h.hp=Math.max(0,h.hp-left);s.blink=.22;emit(s,{type:'heroHit',x:h.x,y:h.y,amount:Math.ceil(damage),color:'#ff497b'});emit(s,{type:'pulse',x:h.x,y:h.y,r:2,color:'#ff5775'});
 if(s.relics.includes('thorn')){let m=nearest(s,fromX,fromY,2.5);if(m)hit(s,m,damage*.3,'#a8ff9d');}
 if(h.hp<=0){if(s.relics.includes('phoenix')&&!h.revived){h.revived=true;h.hp=h.maxHp*.4;h.invuln=3;emit(s,{type:'banner',text:'PHOENIX REBORN',color:'#ffc77a'});emit(s,{type:'meteor',x:h.x,y:h.y,color:'#ff9153',r:10});areaDamage(s,h.x,h.y,10,h.atk*10,'#ff9a62');}
 else{s.phase='dead';s.summary={stage:s.stage,level:s.level,kills:s.kills,score:s.score,elapsed:Math.floor(s.elapsed)};emit(s,{type:'banner',text:'RUN ENDED',color:'#ff698e'});}}
}
function spawnBoss(s){let m=spawnAtEdge(s,'boss');s.bossId=m.id;s.bossSpawned=true;emit(s,{type:'banner',text:'THE STAR DEVOURER',color:'#ff75c9'});emit(s,{type:'meteor',x:m.x,y:m.y,color:'#ff69cf',r:9});}
function updateEnemies(s,dt){const h=s.hero;for(const m of s.enemies){if(m.hp<=0)continue;m.attack=Math.max(0,m.attack-dt);m.ai-=dt;m.slow=Math.max(0,m.slow-dt);let dist=distance(m,h);let ux=(h.x-m.x)/Math.max(.001,dist),uy=(h.y-m.y)/Math.max(.001,dist);let speed=m.speed*(m.slow>0?.35:1);
 if(m.type==='specter'&&dist<11){if(dist<6){m.x-=ux*speed*dt;m.y-=uy*speed*dt;}else if(dist>8){m.x+=ux*speed*dt;m.y+=uy*speed*dt;}if(m.attack===0){m.attack=2.3;s.enemyShots.push({x:m.x,y:m.y,vx:ux*11,vy:uy*11,ttl:2.2,damage:m.dmg,r:.3,color:m.color});emit(s,{type:'beam',x:m.x,y:m.y,toX:m.x+ux*2,toY:m.y+uy*2,color:m.color,kind:'warning'});}}
 else if(m.type==='boss'){m.phase+=dt;if(dist>3){m.x+=ux*speed*dt;m.y+=uy*speed*dt;}if(m.attack<=0){m.attack=3.1;for(let i=0;i<12;i++){let a=i*TWO_PI/12+m.phase;s.enemyShots.push({x:m.x,y:m.y,vx:Math.cos(a)*8.2,vy:Math.sin(a)*8.2,ttl:3,damage:m.dmg*.55,r:.4,color:'#fc85c9'});}emit(s,{type:'pulse',x:m.x,y:m.y,r:8,color:'#ed62cf'});}}
 else {m.x+=ux*speed*dt;m.y+=uy*speed*dt;}
 const reach=m.r+0.62;if(dist<reach&&m.attack<=0){m.attack=m.type==='boss'?1.3:.85;contactHero(s,m.dmg,m.x,m.y);if(m.type==='bomber'){areaDamage(s,m.x,m.y,2.8,m.dmg,'#ff5c73');m.hp=0;m.dead=true;emit(s,{type:'meteor',x:m.x,y:m.y,color:m.color,r:3});}}
 m.x=clamp(m.x,-ARENA.width/2+.5,ARENA.width/2-.5);m.y=clamp(m.y,-ARENA.height/2+.5,ARENA.height/2-.5);
 }}
function updateShots(s,dt){const h=s.hero;for(let i=s.shots.length-1;i>=0;i--){const p=s.shots[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;
 for(const m of s.enemies){if(m.hp<=0||p.hit.has(m.id))continue;if(distance(p,m)<m.r+p.r){p.hit.add(m.id);hit(s,m,p.damage,p.color);if(p.penetrate<=0){p.ttl=0;break;}p.penetrate--;}}
 if(p.ttl<=0||Math.abs(p.x)>ARENA.width/2+2||Math.abs(p.y)>ARENA.height/2+2)s.shots.splice(i,1);}
 for(let i=s.enemyShots.length-1;i>=0;i--){const p=s.enemyShots[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;
 if(distance(p,h)<.75+p.r){contactHero(s,p.damage,p.x,p.y);p.ttl=0;}if(p.ttl<=0)s.enemyShots.splice(i,1);}}
function updatePickups(s,dt){const h=s.hero;for(let i=s.pickups.length-1;i>=0;i--){const p=s.pickups[i],d=distance(p,h);if(d<h.pickup+2){const speed=d<h.pickup?22:7;p.x+=(h.x-p.x)/Math.max(.001,d)*Math.min(d,speed*dt);p.y+=(h.y-p.y)/Math.max(.001,d)*Math.min(d,speed*dt);}if(distance(p,h)<.65){s.pickups.splice(i,1);grantXp(s,p.value);emit(s,{type:'xp',x:p.x,y:p.y,color:'#94ffda'});}}}
export function ultimate(s){if(s.phase!=='playing'||s.hero.energy<100)return false;let h=s.hero;h.energy=0;const radius=s.relics.includes('gravity')?24:17;emit(s,{type:'ultimate',x:h.x,y:h.y,r:radius,color:'#d8acff'});emit(s,{type:'banner',text:'SUPERNOVA : ANNIHILATION',color:'#eec5ff'});areaDamage(s,h.x,h.y,radius,100+h.atk*h.damageMult*13,'#f2caff');h.invuln=Math.max(h.invuln,1.1);s.hitStop=.13;return true;}
export function dash(s,input){if(s.phase!=='playing'||s.hero.dashCooldown>0)return false;const h=s.hero;let dx=input.x||Math.cos(h.aim),dy=input.y||Math.sin(h.aim),len=Math.hypot(dx,dy)||1;h.dx=dx/len;h.dy=dy/len;h.dashTime=.19;h.dashCooldown=2.7;h.invuln=Math.max(h.invuln,.28);emit(s,{type:'burst',x:h.x,y:h.y,count:28,color:h.color});return true;}
export function update(s,elapsed,input={x:0,y:0}){if(s.phase!=='playing')return;let dt=clamp(elapsed,0,.045);if(s.hitStop>0){s.hitStop-=dt;return;}s.elapsed+=dt;s.stageElapsed+=dt;s.blink=Math.max(0,s.blink-dt);const h=s.hero;
 h.invuln=Math.max(0,h.invuln-dt);h.dashCooldown=Math.max(0,h.dashCooldown-dt);h.attackClock+=dt;h.shield=Math.min(h.maxShield,h.shield+dt*(h.shieldRegen+.3));
 if(h.dashTime>0){h.dashTime-=dt;h.x+=h.dx*dt*37;h.y+=h.dy*dt*37;emit(s,{type:'trail',x:h.x,y:h.y,color:h.color});}
 else {let len=Math.hypot(input.x||0,input.y||0);if(len>.05){let dx=input.x/Math.max(len,1),dy=input.y/Math.max(len,1);h.x+=dx*h.speed*h.moveMult*dt;h.y+=dy*h.speed*h.moveMult*dt;h.aim=Math.atan2(dy,dx);}}
 h.x=clamp(h.x,-ARENA.width/2+.8,ARENA.width/2-.8);h.y=clamp(h.y,-ARENA.height/2+.8,ARENA.height/2-.8);
 const target=nearest(s,h.x,h.y,h.range);
 if(h.attackClock>=h.rate/h.haste&&target){h.attackClock=0;h.attackCount++;fireShot(s,h,target,h.atk*h.damageMult,h.color,1);if(s.relics.includes('prism')&&h.attackCount%5===0)fireShot(s,h,target,h.atk*h.damageMult*.6,'#ecb5ff',2);}
 updateAbilities(s,dt);orbitTick(s,dt,s.elapsed);s.spawnClock+=dt;
 let delay=clamp(1.05-(s.stage-1)*.075,.31,1.05);if(s.spawnClock>=delay&&s.enemies.length<70){s.spawnClock=0;const pool=['wraith','crawler',...(s.stage>=2?['specter']:[]),...(s.stage>=3?['bulwark']:[]),...(s.stage>=4?['bomber']:[])];for(let i=0;i<(s.stage>=6?2:1);i++)spawnAtEdge(s,pick(s,pool));}
 if(s.stage%4===0&&!s.bossSpawned&&s.stageElapsed>11)spawnBoss(s);
 updateEnemies(s,dt);updateShots(s,dt);updatePickups(s,dt);
 if(s.phase!=='playing')return;
 s.enemies=s.enemies.filter(e=>e.hp>0);if(s.phase==='playing'&&s.stageElapsed>=(s.stage%4===0?36:31)&& (s.stage%4!==0 || s.bossDead)){s.phase='relic';s.choices=nextChoices(s,RELICS,s.relics);emit(s,{type:'banner',text:'RIFT CONQUERED',color:'#ffd78e'});}
}
export function getCooldownFraction(s,id){let lv=s.hero?.abilities[id];if(!lv)return 0;let d=ABILITIES[id].cd*s.hero.cooldownMult;return d?Math.min(1,(s.hero.abilityClock[id]||0)/d):1;}
export function getDiagnostics(s){return {phase:s.phase,stage:s.stage,level:s.level,kills:s.kills,enemies:s.enemies.length,projectiles:s.shots.length,energy:s.hero?.energy,health:s.hero?.hp};}
