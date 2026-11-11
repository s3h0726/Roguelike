import {CLASSES,ABILITIES,RELICS,TIPS} from './data.js';
import {createGame,startRun,update,dash,ultimate,chooseUpgrade,chooseRelic,getCooldownFraction} from './engine.js';
const $=id=>document.getElementById(id);
const dom={viewport:$('viewport'),gfx:$('gfxStatus'),hud:$('hud'),menu:$('menuOverlay'),choice:$('choiceOverlay'),gameover:$('gameoverOverlay'),pause:$('pauseOverlay'),announcement:$('announcement'),toast:$('toast')};
let state=createGame(Date.now());let selected='void',renderer=null,lastPhase='menu',lastFrame=performance.now(),hudFrame=0,announcementTimer=0,toastTimer=0,pausedFrom='playing',quality='ultra',muted=false,audioCtx=null;
const keys=new Set();let joystick={x:0,y:0},pointerId=null;
const icons={nova:'◉',chain:'ϟ',meteor:'☄',orbit:'✦',beam:'╱',frost:'❄'};
const stat=(x)=>Math.ceil(Math.max(0,x)).toLocaleString('en-US');
function sound(name){if(muted)return;try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const now=audioCtx.currentTime;let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g).connect(audioCtx.destination);let a=name==='ultimate'?115:name==='level'?580:name==='hit'?150:name==='shot'?420:330,b=name==='ultimate'?42:name==='level'?1100:name==='hit'?80:620;o.type=name==='ultimate'?'sawtooth':'sine';o.frequency.setValueAtTime(a,now);o.frequency.exponentialRampToValueAtTime(b,now+.15);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(name==='ultimate'?.18:.055,now+.025);g.gain.exponentialRampToValueAtTime(.0001,now+(name==='ultimate'?.54:.18));o.start(now);o.stop(now+(name==='ultimate'?.55:.2));}catch{}
}
function buildMenu(){const container=$('classChoices');container.innerHTML='';for(const cls of CLASSES){let b=document.createElement('button');b.className='class-card'+(cls.id===selected?' selected':'');b.dataset.class=cls.id;b.innerHTML=`<span class="class-glyph" style="color:${cls.color}">${cls.icon}</span><strong>${cls.name}</strong><span class="class-sub">${cls.subtitle}</span><span class="class-desc">${cls.desc}</span><span class="class-stats">♥ ${cls.hp} HP &nbsp; ✧ ${cls.atk} ATK</span>`;b.onclick=()=>{selected=cls.id;buildMenu();sound('select');};container.appendChild(b);}}
function start(){startRun(state,selected);dom.menu.classList.add('hidden');dom.gameover.classList.add('hidden');dom.pause.classList.add('hidden');lastPhase='playing';hudFrame=0;dom.announcement.classList.remove('visible');dom.hud.style.opacity=1;sound('level');refreshHUD();}
function showChoice(){let isLevel=state.phase==='level';$('choiceKicker').textContent=isLevel?`ASCENSION • LEVEL ${state.level}`:`STAGE ${state.stage} CLEARED`;$('choiceTitle').textContent=isLevel?'CHOOSE YOUR EVOLUTION':'CLAIM YOUR RELIC';$('choiceSubtitle').textContent=isLevel?'Three powers. One irreversible decision.':'A fragment of the cosmos becomes yours.';
 const box=$('upgradeChoices');box.innerHTML='';for(const [i,ch]of state.choices.entries()){const id=ch.id;let b=document.createElement('button');b.className='upgrade-card';let level=state.upgradeLv[id]||0;let glyph=ch.kind==='stat'?'✧':icons[id]||'◆';if(!isLevel)glyph='✦';b.innerHTML=`<span class="upgrade-glyph" style="color:${ch.color}">${glyph}</span><span class="upgrade-rarity">0${i+1} / ${ch.tier||ch.rarity||'RARE'}${isLevel?' · LV.'+(level+1):''}</span><strong>${ch.name}</strong><span class="upgrade-desc">${ch.desc}</span><span class="upgrade-bottom">${isLevel?'EVOLVE':'CLAIM RELIC'} →</span>`;
 b.onclick=()=>{if(isLevel)chooseUpgrade(state,id);else chooseRelic(state,id);sound('level');syncPhase(true);refreshHUD();};box.appendChild(b);}dom.choice.classList.remove('hidden');}
function syncPhase(force=false){if(!force&&state.phase===lastPhase)return;lastPhase=state.phase;
 dom.choice.classList.toggle('hidden',!['level','relic'].includes(state.phase));dom.gameover.classList.toggle('hidden',state.phase!=='dead');
 if(state.phase==='level'||state.phase==='relic')showChoice();
 if(state.phase==='dead'){let s=state.summary||{stage:state.stage,level:state.level,kills:state.kills,score:state.score};$('runSummary').innerHTML=[['STAGE',s.stage],['LEVEL',s.level],['KILLS',s.kills],['SCORE',stat(s.score)]].map(([k,v])=>`<div class="summary-item"><strong>${v}</strong><small>${k}</small></div>`).join('');sound('hit');}
}
function togglePause(){if(state.phase==='playing'){state.phase='paused';pausedFrom='playing';dom.pause.classList.remove('hidden');}else if(state.phase==='paused'){state.phase=pausedFrom;dom.pause.classList.add('hidden');lastPhase='paused';syncPhase();}}
function resetToMenu(){state=createGame(Date.now());dom.menu.classList.remove('hidden');dom.gameover.classList.add('hidden');dom.pause.classList.add('hidden');dom.choice.classList.add('hidden');lastPhase='menu';dom.hud.style.opacity=.5;buildMenu();}
function notice(text){dom.toast.textContent=text;dom.toast.classList.add('visible');toastTimer=2.2;}
function updateAnnouncement(e){if(e.type==='banner'){dom.announcement.textContent=e.text;dom.announcement.style.color=e.color||'#f3e3ff';dom.announcement.classList.add('visible');announcementTimer=1.6;}}
function refreshHUD(){const h=state.hero;if(!h)return;
 $('stageLabel').textContent=`STAGE ${String(state.stage).padStart(2,'0')}`;$('actLabel').textContent=state.stage%4===0?'BOSS RIFT':state.stage<4?'NEBULA DEPTHS':state.stage<9?'FRACTURED COSMOS':'THE FINAL ABYSS';
 $('stageTrack').style.width=`${Math.min(100,state.stageElapsed/(state.stage%4===0?36:31)*100)}%`;$('killsLabel').textContent=state.kills;$('scoreLabel').textContent=stat(state.score);$('levelLabel').textContent=state.level;
 $('heroLabel').textContent=CLASSES.find(c=>c.id===h.classId)?.name||'ASCENDANT';$('hpLabel').textContent=`${stat(h.hp)} / ${stat(h.maxHp)}`;$('hpFill').style.width=`${100*h.hp/h.maxHp}%`;$('shieldFill').style.width=`${h.maxShield?100*h.shield/h.maxShield:0}%`;$('shieldLabel').textContent=`${stat(h.shield)} SHIELD`;$('bottomHp').textContent=stat(h.hp);
 $('xpLabel').textContent=`${Math.floor(state.xp)} / ${state.xpNeed} XP`;$('xpFill').style.width=`${Math.min(100,state.xp/state.xpNeed*100)}%`;
 $('ultHint').textContent=`R · ${Math.floor(h.energy)}%`;$('ultBtn').classList.toggle('ready',h.energy>=100);$('ultText').textContent=h.energy>=100?'FIRE NOW':'SUPERNOVA';
 const skills=Object.entries(h.abilities).filter(([_,lv])=>lv>0).slice(0,5);$('skillDock').innerHTML=skills.map(([id,lv])=>`<div class="skill-chip" title="${ABILITIES[id].name} Lv.${lv}"><span class="glyph" style="color:${ABILITIES[id].color}">${icons[id]}</span><span class="level">${lv}</span><span class="skill-name">${id.toUpperCase()}</span><span class="cooldown-meter" style="width:${getCooldownFraction(state,id)*100}%;background:${ABILITIES[id].color}"></span></div>`).join('');
 $('abilityTags').innerHTML=skills.map(([id,lv])=>`<span class="ability-tag" title="${ABILITIES[id].desc}">${ABILITIES[id].name} ${lv}</span>`).join('');
 $('relicTags').innerHTML=state.relics.length?state.relics.map(id=>`<span class="relic-tag" title="${RELICS.find(r=>r.id===id)?.desc||''}">${RELICS.find(r=>r.id===id)?.name||id}</span>`).join(''):'<span class="placeholder">NO RELICS YET</span>';
 let boss=state.enemies.find(e=>e.type==='boss'&&e.hp>0);$('bossBanner').hidden=!boss;if(boss)$('bossHpFill').style.width=`${100*boss.hp/boss.maxHp}%`;dom.hud.querySelector('#damageFlash').style.opacity=state.blink>0?state.blink*2:0;
}
function getInput(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);return {x:x||joystick.x,y:y||joystick.y};}
function inputAction(type){if(type==='dash'){if(dash(state,getInput()))sound('dash');else if(state.phase==='playing')notice('DASH RECHARGING');}if(type==='ultimate'){if(ultimate(state))sound('ultimate');else if(state.phase==='playing')notice('SUPERNOVA REQUIRES 100% ENERGY');}}
function bindInputs(){window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key))e.preventDefault();if(e.repeat)return;keys.add(key);if(key===' '||key==='shift')inputAction('dash');if(key==='r')inputAction('ultimate');if(key==='p'||key==='escape')togglePause();});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
 $('startBtn').onclick=start;$('againBtn').onclick=()=>{resetToMenu();};$('resumeBtn').onclick=togglePause;$('restartBtn').onclick=resetToMenu;$('pauseBtn').onclick=togglePause;$('ultBtn').onclick=()=>inputAction('ultimate');$('mobileUlt').onclick=()=>inputAction('ultimate');$('dashBtn').onclick=()=>inputAction('dash');
 $('qualityBtn').onclick=()=>{quality=quality==='ultra'?'lite':'ultra';renderer?.setQuality(quality);$('qualityBtn').textContent=quality==='ultra'?'✧ ULTRA FX':'◇ LITE FX';notice(quality==='ultra'?'ULTRA EFFECTS ENABLED':'LITE MODE ENABLED');};
 $('audioBtn').onclick=()=>{muted=!muted;$('audioBtn').textContent=muted?'♪ MUTED':'♪ SOUND ON';};
 const joy=$('joystick'),dot=$('joystickDot');const reset=()=>{pointerId=null;joystick.x=0;joystick.y=0;dot.style.transform='translate(-50%,-50%)';};
 const read=e=>{let r=joy.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),m=r.width*.33;joystick.x=dx/Math.max(m,d);joystick.y=dy/Math.max(m,d);dot.style.transform=`translate(calc(-50% + ${joystick.x*m}px),calc(-50% + ${joystick.y*m}px))`;};
 joy.addEventListener('pointerdown',e=>{pointerId=e.pointerId;joy.setPointerCapture(e.pointerId);read(e);});joy.addEventListener('pointermove',e=>{if(pointerId===e.pointerId)read(e);});joy.addEventListener('pointerup',reset);joy.addEventListener('pointercancel',reset);
}
function processEvents(events){let banners=0;for(const e of events){if(e.type==='banner'){updateAnnouncement(e);banners++;}else if(e.type==='ultimate')sound('ultimate');else if(e.type==='meteor'&&Math.random()<.13)sound('hit');}renderer?.consume(events);}
function tick(now){let dt=Math.min(.05,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
 if(state.phase==='playing')update(state,dt,getInput());if(state.events.length){let ev=state.events.splice(0);processEvents(ev);}if(renderer)renderer.render(state,dt);
 syncPhase();hudFrame+=dt;if(hudFrame>.095){hudFrame=0;refreshHUD();}
 if(announcementTimer>0){announcementTimer-=dt;if(announcementTimer<=0)dom.announcement.classList.remove('visible');}
 if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)dom.toast.classList.remove('visible');}
 requestAnimationFrame(tick);
}
async function bootstrap(){buildMenu();bindInputs();
 const {CanvasBattleRenderer}=await import('./render2d.js');renderer=new CanvasBattleRenderer(dom.viewport);dom.gfx.textContent='2D • CANVAS';dom.gfx.title='Native cinematic 2D renderer — no WebGL or external CDN required';
 renderer.setQuality(quality);dom.hud.style.opacity=.5;requestAnimationFrame(tick);
}
bootstrap().catch(err=>{console.error(err);dom.gfx.textContent='ERROR';notice('Could not start the graphics engine. Reload this page.');});
