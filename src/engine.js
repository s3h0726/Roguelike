import {COLS,ROWS,MAX_BENCH,UNITS,UNIT_BY_ID,RELICS,TRAITS,stageFor,maxField,weightPool} from './data.js';
const rand=(a,b)=>a+Math.random()*(b-a);
const choice=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const cellPoint=(col,row)=>({x:60+col*120,y:60+row*120});
export const rarityColor={RARE:'#73c8ff',EPIC:'#c68bff',LEGENDARY:'#ffd98f'};

export class Game {
  constructor({onChange=()=>{},onFX=()=>{},onFinish=()=>{}}={}){
    this.onChange=onChange;this.onFX=onFX;this.onFinish=onFinish;
    this.best=this.loadBest();this.seq=0;this.silent=true;this.reset();this.silent=false;
  }
  loadBest(){try{return Number(localStorage.getItem('eclipse-protocol-best')||0)||0;}catch{return 0;}}
  saveBest(){this.best=Math.max(this.best,this.round);try{localStorage.setItem('eclipse-protocol-best',String(this.best));}catch{}}
  unit(type,col=null,row=null,star=1){return {uid:++this.seq,type,col,row,star};}
  reset(){
    this.phase='prep';this.round=1;this.gold=12;this.level=1;this.lives=3;this.streak=0;
    this.roster=[this.unit('aether',1,1),this.unit('nova',null,null)];
    this.relics=[];this.shopLocked=false;this.freeRerolls=0;this.shop=[];
    this.combatUnits=[];this.projectiles=[];this.delayed=[];this.tempo=1;this.ultra=true;
    this.combatTime=0;this.energy=0;this.chainHits=0;this.effects=[];this.result=null;
    this.enemyPreview=[];this.activeTraits={};this.relicChoices=[];this.roundStage=stageFor(1);
    this.rollShop(true);this.makeEnemy();this.changed();
  }
  changed(){if(!this.silent)this.onChange(this);}
  board(){return this.roster.filter(u=>u.col!==null);}
  bench(){return this.roster.filter(u=>u.col===null);}
  capacity(){return maxField(this.level);}
  traitCounts(){
    const counts=Object.fromEntries(Object.keys(TRAITS).map(k=>[k,0]));
    for(const u of this.board()) for(const t of UNIT_BY_ID[u.type].traits) counts[t]++;
    return counts;
  }
  traitTier(name){return this.activeTraits[name]||0;}
  modifiers(){const result={atk:0,hp:0,mana:0,burn:0,celestial:0,spell:0,armor:0,speed:0,lifesteal:0,chain:0,gold:0,startMana:0,crit:0,burst:0,reroll:0};
    for(const id of this.relics){const r=RELICS.find(x=>x.id===id);if(!r)continue;for(const [k,v] of Object.entries(r.mods))result[k]=(result[k]||0)+v;}
    return result;
  }
  price(type){return UNIT_BY_ID[type].cost;}
  rollShop(free=false){
    if(this.phase!=='prep')return false;
    if(!free){if(this.gold<2)return false;this.gold-=2;}
    const pool=weightPool(this.level);
    this.shop=Array.from({length:5},()=>choice(pool).id);
    this.changed();return true;
  }
  buy(index){
    if(this.phase!=='prep'||index<0||index>=this.shop.length)return false;
    const type=this.shop[index];if(!type)return false;
    const cost=this.price(type);if(this.gold<cost||this.bench().length>=MAX_BENCH)return false;
    this.gold-=cost;this.roster.push(this.unit(type));this.shop[index]=null;
    this.fuse(type,1);this.changed();return true;
  }
  fuse(type,star){
    if(star>=3)return;
    const group=this.roster.filter(u=>u.type===type&&u.star===star);
    if(group.length<3)return;
    const onBoard=group.find(u=>u.col!==null);
    const keeper=onBoard||group[0];
    this.roster=this.roster.filter(u=>!group.includes(u)||u===keeper);
    keeper.star=star+1;
    this.fx('fuse',{...cellPoint(keeper.col??2,keeper.row??1),color:UNIT_BY_ID[type].color,text:`${keeper.star}★ FUSION`});
    this.fuse(type,star+1);
  }
  place(uid,col,row){
    if(this.phase!=='prep'||col<0||col>3||row<0||row>=ROWS)return false;
    const current=this.roster.find(u=>u.uid===uid);if(!current)return false;
    if(current.col===null&&this.board().length>=this.capacity()){
      const target=this.roster.find(u=>u.col===col&&u.row===row);
      if(!target)return false;
    }
    const old={col:current.col,row:current.row};
    const target=this.roster.find(u=>u.uid!==uid&&u.col===col&&u.row===row);
    if(target){target.col=old.col;target.row=old.row;}
    current.col=col;current.row=row;this.changed();return true;
  }
  toBench(uid){if(this.phase!=='prep'||this.bench().length>=MAX_BENCH)return false;
    const u=this.roster.find(x=>x.uid===uid);if(!u||u.col===null)return false;
    u.col=null;u.row=null;this.changed();return true;
  }
  sell(uid){if(this.phase!=='prep')return false;
    const index=this.roster.findIndex(u=>u.uid===uid);if(index<0)return false;
    const u=this.roster[index];this.gold+=this.price(u.type)*Math.pow(2,u.star-1);
    this.roster.splice(index,1);this.changed();return true;
  }
  levelUp(){if(this.phase!=='prep'||this.gold<4||this.level>=5)return false;
    this.gold-=4;this.level++;this.changed();return true;
  }
  toggleLock(){if(this.phase!=='prep')return;this.shopLocked=!this.shopLocked;this.changed();}
  fx(type,data){this.onFX(type,data);}
  makeEnemy(){
    const count=Math.min(13,2+Math.ceil(this.round*.68)+(this.roundStage.boss?1:0));
    const available=UNITS.filter(u=>u.cost<=Math.min(4,1+Math.floor(this.round/3)));
    this.enemyPreview=Array.from({length:count},(_,i)=>{
      const boss=this.roundStage.boss&&i===0;
      const template=boss?UNIT_BY_ID[this.round>=20?'devourer':this.round>=10?'seraph':'colossus']:choice(available);
      return {uid:`e${i}`,type:template.id,star:boss?2:1,col:7-Math.floor(i/4),row:i%4,boss};
    });this.changed();
  }
  createFighter(u,enemy){
    const t=UNIT_BY_ID[u.type],mods=this.modifiers();
    const scaled=Math.pow(1.82,u.star-1);
    const enemyScale=enemy?(0.72+this.round*.115):1;
    const iron=this.traitTier('Iron');const celestial=this.traitTier('Celestial');
    const hp=t.hp*scaled*enemyScale*(enemy?1:1+mods.hp+(iron*.11));
    const pos=cellPoint(u.col,u.row);
    return {uid:u.uid,type:u.type,team:enemy?'enemy':'ally',name:t.name,icon:t.icon,traits:t.traits,
      color:enemy?'#fa8295':t.color,star:u.star,boss:!!u.boss,x:pos.x,y:pos.y,
      hp,maxHp:hp,shield:enemy?0:(celestial?celestial*26:0),mana:enemy?20:(mods.startMana||0),maxMana:t.mana,
      atk:t.atk*scaled*enemyScale*(enemy?1:1+mods.atk+(celestial&&t.traits.includes('Celestial')?mods.celestial:0)),
      armor:t.armor+(enemy?0:mods.armor+iron*5),speed:t.speed*(enemy?1:1+mods.speed),
      range:t.range,attackCd:rand(.05,.5),castPause:0,status:[],burn:0,burnTime:0,slow:0,
      dead:false,attackCount:0,healDone:0,ability:t.ability};
  }
  begin(){
    if(this.phase!=='prep'||this.board().length===0)return false;
    const counts=this.traitCounts();this.activeTraits={};
    for(const [k,n] of Object.entries(counts))this.activeTraits[k]=n>=4?2:n>=2?1:0;
    this.combatUnits=[...this.board().map(u=>this.createFighter(u,false)),...this.enemyPreview.map(u=>this.createFighter(u,true))];
    if(this.roundStage.boss){for(const e of this.combatUnits.filter(u=>u.team==='enemy'&&u.boss)){e.hp*=1.5;e.maxHp*=1.5;e.atk*=1.35;e.shield=110;}}
    this.projectiles=[];this.delayed=[];this.combatTime=0;this.energy=0;this.chainHits=0;
    this.phase='combat';this.fx('banner',{text:this.roundStage.boss?'BOSS INCOMING':'BATTLE START',color:this.roundStage.boss?'#ff7797':'#9cefff'});
    this.fx('quake',{strength:5});this.changed();return true;
  }
  living(team){return this.combatUnits.filter(u=>u.team===team&&!u.dead&&u.hp>0);}
  nearest(from,team){let target=null,min=Infinity;for(const u of this.living(team)){const d=dist(from,u);if(d<min){min=d;target=u;}}return target;}
  gainEnergy(n){this.energy=clamp(this.energy+n*(1+this.modifiers().burst),0,100);}
  damage(target,amount,origin=null,opts={}){
    if(!target||target.dead||amount<=0)return 0;
    let raw=amount;
    if(origin?.team==='ally'){
      if(opts.ability)raw*=1+this.modifiers().spell+(this.traitTier('Arcane')*.13);
      if(!opts.dot&&Math.random()<.055+this.modifiers().crit){raw*=1.75;this.fx('text',{x:target.x,y:target.y-34,text:'CRITICAL',color:'#ffd278'});}
    }
    const actual=Math.max(1,raw*(100/(100+Math.max(0,target.armor)*5)));
    const shieldDmg=Math.min(target.shield,actual);target.shield-=shieldDmg;
    const healthDmg=actual-shieldDmg;target.hp-=healthDmg;
    this.fx('hit',{x:target.x,y:target.y,color:opts.color||origin?.color||'#fff',damage:Math.round(actual),critical:raw>amount*1.5});
    if(origin?.team==='ally'){
      this.gainEnergy(actual*.13);
      const ls=this.traitTier('Void')*(this.traitTier('Void')===2?.12:.07)+this.modifiers().lifesteal;
      if(ls>0&&origin.hp>0)origin.hp=Math.min(origin.maxHp,origin.hp+actual*ls);
      if(!opts.dot&&this.traitTier('Ember')>0){target.burn=Math.max(target.burn,3.6+this.traitTier('Ember')*2);target.burnTime=3.1;}
      if(!opts.dot&&!opts.chain&&this.traitTier('Storm')>0){this.chainHits++;
        if(this.chainHits>=Math.max(1,3+1-this.traitTier('Storm')-this.modifiers().chain)){
          this.chainHits=0;const other=this.living('enemy').find(x=>x!==target);
          if(other){this.fx('lightning',{from:{x:target.x,y:target.y},to:{x:other.x,y:other.y},color:'#86e4ff'});this.damage(other,15+this.round*2,origin,{chain:true,color:'#90ebff'});}
        }
      }
    }
    if(target.hp<=0)this.kill(target,origin);
    return actual;
  }
  kill(target,killer){if(target.dead)return;target.dead=true;target.hp=0;
    this.fx('death',{x:target.x,y:target.y,color:target.color,boss:target.boss});
    if(target.team==='enemy'){this.gainEnergy(10);this.fx('text',{x:target.x,y:target.y-44,text:target.boss?'BOSS DEFEATED':'✦',color:'#ffdc8d'});}
  }
  heal(u,value){if(!u||u.dead)return;u.hp=Math.min(u.maxHp,u.hp+value);this.fx('heal',{x:u.x,y:u.y,color:'#a3f3cc'});}
  spawnProjectile(from,target,damage,opts={}){
    if(!target||target.dead)return;
    this.projectiles.push({x:from.x,y:from.y,tx:target.x,ty:target.y,target,source:from,damage,speed:opts.speed||680,color:opts.color||from.color,ability:!!opts.ability,life:1.4});
    this.fx('muzzle',{x:from.x,y:from.y,color:opts.color||from.color});
  }
  ability(u){
    const enemies=this.living(u.team==='ally'?'enemy':'ally');const allies=this.living(u.team);
    if(!enemies.length)return;
    const target=this.nearest(u,u.team==='ally'?'enemy':'ally');if(!target)return;
    const pct=u.atk;const wave=u.team==='ally';
    this.fx('cast',{x:u.x,y:u.y,color:u.color});
    switch(u.ability){
      case 'shield':for(const a of allies.filter(a=>dist(a,u)<260)){a.shield+=45+u.star*24;}this.fx('shield',{x:u.x,y:u.y,color:u.color});break;
      case 'fortify':for(const a of allies){a.shield+=28+u.star*18;}this.fx('shield',{x:u.x,y:u.y,color:'#86e6cb'});break;
      case 'heal':for(const a of [...allies].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp).slice(0,3))this.heal(a,42+pct*1.2);this.fx('rune',{x:u.x,y:u.y,color:'#ffdb8f'});break;
      case 'volley':for(const t of [...enemies].sort((a,b)=>dist(u,a)-dist(u,b)).slice(0,4))this.spawnProjectile(u,t,pct*1.18,{color:'#a6e6ff',speed:900,ability:true});break;
      case 'dash':u.x=target.x-28*(u.team==='ally'?1:-1);u.y=target.y-10;this.fx('slash',{x:target.x,y:target.y,color:'#cda3ff'});this.damage(target,pct*3,u,{ability:true,color:'#c597ff'});break;
      case 'meteor':this.fx('warning',{x:target.x,y:target.y,color:'#ff946f',radius:110});this.delayed.push({time:.65,x:target.x,y:target.y,radius:125,damage:pct*2.7,source:u,color:'#ff9b6e',kind:'meteor'});break;
      case 'slam':this.fx('shock',{x:u.x,y:u.y,color:u.color,radius:220});for(const t of enemies.filter(t=>dist(t,u)<230)){this.damage(t,pct*2.2,u,{ability:true});t.slow=1.6;}break;
      case 'spin':this.fx('ring',{x:u.x,y:u.y,color:'#ff9874',radius:200});for(const t of enemies.filter(t=>dist(t,u)<200))this.damage(t,pct*2.1,u,{ability:true});break;
      case 'chain':{let curr=u;for(const t of [...enemies].sort((a,b)=>dist(a,u)-dist(b,u)).slice(0,5)){this.fx('lightning',{from:{x:curr.x,y:curr.y},to:{x:t.x,y:t.y},color:'#84dbff'});this.damage(t,pct*1.5,u,{ability:true,chain:true,color:'#84dbff'});curr=t;}break;}
      case 'vortex':this.fx('vortex',{x:target.x,y:target.y,color:'#b47fff',radius:200});for(const t of enemies.filter(t=>dist(t,target)<220)){this.damage(t,pct*1.95,u,{ability:true});t.slow=2;}break;
      case 'beam':this.fx('beam',{from:{x:u.x,y:u.y},to:{x:target.x,y:target.y},color:'#ffb678'});for(const t of enemies){const dx=target.x-u.x,dy=target.y-u.y,len=Math.hypot(dx,dy)||1;const proj=clamp(((t.x-u.x)*dx+(t.y-u.y)*dy)/len,0,len);const near=Math.hypot(t.x-u.x-dx*proj/len,t.y-u.y-dy*proj/len);if(near<55)this.damage(t,pct*3,u,{ability:true,color:'#ffc387'});}break;
      case 'apocalypse':this.fx('apocalypse',{x:target.x,y:target.y,color:'#f5deff',radius:390});this.delayed.push({time:.5,x:target.x,y:target.y,radius:400,damage:pct*2.75,source:u,color:'#dfb6ff',kind:'apocalypse'});break;
      case 'supernova':this.fx('apocalypse',{x:target.x,y:target.y,color:'#ff8aae',radius:330});this.delayed.push({time:.35,x:target.x,y:target.y,radius:340,damage:pct*2.85,source:u,color:'#ffa4c3',kind:'supernova'});break;
    }
    if(wave&&u.ability==='meteor')this.gainEnergy(5);
  }
  ultimate(){
    if(this.phase!=='combat'||this.energy<100)return false;
    this.energy=0;const targets=this.living('enemy');if(!targets.length)return false;
    this.fx('supernova',{x:480,y:240,color:'#ecd5ff'});
    this.fx('banner',{text:'SUPERNOVA PROTOCOL',color:'#e8baff'});
    this.delayed.push({time:.75,x:480,y:240,radius:800,damage:105+this.round*13,source:this.living('ally')[0]||null,color:'#e3aaff',kind:'ultimate'});
    this.changed();return true;
  }
  update(dt){
    if(this.phase!=='combat')return;
    dt=Math.min(.045,dt);if(dt<=0)return;
    this.combatTime+=dt;
    if(this.roundStage.kind==='meteor'&&Math.floor((this.combatTime-dt)/4)!==Math.floor(this.combatTime/4)){
      const victim=choice(this.living(Math.random()>.55?'ally':'enemy'));
      if(victim){this.fx('warning',{x:victim.x,y:victim.y,color:'#ffab79',radius:110});this.delayed.push({time:.9,x:victim.x,y:victim.y,radius:116,damage:28+this.round*4,source:null,color:'#ffaa76',kind:'meteor'});}
    }
    for(let i=this.delayed.length-1;i>=0;i--){const e=this.delayed[i];e.time-=dt;if(e.time<=0){this.delayed.splice(i,1);this.fx(e.kind==='ultimate'?'supernova':'impact',{x:e.x,y:e.y,color:e.color,radius:e.radius});
      for(const u of this.combatUnits.filter(u=>!u.dead&&dist(u,e)<e.radius&&(!e.source||u.team!==e.source.team)))this.damage(u,e.damage*(u.boss?0.9:1),e.source,{ability:true,color:e.color});
    }}
    for(const u of this.combatUnits){if(u.dead)continue;
      if(u.burnTime>0){u.burnTime-=dt;u.hp-=u.burn*dt*(1+this.modifiers().burn);if(u.hp<=0)this.kill(u,null);if(Math.random()<dt*6)this.fx('ember',{x:u.x,y:u.y,color:'#ff835e'});}
      u.slow=Math.max(0,u.slow-dt);u.castPause=Math.max(0,u.castPause-dt);
      u.mana=Math.min(u.maxMana,u.mana+(10+(u.team==='ally'?(this.modifiers().mana*10+this.traitTier('Arcane')*4):0))*dt*(this.roundStage.kind==='mana'?1.65:1));
      if(u.castPause>0)continue;
      if(u.mana>=u.maxMana){u.mana=0;u.castPause=.26;this.ability(u);continue;}
      const opponent=this.nearest(u,u.team==='ally'?'enemy':'ally');if(!opponent)continue;
      const d=dist(u,opponent);
      if(d>u.range){const pace=(u.team==='enemy'?90:104)*(u.slow>0?.55:1)*(this.roundStage.kind==='haste'?1.35:1);
        const step=Math.min(d-u.range,pace*dt);u.x+=((opponent.x-u.x)/d)*step;u.y+=((opponent.y-u.y)/d)*step;
      }
      u.attackCd-=dt*(this.roundStage.kind==='haste'?1.4:1);
      if(d<=u.range+16&&u.attackCd<=0){u.attackCd=1/Math.max(.5,u.speed);u.attackCount++;
        if(u.range>100)this.spawnProjectile(u,opponent,u.atk,{color:u.color});
        else {this.fx('slash',{x:opponent.x,y:opponent.y,color:u.color});this.damage(opponent,u.atk,u);}
        u.mana=Math.min(u.maxMana,u.mana+13);
      }
    }
    for(let i=this.projectiles.length-1;i>=0;i--){const p=this.projectiles[i];p.life-=dt;
      if(p.target.dead||p.life<=0){this.projectiles.splice(i,1);continue;}
      const d=Math.hypot(p.target.x-p.x,p.target.y-p.y),s=p.speed*dt;
      if(d<=s+16){this.damage(p.target,p.damage,p.source,{ability:p.ability,color:p.color});this.projectiles.splice(i,1);}
      else {p.x+=(p.target.x-p.x)/d*s;p.y+=(p.target.y-p.y)/d*s;}
    }
    const allies=this.living('ally'),enemies=this.living('enemy');
    if(!allies.length||!enemies.length||this.combatTime>48){
      let won=!!allies.length;if(allies.length&&enemies.length)won=allies.reduce((a,u)=>a+u.hp/u.maxHp,0)>enemies.reduce((a,u)=>a+u.hp/u.maxHp,0);
      this.finish(won);
    }
  }
  finish(won){if(this.phase!=='combat')return;
    this.phase='result';this.result={won,round:this.round,reward:won?6+Math.min(3,Math.floor(this.gold/10))+this.modifiers().gold:3};
    this.gold+=this.result.reward;
    if(won)this.streak++;else{this.streak=0;this.lives--;}
    this.saveBest();
    if(this.round%2===0&&won){this.relicChoices=RELICS.filter(r=>!this.relics.includes(r.id)).sort(()=>Math.random()-.5).slice(0,3);}
    this.fx('banner',{text:won?'VICTORY!':'SQUAD DEFEATED',color:won?'#b7ffe7':'#ff8a96'});
    this.onFinish(this.result);this.changed();
  }
  claimRelic(id){if(this.phase!=='result'||!this.relicChoices.some(r=>r.id===id))return false;
    this.relics.push(id);this.relicChoices=[];this.changed();return true;
  }
  nextRound(){if(this.phase!=='result'||this.relicChoices.length)return false;
    if(this.lives<=0||this.round>=30){this.phase='over';this.changed();return false;}
    this.round++;this.roundStage=stageFor(this.round);
    this.phase='prep';this.projectiles=[];this.delayed=[];this.energy=0;this.combatUnits=[];
    this.freeRerolls=this.modifiers().reroll;if(!this.shopLocked)this.rollShop(true);
    this.makeEnemy();this.changed();return true;
  }
  freeReroll(){if(!this.freeRerolls)return false;this.freeRerolls--;return this.rollShop(true);}
}