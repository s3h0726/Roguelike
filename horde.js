/* CHAOS EDEN HORDE — independent simultaneous enemy HP, AI, and collision combat.
   Original RPG handles equipment, skills, progression, missions, boss selection, save,
   wave rewards, and prestige. This adapter implements the live multi-enemy arena. */
(()=>{
  'use strict';
  const TAU=Math.PI*2, W=900, H=560;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const rand=(a,b)=>a+Math.random()*(b-a);
  const finite=(n,f=0)=>Number.isFinite(Number(n))?Number(n):f;
  const hero={x:450,y:290,r:19,vx:0,vy:0,heading:-Math.PI/2,dashUntil:0,dashReady:0};
  let actors=[],waveSeq=0,gameTime=0,autoTimer=0,deathLocked=false,castMode=null;
  const listeners=new Set();
  const emit=(type,data={})=>{for(const fn of listeners){try{fn(type,data);}catch(e){console.warn('VFX handler',e);}}};
  const alive=()=>actors.filter(a=>a.hp>0);
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const enemyPalette=(data={},isBoss=false)=>{
    const s=String(data.element||'')+' '+String(data.trait||'')+' '+String(data.mechanic||'');
    if(/화염|불|태양|용암|burn/i.test(s))return '#ff884e';
    if(/얼음|냉기|서리|freeze/i.test(s))return '#7ddfff';
    if(/번개|전기|감전|shock/i.test(s))return '#ffe576';
    if(/독|숲|자연|poison/i.test(s))return '#72eab2';
    if(/공허|암흑|언데드|저주|void/i.test(s))return '#b58aff';
    return isBoss?'#ff568c':'#83aeff';
  };
  const randLocation=()=>{
    const angle=rand(0,TAU),radius=rand(205,295);
    return {x:clamp(hero.x+Math.cos(angle)*radius,42,W-42),y:clamp(hero.y+Math.sin(angle)*radius,118,H-50)};
  };
  function spawnWave(){
    if(!state?.enemy)return;
    const boss=!!state.boss;
    waveSeq++;
    const stage=finite(state.stage,1);
    const number=boss?Math.min(7,4+Math.floor(stage/12)):clamp(7+Math.floor(stage/5)+(state.field!=='normal'?2:0)+(state.towerMode?2:0),7,18);
    const captain=state.enemy,baseHp=Math.max(1,finite(state.enemyMaxHp,1));
    const totalShield=Math.max(0,finite(state.enemyFortifiedHp,0));
    const pool=state.towerMode?(regionFields?.[currentNormalRegionKey()]?.pool||[]):(state.field==='normal'?(currentNormalRegion()?.pool||[]):(fields[state.field]?.pool||[]));
    actors=[];
    const first=Math.random()*TAU;
    for(let i=0;i<number;i++){
      const datum=i===0?captain:(pool.length?pool[(Math.floor(Math.random()*pool.length))]:captain);
      const isBoss=boss && i===0;
      const fraction=boss?(isBoss?1:.06):.85/Math.sqrt(number);
      const maxHp=Math.max(12+Math.floor(stage*1.4),Math.floor(baseHp*fraction*(i>0?rand(.78,1.22):1)));
      const maxShield=Math.max(0,Math.floor(totalShield*(boss?(isBoss?.85:.15/(number-1)):1/number)));
      const angle=first+(i/number)*TAU;
      const radius=rand(195,290);
      const x=clamp(hero.x+Math.cos(angle)*radius,47,W-47);
      const y=clamp(hero.y+Math.sin(angle)*radius,117,H-55);
      actors.push({id:`${waveSeq}-${i}`,x,y,r:isBoss?47:datum.grade==='정예'?24:rand(14,20),
        name:String(datum.name||'몬스터'),type:datum, boss:isBoss, elite:datum.grade==='정예',
        hp:maxHp,maxHp,shield:maxShield,maxShield,
        atk:Math.max(1,Math.floor(finite(state.enemyAtk,3)*(isBoss?.48:.19)*(i>0?rand(.72,1.07):1))),
        speed:isBoss?34:rand(36,57)*(datum.grade==='정예'?.84:1),
        attackAt:gameTime+rand(1.2,2.4),skillAt:gameTime+rand(3.5,5),
        color:enemyPalette(datum,isBoss),flash:0,angle:rand(0,TAU)});
    }
    deathLocked=false;autoTimer=0;syncEnemyHp();
    emit('wave',{actors,number,boss,stage});
  }
  function syncEnemyHp(){
    if(!state||!actors.length)return;
    const total=actors.reduce((s,a)=>s+Math.max(0,a.hp+a.shield),0);
    const max=actors.reduce((s,a)=>s+a.maxHp+a.maxShield,0)||1;
    state.enemyHp=total<=0?0:Math.max(1,Math.floor(state.enemyMaxHp*total/max));
    state.enemyDefeatedPending=total<=0;
    state.enemyFortifiedHp=actors.reduce((s,a)=>s+Math.max(0,a.shield),0);
    state.enemyFortifiedMax=actors.reduce((s,a)=>s+a.maxShield,0);
  }
  function nearest(from=hero,range=380){
    let chosen=null,best=range;
    for(const a of actors){if(a.hp<=0)continue;const d=distance(a,from);if(d<best){chosen=a;best=d;}}
    return chosen;
  }
  const old={
    startLoops,spawnEnemy,spawnTowerEnemy,dealEnemyDamage,resolveEnemyDefeat,
    hit,applySkillEffect,createShot,createSkillFx,createSparkBurst,createShockwave,
    createScreenFlash,createFloat,renderBattle,applyPlayerDamageMultiHit,
    handlePlayerDefeat
  };
  function damageOne(a,raw,critical=false){
    if(!a||a.hp<=0||deathLocked)return 0;
    let amount=Math.max(0,Math.floor(finite(raw)));
    if(amount<=0)return 0;
    const shieldHit=Math.min(a.shield,amount);a.shield-=shieldHit;amount-=shieldHit;
    const hpHit=Math.min(a.hp,amount);a.hp-=hpHit;
    a.flash=.32;
    emit('hit',{actor:a,amount:shieldHit+hpHit,critical});
    if(a.hp<=0){a.hp=0;emit('death',{actor:a});
      // Small per-minion reward, plus the normal original full-wave reward when all die.
      if(!a.boss&&!state.boss){state.gold+=Math.max(1,Math.floor(1+state.stage*.65));}
    }
    return shieldHit+hpHit;
  }
  function damage(raw,opts={}){
    if(deathLocked||!actors.length)return 0;
    const context=opts.mode||castMode;
    const p=opts.center||hero;
    let applied=0;
    if(context==='area'){
      const radius=opts.radius||210;
      let targets=actors.filter(a=>a.hp>0&&distance(a,p)<radius+a.r);
      if(!targets.length){const center=nearest(hero,375);if(center)targets=actors.filter(a=>a.hp>0&&distance(a,center)<radius);}
      for(const a of targets)applied+=damageOne(a,raw,opts.critical);
    }else{
      const target=opts.target||nearest(hero,opts.range||390);
      if(target)applied=damageOne(target,raw,opts.critical);
    }
    syncEnemyHp();
    return applied;
  }
  dealEnemyDamage=function(amount){return damage(amount);};
  resolveEnemyDefeat=function(){
    if(deathLocked||!actors.length||alive().length>0)return false;
    syncEnemyHp();deathLocked=true;
    const done=old.resolveEnemyDefeat();
    if(!done){deathLocked=false;return false;}
    return true;
  };
  function forceWaveCheck(){if(actors.length&&!alive().length)resolveEnemyDefeat();}
  hit=function(mult=1,fromSkill=false){
    // Actual proximity targeting replaces the original anywhere-on-screen attacks.
    if(!nearest(hero,fromSkill?490:385)||state.hp<=0)return;
    return old.hit(mult,fromSkill);
  };
  applySkillEffect=function(skill,level){
    if(!skill)return;
    const originalMode=castMode;
    if(skill.type==='aoe')castMode='area';
    emit('skill',{skill,level,center:{...hero},target:nearest(hero,460),actors:alive()});
    let result;
    try{result=old.applySkillEffect(skill,level);}finally{castMode=originalMode;}
    if(skill.type==='debuff'){
      for(const a of actors)if(a.hp>0)a.slowUntil=gameTime+3.8;
    }
    return result;
  };
  createShot=function(critical=false){emit('shot',{actor:nearest(hero,490),critical,from:{...hero}});};
  createSkillFx=function(type){emit('generic',{type});};
  createSparkBurst=function(type,count){emit('sparks',{type,count:Math.min(count,75),target:nearest(hero,470)});};
  createShockwave=function(type){emit('shockwave',{type});};
  createScreenFlash=function(type){emit('flash',{type});};
  createFloat=function(msg,cls=''){emit('text',{msg:String(msg),cls,target:cls==='bad'?hero:nearest(hero,470)});};
  renderBattle=function(){
    old.renderBattle();
    const arena=document.getElementById('arena');if(arena)arena.classList.add('chaos-arena');
    const count=alive().length;
    const name=document.getElementById('enemyName');if(name)name.textContent=state.boss?`⚠ 보스 + 부하 ${Math.max(0,count-1)}마리`:`⚔ 현재 몬스터 ${count}마리`;
    const hp=document.getElementById('enemyHpText');if(hp&&actors.length)hp.textContent=`웨이브 체력 ${fmt(actors.reduce((s,a)=>s+a.hp+a.shield,0))} · ${count}마리 생존`;
    const gauge=document.getElementById('enemyHpBar');if(gauge&&actors.length){
      const max=actors.reduce((s,a)=>s+a.maxHp+a.maxShield,0)||1;
      gauge.style.width=(100*actors.reduce((s,a)=>s+a.hp+a.shield,0)/max)+'%';
    }
  };
  // Preserve original cooldown timer, but disable the old single-target attack loops.
  startLoops=function(){
    old.startLoops();clearInterval(attackTimer);clearInterval(enemyTimer);
    attackTimer=null;enemyTimer=null;
  };
  let spawning=false;
  spawnEnemy=function(){
    spawning=true;
    try{old.spawnEnemy();}finally{spawning=false;}
    spawnWave();
  };
  spawnTowerEnemy=function(){
    old.spawnTowerEnemy();
    if(!spawning)spawnWave();
  };
  function hurtHero(a){
    if(state.hp<=0||gameTime<hero.dashUntil)return;
    let raw=Math.max(1,a.atk);
    if(state.debuff>0)raw=Math.max(1,Math.floor(raw*.7));
    raw=Math.min(raw,Math.max(2,Math.floor(getMaxHp()*(a.boss?.13:.065))));
    const hpBefore=state.hp;
    old.applyPlayerDamageMultiHit(raw,1,'');
    const taken=Math.max(0,hpBefore-state.hp);
    emit('enemyStrike',{actor:a,hero:{...hero},damage:taken});
    mobMechanic(a);
    if(state.hp<=0){state.hp=0;old.handlePlayerDefeat();}
    else if(typeof tryAutoHeal==='function')tryAutoHeal();
  }
  let lastRender=0,lastBossPhase=0;
  function mobMechanic(a){
    const mechanic=a.type?.mechanic||'none';
    if(['poison','strongPoison','burn','bleed','poisonField'].includes(mechanic)){
      const extra=Math.max(1,Math.floor(getMaxHp()*.008));
      state.hp=Math.max(0,state.hp-extra);emit('text',{msg:mechanic==='burn'?'화상':'지속 피해',cls:'bad',target:hero});
    }
    if(['slow','cooldownUp','bind','fear','skillDisrupt','timeDelay','skillSeal'].includes(mechanic) && Math.random()<.22){
      state.skillCooldowns=state.skillCooldowns.map(t=>(t||0)+1);emit('text',{msg:'행동 지연',cls:'bad',target:hero});
    }
    if(['regen','bossRegen','overgrowth'].includes(mechanic)){
      a.hp=Math.min(a.maxHp,a.hp+Math.max(1,Math.floor(a.maxHp*.02)));
      emit('text',{msg:'재생',cls:'heal',target:a});syncEnemyHp();
    }
    if(['shield','barrierShield','voidForge'].includes(mechanic)&&a.maxShield>0){
      a.shield=Math.min(a.maxShield,a.shield+Math.max(1,Math.floor(a.maxShield*.06)));syncEnemyHp();
    }
  }

  function update(dt,time){
    gameTime=time;
    if(!state||state.hp<=0||!actors.length)return;
    if(autoOn){autoTimer+=dt*1000;
      const interval=Math.max(150,attackInterval());
      if(autoTimer>=interval){autoTimer%=interval;if(nearest(hero,385))hit(1,false);}
    }else autoTimer=0;
    if(state.boss&&time-lastBossPhase>1){lastBossPhase=time;updateBossPhase();}
    const living=alive();
    for(const a of living){
      const dx=hero.x-a.x,dy=hero.y-a.y,d=Math.max(.1,Math.hypot(dx,dy));
      if(d>hero.r+a.r+4){
        let speed=a.speed*dt*(a.slowUntil>time?.45:1);
        if(a.boss&&d<145)speed*=.3;
        a.x+=dx/d*speed;a.y+=dy/d*speed;
      }
      for(const b of living){if(a===b)continue;
        const ox=a.x-b.x,oy=a.y-b.y,dd=Math.hypot(ox,oy)||1,desired=a.r+b.r+5;
        if(dd<desired){a.x+=ox/dd*(desired-dd)*.11*dt*60;a.y+=oy/dd*(desired-dd)*.11*dt*60;}
      }
      a.x=clamp(a.x,a.r+10,W-a.r-10);a.y=clamp(a.y,118+a.r,H-a.r-12);
      a.flash=Math.max(0,a.flash-dt*2.5);a.angle+=dt;
      const reach=a.boss?135:hero.r+a.r+11;
      if(d<reach&&time>=a.attackAt){a.attackAt=time+(a.boss?1.95:rand(1.25,1.95));hurtHero(a);}
      if(a.boss&&time>=a.skillAt){a.skillAt=time+rand(5.2,6.8);emit('bossCast',{actor:a,hero:{...hero}});mobMechanic(a);
        if(d<230&&time>hero.dashUntil)hurtHero(a);
      }
    }
    if(time-lastRender>.12){lastRender=time;renderBattle();}
  }
  function burst(){
    if(!state?.enemy||state.hp<=0)return {ok:false,reason:'전투 불가'};
    if(gameTime<(burst.cooldown||0))return {ok:false,reason:'재사용 대기 중'};
    const cost=25;if(state.mp<cost)return {ok:false,reason:'마나 부족'};
    state.mp-=cost;burst.cooldown=gameTime+12;
    const damageAmount=Math.max(1,Math.floor(baseDamage()*(2.4+Math.min(2,finite(state.grade)*.16))));
    const count=alive().length;
    const result=damage(damageAmount,{mode:'area',center:hero,radius:500});
    emit('ultimate',{hero:{...hero},actors:alive(),damage:result,hitCount:count});
    forceWaveCheck();renderBattle();saveGame();
    return {ok:true,hitCount:count,damage:result};
  }
  startLoops();spawnWave();renderBattle();
  window.ChaosHorde={hero,get actors(){return actors;},on:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},
    update,burst,nearest,damage,get time(){return gameTime;},get cooldown(){return Math.max(0,(burst.cooldown||0)-gameTime);},
    getStatus:()=>({actorCount:alive().length,total:actors.length,remainingHp:actors.reduce((s,a)=>s+a.hp+a.shield,0),boss:!!state.boss,field:state.field,stage:state.stage,kills:state.kills,hero:{x:hero.x,y:hero.y}})
  };
})();
