/* CHAOS EDEN — 2D Canvas battle effects connected to simultaneous Horde combat */
(() => {
  'use strict';
  const canvas = document.getElementById('chaosCanvas');
  const arena = document.getElementById('arena');
  if (!canvas || !arena || !window.requestAnimationFrame || !window.ChaosHorde) return;
  const ctx = canvas.getContext('2d', {alpha:false});
  if (!ctx) return;
  const W = 900, H = 560, TAU = Math.PI * 2;
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const rnd = (a,b) => a+Math.random()*(b-a);
  const dist = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
  const rgb = (hex,alpha=1) => {const h = hex.replace('#','');return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${alpha})`;};
  const pal = {
    damage:['#ffb14c','#ff582d','#ffe6a4'], aoe:['#ff54a4','#a55aff','#ffe37e'],
    critical:['#fff5c0','#ffca4e','#ff6e33'], heal:['#86ffd5','#2ed4a4','#ceffef'],
    dot:['#9dff68','#44c27a','#deffac'], debuff:['#aa85ff','#7141f5','#e0c9ff'],
    shield:['#64d8ff','#6395ff','#e6f6ff'], mana:['#4cf1ff','#6489ff','#f4fbff'],
    buff:['#fff080','#ffae4e','#ffffff'], drain:['#cf77ff','#ff5caa','#ffffff'],
    resource:['#ffe06d','#fff1b9','#a78bfa'], boss:['#ff4978','#9e38fc','#ffe3a2']
  };
  const themes = {
    meadow:['#061521','#183a39','#24e5bd'], forest:['#051b18','#153b2b','#67e89a'],
    cave:['#0d1326','#272642','#8aa7ff'], volcano:['#290b17','#5e2028','#ff964d'],
    snow:['#071b31','#13495d','#8be7ff'], desert:['#2a1b16','#614332','#ffc87c'],
    sea:['#06142b','#105073','#4fe4ff'], undead:['#170e28','#452047','#d792f7'],
    abyss:['#0b0730','#29145f','#a783ff'], time:['#221329','#49365c','#f8dc72'],
    bloodmoon:['#2b0b19','#66183e','#ff6485'], 'barrier-city':['#1d1032','#4b214f','#cc75ff'],
    gold:['#342017','#5b3b25','#ffcd6a'], mana:['#0b2339','#18456d','#57e3ff'],
    soul:['#200d40','#4c287a','#c59bff'], crystal:['#0b2932','#18556a','#80fded'],
    rune:['#241029','#551b58','#ee7dff']
  };

  const horde=window.ChaosHorde;
  const player=horde.hero;
  let keys=new Set(), joy={x:0,y:0}, pointers=new Set();
  let particles=[],effects=[],bolts=[],texts=[],quality='ULTRA',last=0,time=0,shake=0,combo=0,comboUntil=0,width=0,height=0,dpr=1,manualAt=0;
  const capacity=()=>quality==='ULTRA'?530:quality==='HIGH'?290:125;
  const num=n=>Number.isFinite(Number(n))?Number(n):0;
  const alive=()=>state?.hp>0 && horde.actors.some(a=>a.hp>0);
  const boss=()=>!!state?.boss;
  function spawnParticle(x,y,color,velocity=180,n=15,life=.55,kind='spark') {
    const count = Math.min(n,capacity()-particles.length);
    for(let i=0;i<count;i++){
      const angle = rnd(0,TAU), speed=rnd(velocity*.2,velocity);
      particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:rnd(life*.54,life),max:life,size:rnd(1.4,4.5),color,kind,spin:rnd(-5,5)});
    }
  }
  function orb(x,y,color,n=12,force=190,life=.65){spawnParticle(x,y,color,force,n,life);}
  function emit(kind,x,y,color,scale=1,duration=.7,extra={}) {
    if(effects.length > 65) effects.splice(0,10);
    effects.push({kind,x,y,color,r:1,t:0,life:duration,scale,phase:rnd(0,TAU),...extra});
  }
  function label(txt,x,y,color='#ffffff',font=17){
    if(texts.length>26)texts.shift();
    texts.push({text:String(txt),x,y,vy:-35,t:0,life:.88,color,font});
  }
  function fireBolt(from,to,color,isEnemy=false,strong=false){
    if(bolts.length>65) bolts.shift();
    bolts.push({from:{x:from.x,y:from.y},to:{x:to.x,y:to.y},x:from.x,y:from.y,color,t:0,life:strong?.26:.33,strong,isEnemy,tail:[]});
  }

  function skillFx(skill,lv,target){
    const type=skill?.type||'damage',colors=pal[type]||pal.damage,color=colors[0];
    const friendly=['heal','mana','shield','buff','resource'].includes(type);
    const pos=friendly?player:(type==='aoe'?player:(target||player));
    const x=pos.x,y=pos.y,strength=clamp(1+num(lv)/24+num(skill?.tier)/10,1,2.7);
    emit('sigil',x,y,color,strength,.94);
    emit('ring',x,y,colors[1],strength*.9,.72);
    orb(x,y,color,Math.round(16*strength),185*strength,.74);
    shake=Math.max(shake,type==='aoe'?8:3.2);
    if(type==='damage' && target){emit('slash',x,y,color,strength,.75);fireBolt(player,target,colors[2],false,true);}
    if(type==='aoe'){
      emit('ultimate',x,y,'#ff72d5',.86,1.12);
      for(const a of horde.actors)if(a.hp>0 && dist(player,a)<255){emit('meteor',a.x,a.y,colors[1],.58*strength,1.05);}
      emit('nova',x,y,'#ffacb6',1.4,.85);
    }
    if(type==='dot')emit('void',x,y,colors[1],strength,.95);
    if(type==='debuff')emit('chain',x,y,'#9cbbff',strength,.8);
    if(type==='drain'&&target){emit('void',x,y,colors[1],strength,.9);fireBolt(target,player,colors[0],false,true);}
    if(type==='shield')emit('shield',x,y,color,strength,1.2);
    if(type==='mana'||type==='buff')emit('rays',x,y,color,strength,1.1);
    if(type==='heal'||type==='resource')emit('bloom',x,y,color,strength,1.0);
    const name=String(skill?.name||'');
    if(/번개|전격|뇌전|라이트닝|천둥/.test(name))emit('chain',x,y,'#8ae9ff',1.2*strength,1.05);
    if(/시간|시공|크로노/.test(name))emit('clock',x,y,'#a5f3fc',strength,1.1);
    if(/빙결|서리|냉기|얼음/.test(name))emit('ice',x,y,'#a7ddff',strength,1.05);
    if(/화염|불|태양|폭발/.test(name))emit('meteor',x,y,'#ff9e63',strength,1.05);
    label(name.slice(0,18),x,y-46,color,13);
  }
  horde.on((type,d)=>{
    if(type==='wave'){
      for(const a of d.actors){emit('spawn',a.x,a.y,a.color,a.boss?1.1:.42,.85);orb(a.x,a.y,a.color,a.boss?25:7,110,.55);}
      if(d.boss){shake=10;label('⚠ 보스 + 부하 출현',player.x,135,'#ffe7c7',22);}
      else label(`웨이브 시작 · ${d.number}마리`,player.x,139,'#bfeeff',18);
    }
    else if(type==='shot'){
      if(d.actor){fireBolt(d.from,d.actor,d.critical?'#ffec8b':'#86e7ff',false,d.critical);}
      emit('muzzle',player.x,player.y,d.critical?'#fff0aa':'#87eaff',.56,.18);
      combo=time<comboUntil?Math.min(999,combo+1):1;comboUntil=time+2.6;
    }
    else if(type==='hit'){
      const a=d.actor;orb(a.x,a.y,d.critical?'#fff4a4':a.color,d.critical?15:6,d.critical?185:115,.38);
      emit('hit',a.x,a.y,d.critical?'#fff1a6':a.color,d.critical?.8:.38,.27);
      if(d.amount>0)label((d.critical?'★ ':'')+fmt(d.amount),a.x+rnd(-10,10),a.y-a.r-9,d.critical?'#ffe994':'#f0f4ff',d.critical?16:12);
    }
    else if(type==='death'){
      emit('nova',d.actor.x,d.actor.y,d.actor.color,d.actor.boss?2.1:.72,d.actor.boss?1.2:.65);
      orb(d.actor.x,d.actor.y,d.actor.color,d.actor.boss?80:21,d.actor.boss?330:195,d.actor.boss?1.3:.72);
      shake=Math.max(shake,d.actor.boss?14:3);
    }
    else if(type==='skill')skillFx(d.skill,d.level,d.target);
    else if(type==='ultimate'){
      emit('ultimate',player.x,player.y,'#ee88ff',2.35,1.9);
      emit('sigil',player.x,player.y,'#f4c1ff',2.7,1.9);
      emit('nova',player.x,player.y,'#ffb1dd',3.3,1.3);
      emit('chain',player.x,player.y,'#baabff',2.6,1.2);
      for(const a of horde.actors){if(a.hp>0 || a.flash>0){emit('meteor',a.x,a.y,a.color,1.1,1.1);}}
      orb(player.x,player.y,'#ed85ff',Math.min(capacity()/3,125),390,1.3);
      label('CHAOS CATACLYSM',player.x,player.y-126,'#fff0fc',27);
      shake=20;
    }
    else if(type==='enemyStrike'){
      fireBolt(d.actor,player,'#ff687a',true,d.actor.boss);
      if(d.damage>0){emit('hit',player.x,player.y,'#ff526e',.75,.35);orb(player.x,player.y,'#ff7996',13,90,.3);shake=Math.max(shake,4);}
    }
    else if(type==='bossCast'){
      emit('chain',d.actor.x,d.actor.y,'#ff65a9',1.55,1.1);
      emit('ring',player.x,player.y,'#ff5777',1.8,.85);
      label('보스 특수 공격',d.actor.x,d.actor.y-80,'#ffbfc2',15);
    }
    else if(type==='text'){
      const dest=d.target||player;
      label(d.msg,dest.x,dest.y-35,d.cls==='bad'?'#ff9aa7':d.cls==='heal'?'#9effc1':'#f7d69a',12);
    }
    else if(type==='sparks'){const t=d.target||player;orb(t.x,t.y,(pal[d.type]||pal.damage)[0],d.count||12,230,.72);}
    else if(type==='shockwave'){emit('ring',player.x,player.y,(pal[d.type]||pal.damage)[0],1.3,.55);}
    else if(type==='flash'){shake=Math.max(shake,6);}
  });
  const burstBtn=document.getElementById('chaosBurstBtn');
  function castBurst(){const result=horde.burst();if(!result.ok){label(result.reason,player.x,player.y-45,'#ffaaa6',16);} }
  burstBtn?.addEventListener('click',castBurst);
  const qbtn=document.getElementById('chaosFxBtn');
  try{const stored=localStorage.getItem('artifactChaosFxQuality');if(['ULTRA','HIGH','LITE'].includes(stored))quality=stored;}catch{}
  function syncQuality(){if(qbtn)qbtn.textContent='✨ '+quality;}
  syncQuality();qbtn?.addEventListener('click',()=>{quality=quality==='ULTRA'?'HIGH':quality==='HIGH'?'LITE':'ULTRA';syncQuality();try{localStorage.setItem('artifactChaosFxQuality',quality);}catch{}});
  const validKey=e=>!['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)&&!e.ctrlKey&&!e.altKey&&!e.metaKey;
  window.addEventListener('keydown',e=>{
    if(!validKey(e))return;
    const k=e.key.toLowerCase();
    if(['w','a','s','d','arrowup','arrowleft','arrowdown','arrowright','shift','r','1','2','3'].includes(k))e.preventDefault();
    keys.add(k);
    if(k==='r'&&!e.repeat)castBurst();
    if(k==='shift'&&!e.repeat)dash();
    if(['1','2','3'].includes(k)&&!e.repeat)useSkillSlot(Number(k)-1);
  });
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur',()=>{keys.clear();joy={x:0,y:0};});
  const joystick=document.getElementById('chaosJoystick'),knob=document.getElementById('chaosKnob');
  function updateJoystick(e){const r=joystick.getBoundingClientRect(),mx=r.left+r.width/2,my=r.top+r.height/2;const dx=e.clientX-mx,dy=e.clientY-my,len=Math.hypot(dx,dy),v=Math.min(1,len/30);joy={x:len?dx/len*v:0,y:len?dy/len*v:0};if(knob)knob.style.transform=`translate(${joy.x*24}px,${joy.y*24}px)`;}
  if(joystick){
    joystick.addEventListener('pointerdown',e=>{joystick.setPointerCapture(e.pointerId);pointers.add(e.pointerId);updateJoystick(e);});
    joystick.addEventListener('pointermove',e=>{if(pointers.has(e.pointerId))updateJoystick(e);});
    const stop=e=>{pointers.delete(e.pointerId);joy={x:0,y:0};if(knob)knob.style.transform='';};
    joystick.addEventListener('pointerup',stop);joystick.addEventListener('pointercancel',stop);
    joystick.addEventListener('dblclick',e=>{e.preventDefault();dash();});
  }
  document.getElementById('chaosDashBtn')?.addEventListener('click',dash);
  document.getElementById('chaosAttackBtn')?.addEventListener('click',manualAttack);
  canvas.addEventListener('pointerdown',manualAttack);
  function manualAttack(){if(!alive()||time-manualAt<.21)return;manualAt=time;hit(1,false);}
  function dash(){
    if(!alive()||time<player.dashReady)return;
    let dx=player.vx,dy=player.vy,len=Math.hypot(dx,dy);
    if(len<.05){dx=Math.cos(player.heading);dy=Math.sin(player.heading);len=1;}
    player.x=clamp(player.x+dx/len*112,45,W-45);player.y=clamp(player.y+dy/len*112,121,H-52);
    player.dashUntil=time+.42;player.dashReady=time+3.5;
    emit('dash',player.x,player.y,'#beedff',1.3,.55);orb(player.x,player.y,'#93caff',33,210,.5);
  }
  const stars=Array.from({length:90},()=>({x:rnd(0,W),y:rnd(0,H),s:rnd(.45,1.75),seed:rnd(0,TAU)}));
  function theme(){
    const a=arena.className.split(/\s+/).find(x=>themes[x]);
    return themes[a]||themes.meadow;
  }
  function glow(x,y,r,color,a=1){
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,rgb(color,a*.6));g.addColorStop(.38,rgb(color,a*.2));g.addColorStop(1,rgb(color,0));
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  function line(points,color,w=2,blur=12){
    ctx.strokeStyle=color;ctx.lineWidth=w;ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.shadowBlur=0;
  }
  function ring(x,y,r,color,width=2,angle=0,start=0,end=TAU){
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.arc(x,y,r,start+angle,end+angle);ctx.stroke();
  }
  function glyph(x,y,r,color,rot=0,alpha=1){
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha*=alpha;
    ring(0,0,r,color,2);ring(0,0,r*.77,color,1.2);
    for(let i=0;i<12;i++){
      const a=i*TAU/12,xx=Math.cos(a)*r*.89, yy=Math.sin(a)*r*.89;
      ctx.save();ctx.translate(xx,yy);ctx.rotate(a+Math.PI/2);ctx.strokeStyle=color;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(0,4);ctx.lineTo(4,-5);ctx.stroke();ctx.restore();
    }
    for(let i=0;i<6;i++){
      const a=i*TAU/6;ring(Math.cos(a)*r*.42,Math.sin(a)*r*.42,r*.07,color,1);
    }
    ctx.restore();
  }
  function background(){
    const [dark,mid,accent]=theme();
    let gr=ctx.createLinearGradient(0,0,W,H);
    gr.addColorStop(0,dark);gr.addColorStop(.65,mid);gr.addColorStop(1,'#040918');
    ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
    glow(660,220,320,accent,.22);glow(220,405,230,'#7461ec',.18);
    const size=54;
    ctx.strokeStyle=rgb(accent,.085);ctx.lineWidth=1;
    for(let i=-1;i<=W/size+1;i++){
      const x=i*size+(time*6)%size;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
    }
    for(let j=-1;j<=H/size+1;j++){
      const y=j*size+(time*4)%size;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    }
    ctx.save();ctx.globalAlpha=.15;
    glyph(690,285,190,accent,time*.055,.28);
    glyph(185,410,120,'#95a2ff',-time*.08,.2);
    ctx.restore();
    stars.forEach(s=>{
      ctx.globalAlpha=.2+.24*(.5+.5*Math.sin(time+s.seed));ctx.fillStyle='#b6d1ff';ctx.fillRect(s.x,s.y,s.s,s.s);
    });ctx.globalAlpha=1;
    // Ground decals make the scene read as top-down rather than two static face-to-face cards.
    for(const obj of [player,...ChaosHorde.actors.filter(a=>a.hp>0).slice(0,12)]){
      ctx.save();ctx.translate(obj.x,obj.y+obj.r*.83);ctx.scale(1,.35);
      glow(0,0,70,'#020211',.76);ring(0,0,obj.r*1.9,rgb(accent,.42),1.5);
      ctx.restore();
    }
  }
  function drawHero(){
    const x=player.x,y=player.y;
    glow(x,y,74,time<player.dashUntil?'#fff0ff':'#6d9eff',.58);
    ctx.save();ctx.translate(x,y);
    ring(0,0,37,'#82eaff7c',2,time*.4);
    for(let k=0;k<4;k++){
      const a=time*1.3+k*TAU/4;
      glow(Math.cos(a)*39,Math.sin(a)*39,11,'#a9dcff',.48);
    }
    // Hood, cape, visor — tactical top-down mage silhouette.
    ctx.rotate(player.heading+Math.PI/2);
    ctx.fillStyle='#10123f';ctx.strokeStyle='#9dabff';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(0,35);ctx.lineTo(-25,15);ctx.lineTo(-19,-14);ctx.quadraticCurveTo(0,-33,19,-14);ctx.lineTo(25,15);ctx.closePath();ctx.fill();ctx.stroke();
    const body=ctx.createRadialGradient(-5,-10,3,0,3,29);
    body.addColorStop(0,'#d8f5ff');body.addColorStop(.45,'#5c72ce');body.addColorStop(1,'#30215e');
    ctx.fillStyle=body;ctx.beginPath();ctx.arc(0,-4,20,0,TAU);ctx.fill();
    ctx.fillStyle='#90eeff';ctx.fillRect(-9,-16,18,5);
    ctx.fillStyle='#fff0c3';ctx.beginPath();ctx.arc(0,4,7,0,TAU);ctx.fill();
    ctx.restore();
    if(state?.shield>0){ring(x,y,47,'#85dcffb0',2,time*.3);glow(x,y,54,'#45bfff',.13);}
    if(time<player.dashUntil)glyph(x,y,44,'#fcffff',time*7,.75);
    ctx.textAlign='center';ctx.font='bold 13px system-ui';ctx.fillStyle='#dce7ff';ctx.fillText('유물술사',x,y-43);
    ctx.fillStyle='#17213e';ctx.fillRect(x-24,y+37,48,5);
    ctx.fillStyle='#5af3ab';ctx.fillRect(x-24,y+37,48*clamp(num(state?.hp)/Math.max(1,getMaxHp()),0,1),5);
  }

  function drawEnemies(){
    const living=horde.actors.filter(a=>a.hp>0);
    for(const a of living){
      const {x,y,r,color:c}=a;
      if(a.boss){
        glow(x,y,r*3.1,c,.65);
        glyph(x,y,r*1.65,c,-time*.35,.65);
        ring(x,y,r*1.98,rgb(c,.5),2,time*.2,.2,Math.PI*1.66);
      }else glow(x,y,r*2.5,c,.36);
      ctx.save();ctx.translate(x,y);ctx.rotate(a.boss?Math.sin(time)*.05:time*.25+a.angle*.1);
      ctx.fillStyle='#110f2b';ctx.strokeStyle=c;ctx.lineWidth=a.boss?3.5:2.2;
      ctx.beginPath();let corners=a.boss?10:a.elite?7:6;
      for(let i=0;i<corners;i++){
        const angle=-Math.PI/2+i*TAU/corners;
        const rr=r*(i%2&&a.boss?1.09:1);
        if(!i)ctx.moveTo(Math.cos(angle)*rr,Math.sin(angle)*rr);else ctx.lineTo(Math.cos(angle)*rr,Math.sin(angle)*rr);
      }
      ctx.closePath();ctx.fill();ctx.stroke();
      let g=ctx.createRadialGradient(-r*.23,-r*.28,1,0,0,r);g.addColorStop(0,'#fff');g.addColorStop(.22,c);g.addColorStop(1,'#11112d');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*.7,0,TAU);ctx.fill();
      ctx.strokeStyle='#f9f6ff';ctx.lineWidth=a.boss?3:1.5;
      ctx.beginPath();ctx.moveTo(-r*.38,-r*.13);ctx.lineTo(-r*.06,-r*.02);ctx.moveTo(r*.38,-r*.13);ctx.lineTo(r*.06,-r*.02);ctx.stroke();
      ctx.restore();
      if(a.flash>0)glow(x,y,r*1.55,'#fff8dd',a.flash*.75);
      ctx.fillStyle='#070b1d';ctx.fillRect(x-r-2,y+r+9,2*r+4,5);
      ctx.fillStyle=c;ctx.fillRect(x-r-2,y+r+9,(2*r+4)*clamp(a.hp/a.maxHp,0,1),5);
      if(a.shield>0){ctx.fillStyle='#ffde8b';ctx.fillRect(x-r-2,y+r+5,(2*r+4)*clamp(a.shield/Math.max(1,a.maxShield),0,1),3);}
      if(a.boss||a.elite){
        ctx.font=`${a.boss?'bold 15px':'bold 11px'} system-ui`;ctx.textAlign='center';ctx.fillStyle='#e8edff';ctx.shadowColor='#060619';ctx.shadowBlur=8;
        ctx.fillText(a.name.slice(0,a.boss?20:9),x,y-r-16);ctx.shadowBlur=0;
      }
    }
  }
  function drawBolt(b){
    const q=clamp(b.t/b.life,0,1);
    const ease=q*q*(3-2*q);
    const x=b.from.x+(b.to.x-b.from.x)*ease, y=b.from.y+(b.to.y-b.from.y)*ease;
    const angle=Math.atan2(b.to.y-b.from.y,b.to.x-b.from.x);
    const tail=32+(b.strong?29:0);
    const start={x:x-Math.cos(angle)*tail,y:y-Math.sin(angle)*tail};
    line([start,{x,y}],b.color,b.strong?7:3,b.strong?20:12);
    glow(x,y,b.strong?26:16,b.color,.9);
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,b.strong?4:2.4,0,TAU);ctx.fill();
  }
  function drawEffect(e){
    const p=clamp(e.t/e.life,0,1),a=1-p,s=e.scale,x=e.x,y=e.y;
    ctx.globalAlpha*=a;
    switch(e.kind){
      case 'sigil':case 'spawn':case 'clock':case 'ultimate':{
        const r=(e.kind==='ultimate'?113:e.kind==='clock'?89:69)*s;
        glyph(x,y,r,e.color,time*(e.kind==='clock'?-1.5:.7),.9);
        ring(x,y,r*1.12,e.color,3,time*.4,p*TAU,p*TAU+Math.PI*1.48);
        glow(x,y,r*.6,e.color,.25);
        if(e.kind==='clock'){
          line([{x,y},{x:x+Math.cos(time*2)*r*.66,y:y+Math.sin(time*2)*r*.66}],e.color,3);
          line([{x,y},{x:x+Math.cos(-time*.7)*r*.44,y:y+Math.sin(-time*.7)*r*.44}],e.color,4);
        }
        if(e.kind==='ultimate'){
          ctx.globalAlpha*=.9;glow(x,y,220*e.scale,'#ff8cff',.7);
          for(let i=0;i<10;i++){
            const ang=i*TAU/10+time;
            line([{x:x+Math.cos(ang)*18,y:y+Math.sin(ang)*18},{x:x+Math.cos(ang)*240,y:y+Math.sin(ang)*240}],rgb('#ff91e9',.48),4,14);
          }
        }
        break;
      }
      case 'ring':case 'nova':case 'dash':case 'hit':case 'muzzle':{
        const r=(e.kind==='nova'?165:e.kind==='ring'?100:45)*s*(.18+p*1.3);
        ring(x,y,r,e.color,Math.max(1,5*(1-p)));
        ring(x,y,r*.75,rgb('#ffffff',.6),1.7);
        glow(x,y,r*.64,e.color,.22);
        break;
      }
      case 'meteor':{
        const bx=x-210*(1-p),by=y-260*(1-p);
        line([{x:bx-75,y:by-90},{x:bx,y:by}],e.color,18*s*(1-p)+3,34);
        glow(bx,by,45*s,'#ffbe80',.9);
        if(p>.6){ring(x,y,(p-.58)*250*s,'#ffe3a4',5*(1-p));glow(x,y,110*s,'#ff7a88',.4);}
        break;
      }
      case 'slash':{
        const angle=time*2+e.phase;
        ctx.strokeStyle=e.color;ctx.shadowColor=e.color;ctx.shadowBlur=30;
        ctx.lineWidth=18*s*(1-p);ctx.beginPath();ctx.arc(x,y,79*s,angle+Math.PI*1.2*(p-.45),angle+Math.PI*1.2*(p+.4));ctx.stroke();ctx.shadowBlur=0;
        break;
      }
      case 'chain':{
        for(let j=0;j<3;j++){
          const a=e.phase+j*TAU/3+time*1.4;
          const px=x+Math.cos(a)*155*s,py=y+Math.sin(a)*155*s;
          const pts=[];const n=7;
          for(let k=0;k<=n;k++){
            const t=k/n;pts.push({x:x+(px-x)*t+(k===0||k===n?0:Math.sin(k*9.9+time*23+j)*17),y:y+(py-y)*t+(k===0||k===n?0:Math.cos(k*6.7+time*23+j)*17)});
          }
          line(pts,e.color,5*(1-p)+1,25);line(pts,'#ffffff',1.6,8);
        }
        break;
      }
      case 'void':{
        glow(x,y,150*s,'#a260ff',.47);
        ctx.fillStyle='#050414';ctx.beginPath();ctx.arc(x,y,(25+15*p)*s,0,TAU);ctx.fill();
        for(let k=0;k<4;k++)ring(x,y,(41+k*19)*s,e.color,3,-time*(.9+k*.18),Math.PI*.1,Math.PI*1.6);
        break;
      }
      case 'shield':case 'bloom':case 'rays':{
        glow(x,y,110*s,e.color,.32);
        for(let i=0;i<12;i++){
          const angle=i*TAU/12+time*.45;
          const r=(e.kind==='rays'?165:90)*s;
          line([{x:x+Math.cos(angle)*20,y:y+Math.sin(angle)*20},{x:x+Math.cos(angle)*r,y:y+Math.sin(angle)*r}],e.color,e.kind==='rays'?5:2,12);
        }
        glyph(x,y,60*s,e.color,-time*.55);
        break;
      }
      case 'ice':{
        for(let i=0;i<16;i++){
          const a=i*TAU/16+e.phase;const r=(40+115*p)*s;
          line([{x:x+Math.cos(a)*r*.5,y:y+Math.sin(a)*r*.5},{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r}],e.color,9*(1-p)+1,16);
        }
      }
    }
  }

  function update(dt){
    if(!alive()){horde.update(0,time);return;}
    let dx=joy.x,dy=joy.y;
    if(keys.has('a')||keys.has('arrowleft'))dx--;
    if(keys.has('d')||keys.has('arrowright'))dx++;
    if(keys.has('w')||keys.has('arrowup'))dy--;
    if(keys.has('s')||keys.has('arrowdown'))dy++;
    const length=Math.hypot(dx,dy);
    if(length>.08){
      dx/=length;dy/=length;player.vx=dx;player.vy=dy;player.heading=Math.atan2(dy,dx);
      const speed=time<player.dashUntil?335:244;
      const from={x:player.x,y:player.y};
      player.x=clamp(player.x+dx*speed*dt,42,W-42);player.y=clamp(player.y+dy*speed*dt,120,H-53);
      if(Math.random()<(quality==='LITE'?.10:.48))spawnParticle(from.x,from.y,'#a0b6ff',35,2,.42);
    }else{player.vx=0;player.vy=0;}
    horde.update(dt,time);
  }
  function frame(ts){
    const now=ts/1000;
    if(!last)last=now;
    const dt=clamp(now-last,0,.045);last=now;time+=dt;
    if(canvas.clientWidth!==width||canvas.clientHeight!==height){
      width=canvas.clientWidth;height=canvas.clientHeight;
      dpr=Math.min(window.devicePixelRatio||1,quality==='LITE'?1.1:1.75);
      canvas.width=Math.max(1,Math.round(width*dpr));canvas.height=Math.max(1,Math.round(height*dpr));
    }
    if(Math.min(window.devicePixelRatio||1,quality==='LITE'?1.1:1.75)!==dpr)width=0;
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    if(document.hidden){requestAnimationFrame(frame);return;}
    update(dt);
    for(const p of particles){p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*1.75);p.vy*=Math.exp(-dt*1.75);p.life-=dt;}
    particles=particles.filter(p=>p.life>0);
    effects.forEach(e=>e.t+=dt);effects=effects.filter(e=>e.t<e.life);
    bolts.forEach(b=>b.t+=dt);
    for(const b of bolts)if(b.t>=b.life&&!b.done){b.done=true;orb(b.to.x,b.to.y,b.color,b.strong?13:6,125,.33);}
    bolts=bolts.filter(b=>b.t<b.life);
    texts.forEach(t=>{t.t+=dt;t.y+=t.vy*dt;});texts=texts.filter(t=>t.t<t.life);
    shake*=Math.exp(-dt*11);
    ctx.clearRect(0,0,W,H);
    ctx.save();if(shake>.16)ctx.translate(rnd(-shake,shake),rnd(-shake,shake));
    background();
    ctx.save();ctx.globalCompositeOperation='lighter';effects.forEach(drawEffect);ctx.restore();
    drawEnemies();drawHero();
    ctx.save();ctx.globalCompositeOperation='lighter';bolts.forEach(drawBolt);
    particles.forEach(p=>{
      ctx.globalAlpha=clamp(p.life/p.max,0,1);
      line([{x:p.px,y:p.py},{x:p.x,y:p.y}],p.color,Math.max(.7,p.size*(p.life/p.max)),10);
      if(quality!=='LITE')glow(p.x,p.y,p.size*4,p.color,.27);
    });ctx.globalAlpha=1;ctx.restore();
    for(const t of texts){
      ctx.globalAlpha=clamp((t.life-t.t)/.25,0,1);ctx.textAlign='center';ctx.font=`900 ${t.font}px system-ui`;
      ctx.shadowColor='#000';ctx.shadowBlur=8;ctx.fillStyle=t.color;ctx.fillText(t.text,t.x,t.y);ctx.shadowBlur=0;
    }ctx.globalAlpha=1;ctx.restore();
    const comboEl=document.getElementById('chaosCombo'),dashEl=document.getElementById('chaosDash');
    const burstStatus=document.getElementById('chaosBurstStatus');
    if(comboEl)comboEl.textContent=`연속 타격 ${time<comboUntil?combo:0}`;
    if(dashEl)dashEl.textContent=time<player.dashReady?`대시 ${Math.ceil(player.dashReady-time)}초`:'대시 준비';
    if(burstBtn)burstBtn.disabled=!alive()||horde.cooldown>0||state.mp<25;
    if(burstStatus)burstStatus.textContent=horde.cooldown>0?`재사용 ${Math.ceil(horde.cooldown)}초`:'R · MP 25';
    const enemyCount=document.getElementById('chaosEnemies');if(enemyCount)enemyCount.textContent=`몬스터 ${horde.getStatus().actorCount} / ${horde.getStatus().total}`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.ChaosEdenBattlefield={getStatus:()=>({render:'canvas2d',quality,particleCount:particles.length,effectsCount:effects.length,actors:horde.getStatus().actorCount,hero:{x:player.x,y:player.y},burstCooldown:horde.cooldown}),castBurst};
})();
