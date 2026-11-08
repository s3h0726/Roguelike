import {Game,cellPoint} from './engine.js';
import {Renderer} from './render.js';
import {COLS,ROWS,MAX_BENCH,UNIT_BY_ID,TRAITS,RELICS} from './data.js';
const $=id=>document.getElementById(id);
const canvas=$('arenaCanvas');
const renderer=new Renderer(canvas);
let selected=null,modalType=null,frameAt=performance.now(),uiAt=0,soundEnabled=false,audioContext;
let bannerTimeout;
renderer.bannerCallback=(str,color)=>{const box=$('battleBanner');box.textContent=str;box.style.color=color;box.classList.add('show');clearTimeout(bannerTimeout);bannerTimeout=setTimeout(()=>box.classList.remove('show'),1350);};
const game=new Game({onChange:()=>renderUI(),onFX:(type,data)=>{renderer.emit(type,data);if(soundEnabled&&['supernova','impact','fuse','death'].includes(type))tone(type);},onFinish:()=>showResult()});
window.eclipseGame=game;
function tone(type){try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();const now=audioContext.currentTime;osc.type=type==='supernova'?'sawtooth':'triangle';osc.frequency.setValueAtTime(type==='supernova'?180:320,now);osc.frequency.exponentialRampToValueAtTime(type==='supernova'?55:120,now+.22);gain.gain.setValueAtTime(.05,now);gain.gain.exponentialRampToValueAtTime(.001,now+.25);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.26);}catch{soundEnabled=false;}}
const stars=n=>'★'.repeat(n);
const badgeFor=u=>UNIT_BY_ID[u.type].traits.map(t=>`<span style="color:${TRAITS[t].color}">${t}</span>`).join(' • ');
function flashInfo(message){$('shopNote').textContent=message;clearTimeout(flashInfo.timeout);flashInfo.timeout=setTimeout(()=>{$('shopNote').textContent='Collect 3 identical units to fuse them into a stronger star rank.';},3000);}
function renderRoster(){
  const board=game.board();$('rosterCount').textContent=`${board.length}/${game.capacity()}`;
  $('roster').innerHTML=board.length?board.map(u=>{const t=UNIT_BY_ID[u.type];return `<div class="roster-unit ${selected===u.uid?'selected':''}" data-uid="${u.uid}" draggable="${game.phase==='prep'}" title="${t.abilityName}"><div class="avatar" style="color:${t.color}">${t.icon}</div><div class="unit-meta"><b>${t.name}</b><small>${stars(u.star)} · ${t.role}</small></div><div class="unit-actions"><button class="mini-btn" data-bench="${u.uid}" title="Move to bench">↧</button><button class="mini-btn" data-sell="${u.uid}" title="Sell unit">$</button></div></div>`;}).join(''):'<div class="roster-empty">Recruit a unit and place it on the board.</div>';
  for(const div of $('roster').querySelectorAll('[data-uid]')){
    div.addEventListener('click',e=>{if(e.target.closest('button'))return;selected=Number(div.dataset.uid);renderUI();});
    div.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',div.dataset.uid));
  }
  for(const b of $('roster').querySelectorAll('[data-bench]'))b.addEventListener('click',e=>{e.stopPropagation();if(game.toBench(Number(b.dataset.bench))){selected=null;flashInfo('Unit returned to your bench.');}});
  for(const b of $('roster').querySelectorAll('[data-sell]'))b.addEventListener('click',e=>{e.stopPropagation();const id=Number(b.dataset.sell);if(game.sell(id)){if(selected===id)selected=null;flashInfo('Unit sold. Gold refunded.');}});
}
function renderBench(){const bench=game.bench();$('benchCount').textContent=`${bench.length}/${MAX_BENCH}`;
  $('bench').innerHTML=Array.from({length:MAX_BENCH},(_,i)=>{const u=bench[i];if(!u)return `<div class="bench-slot" title="Empty reserve slot">+</div>`;const t=UNIT_BY_ID[u.type];return `<button class="bench-slot filled ${selected===u.uid?'selected':''}" data-bench-unit="${u.uid}" draggable="${game.phase==='prep'}" title="${t.name} — ${t.abilityName}" style="color:${t.color}">${t.icon}<span class="star-mini">${stars(u.star)}</span></button>`;}).join('');
  for(const el of $('bench').querySelectorAll('[data-bench-unit]')){
    el.addEventListener('click',()=>{selected=Number(el.dataset.benchUnit);renderUI();});
    el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.dataset.benchUnit));
  }
}
function renderShop(){
  $('shop').innerHTML=game.shop.map((type,i)=>{if(!type)return '<div class="shop-card sold"><span>RECRUITED</span></div>';
    const t=UNIT_BY_ID[type];return `<button class="shop-card" data-shop="${i}" style="--color:${t.color};--rarity:${t.cost>=4?'#ffcd83':t.cost>=3?'#c79aff':t.cost>=2?'#80cafa':'#91c9bc'}" ${game.phase!=='prep'||game.gold<t.cost||game.bench().length>=MAX_BENCH?'disabled':''} title="${t.abilityName}: ${t.role}"><span class="shop-icon">${t.icon}</span><strong>${t.name}</strong><small>${t.traits.join(' · ')}</small><span class="shop-footer"><span>${t.role.toUpperCase()}</span><span class="cost">${t.cost} ◆</span></span></button>`;}).join('');
  for(const el of $('shop').querySelectorAll('[data-shop]'))el.addEventListener('click',()=>{
    const before=new Set(game.roster.map(u=>u.uid));if(game.buy(Number(el.dataset.shop))){const added=game.roster.find(u=>!before.has(u.uid));if(added)selected=added.uid;renderUI();flashInfo('Unit recruited. Select a blue tile to deploy it.');}
  });
  $('rerollBtn').innerHTML=`↻ REROLL <b>${game.freeRerolls?'FREE':'2 G'}</b>`;
  $('rerollBtn').disabled=game.phase!=='prep'||(game.freeRerolls===0&&game.gold<2);
  $('levelBtn').innerHTML=`⬆ LEVEL UP <b>${game.level>=5?'MAX':'4 G'}</b>`;
  $('levelBtn').disabled=game.phase!=='prep'||game.gold<4||game.level>=5;
  $('lockBtn').textContent=game.shopLocked?'♜ SHOP LOCKED':'♙ LOCK SHOP';$('lockBtn').disabled=game.phase!=='prep';
}
function renderTraits(){const counts=game.traitCounts();$('traits').innerHTML=Object.entries(TRAITS).map(([name,t])=>{
  const n=counts[name];const tier=n>=4?2:n>=2?1:0;
  return `<div class="trait-row" title="${t.description}"><div class="trait-icon" style="color:${t.color}">${t.icon}</div><div class="trait-info"><b style="color:${tier?t.color:'#bccbe0'}">${name}</b><small>${n} UNIT${n===1?'':'S'}</small></div><div class="trait-markers"><span class="${tier>=1?'active':''}">2</span><span class="${tier>=2?'active':''}">4</span></div></div>`;
}).join('');$('synergyShort').textContent=Object.entries(counts).filter(([,n])=>n>=2).map(([t])=>t.toUpperCase()).join(' + ')||'BUILD A 2-UNIT SYNERGY';}
function renderRelics(){$('relicCount').textContent=game.relics.length;$('relics').innerHTML=game.relics.length?game.relics.map(id=>{const r=RELICS.find(x=>x.id===id);return `<div class="relic-mini" title="${r.desc}"><span>${r.icon}</span><div><b>${r.name}</b><small>${r.rarity}</small></div></div>`;}).join(''):'<div class="empty-note">Win stages 2, 4, 6… to choose a powerful relic.</div>';}
function renderHeader(){$('roundStat').textContent=String(game.round).padStart(2,'0');$('lifeStat').textContent='♥ '.repeat(game.lives).trim()||'✕';$('goldStat').textContent=game.gold;$('levelStat').textContent=game.level;$('bestStat').textContent=game.best||'—';
  const s=game.roundStage;$('roundTitle').textContent=s.name;$('modifierLabel').textContent=`${s.boss?'☠':'✦'} ${s.affix.toUpperCase()}`;
  $('phaseLabel').textContent=({prep:'FORMATION PHASE',combat:'LIVE COMBAT',result:'BATTLE COMPLETE',over:'RUN COMPLETE'})[game.phase];
  $('enemyCount').textContent=game.enemyPreview.length;$('winStreak').textContent=game.streak;
  $('forecast').innerHTML=`<b style="color:${s.boss?'#ff99b2':'#aacffc'}">${s.boss?'⚠ BOSS WAVE':'UPCOMING ENCOUNTER'}</b><br>${game.enemyPreview.length} hostiles detected.<br>${s.kind==='meteor'?'Meteor showers will strike both armies.':s.kind==='mana'?'Everyone gains mana more quickly.':s.kind==='haste'?'Movement and attacks are accelerated.':s.boss?'A monstrous champion leads this army.':'Adapt your formation to survive.'}`;
  $('battleBtn').disabled=game.phase!=='prep'||!game.board().length;$('battleBtn').innerHTML=game.phase==='prep'?'⚔ ENGAGE <kbd>ENTER</kbd>':game.phase==='combat'?'⚔ AUTO COMBAT':'◈ RESOLVING';
  $('speedBtn').textContent=`⏩ ${game.tempo}× SPEED`;$('vfxBtn').textContent=game.ultra?'✧ ULTRA FX':'✧ LITE FX';$('soundBtn').textContent=soundEnabled?'♫ SOUND ON':'♫ SOUND OFF';
  $('cellGrid').classList.toggle('locked',game.phase!=='prep');
}
function renderUI(){renderHeader();renderRoster();renderBench();renderShop();renderTraits();renderRelics();renderCombatHUD();}
function renderCombatHUD(){$('energyFill').style.width=`${Math.round(game.energy)}%`;$('energyLabel').textContent=`${Math.floor(game.energy)}%`;$('ultimateBtn').disabled=game.phase!=='combat'||game.energy<100;}
function buildCells(){const grid=$('cellGrid');grid.innerHTML='';for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
  const cell=document.createElement('button');cell.className=`board-cell ${col<4?'ally':'enemy'}`;cell.type='button';cell.setAttribute('aria-label',`Column ${col+1}, row ${row+1}`);
  if(col<4){cell.addEventListener('click',()=>{if(game.phase!=='prep')return;const occupant=game.board().find(u=>u.col===col&&u.row===row);
      if(selected===null){if(occupant)selected=occupant.uid;renderUI();return;}
      if(occupant&&occupant.uid===selected){selected=null;renderUI();return;}
      if(game.place(selected,col,row)){selected=null;flashInfo('Unit deployed. Press ENGAGE when ready.');}else flashInfo('Field is full. Level up or replace a unit.');
    });
    cell.addEventListener('dragover',e=>{if(game.phase==='prep'){e.preventDefault();cell.classList.add('drop-hover');}});
    cell.addEventListener('dragleave',()=>cell.classList.remove('drop-hover'));
    cell.addEventListener('drop',e=>{e.preventDefault();cell.classList.remove('drop-hover');const id=Number(e.dataTransfer.getData('text/plain'));if(id&&game.place(id,col,row)){selected=null;renderUI();}});
  }else cell.disabled=true;
  grid.appendChild(cell);
}}
function modal(html){$('modalContent').innerHTML=html;$('modal').classList.remove('hidden');}
function closeModal(){$('modal').classList.add('hidden');modalType=null;}
function showResult(){if(game.phase!=='result')return;modalType='result';
  if(game.relicChoices.length){showRelicChoice();return;}
  const res=game.result;const over=game.lives<=0||game.round>=30;
  modal(`<div class="result-ribbon">${res.won?'✦':'☠'}</div><span class="modal-kicker">STAGE ${String(res.round).padStart(2,'0')} // ${res.won?'CLEAR':'FAILED'}</span><h2 style="color:${res.won?'#c8ffe5':'#ff9ca9'}">${res.won?'VICTORY ACHIEVED':'THE LINE HAS FALLEN'}</h2><p>${res.won?'Your army endures. The stars answer your command.':'Rebuild your formation. Every defeat teaches a new strategy.'}</p><div class="reward-row"><div>GOLD EARNED<b style="color:#f6d084">+${res.reward} G</b></div><div>COMMANDER HP<b>${'♥'.repeat(game.lives)||'—'}</b></div><div>WIN STREAK<b>${game.streak}</b></div></div><div class="modal-actions"><button class="btn primary" id="continueBtn">${over?(game.lives<=0?'↻ START NEW RUN':'✦ VICTORY — PLAY AGAIN'):'→ NEXT STAGE'}</button></div>`);
  $('continueBtn').onclick=()=>{closeModal();if(over){game.reset();selected=null;}else game.nextRound();};
}
function showRelicChoice(){modalType='relic';modal(`<span class="modal-kicker">AN ASTRAL BLESSING AWAITS</span><h2>CHOOSE YOUR DESTINY</h2><p>Every relic permanently reshapes this run. Choose one of three.</p><div class="relic-choices">${game.relicChoices.map(r=>`<button class="relic-option" data-relic="${r.id}"><small style="color:${r.rarity==='LEGENDARY'?'#ffe3a0':r.rarity==='EPIC'?'#d6b2ff':'#8bceff'}">${r.rarity}</small><div class="relic-portrait">${r.icon}</div><strong>${r.name}</strong><p>${r.desc}</p></button>`).join('')}</div>`);
  for(const el of $('modal').querySelectorAll('[data-relic]'))el.addEventListener('click',()=>{const id=el.dataset.relic;if(game.claimRelic(id)){renderer.emit('fuse',{x:480,y:240,color:'#d3aaff',text:'RELIC ACQUIRED'});showResult();}});
}
function showHelp(){modalType='help';modal(`<span class="modal-kicker">COMMANDER'S FIELD GUIDE</span><h2>HOW TO PLAY</h2><div class="tip"><b>1. RECRUIT:</b> Buy heroes from the Astral Bazaar. Stronger units become available as you level up.<br><b>2. DEPLOY:</b> Select a hero from the bench, then choose a blue arena tile. Frontline tanks, backline mages.<br><b>3. FUSE:</b> Three identical heroes of the same star rank automatically combine into a stronger ★★ unit.<br><b>4. SYNERGY:</b> Deploy 2 or 4 heroes sharing Celestial, Void, Ember, Storm, Arcane or Iron to unlock bonuses.<br><b>5. FIGHT:</b> Press ENGAGE. Heroes move, attack and cast on their own. Activate SUPERNOVA (Space) when charged.<br><b>6. EVOLVE:</b> Every second victory grants a permanent relic. Earn gold, upgrade your level and conquer bosses every 5 stages.<br><b>7. SURVIVE:</b> You have 3 commander hearts. Lose them all and the run ends.</div><div class="modal-actions"><button class="btn primary" id="closeHelpBtn">RETURN TO THE ARENA</button></div>`);$('closeHelpBtn').onclick=closeModal;}
$('battleBtn').addEventListener('click',()=>{if(game.begin()){selected=null;renderUI();}});
$('ultimateBtn').addEventListener('click',()=>game.ultimate());
$('rerollBtn').addEventListener('click',()=>{if(!(game.freeReroll()||game.rollShop()))flashInfo('Not enough gold to reroll.');});
$('levelBtn').addEventListener('click',()=>{if(game.levelUp())flashInfo(`Level ${game.level}! Squad cap is now ${game.capacity()}.`);});
$('lockBtn').addEventListener('click',()=>game.toggleLock());
$('speedBtn').addEventListener('click',()=>{game.tempo=game.tempo===1?2:1;renderUI();});
$('vfxBtn').addEventListener('click',()=>{game.ultra=!game.ultra;renderUI();});
$('soundBtn').addEventListener('click',()=>{soundEnabled=!soundEnabled;renderUI();if(soundEnabled)tone('fuse');});
$('helpBtn').addEventListener('click',showHelp);
$('restartBtn').addEventListener('click',()=>{if(confirm('Start a fresh run? Your current team and relics will be lost.')){closeModal();game.reset();selected=null;}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')&&modalType==='help')closeModal();});
window.addEventListener('keydown',e=>{
  if(['Space','ArrowUp','ArrowDown'].includes(e.code)&&!(e.target instanceof HTMLInputElement))e.preventDefault();
  if(e.code==='Escape'&&modalType==='help'){closeModal();return;}
  if(!$('modal').classList.contains('hidden'))return;
  if(e.code==='Space')game.ultimate();
  if(e.code==='Enter'&&game.phase==='prep')game.begin();
  if(game.phase==='prep'&&/^Digit[1-5]$/.test(e.code)){const i=Number(e.code.at(-1))-1;game.buy(i);}
});
function frame(now){const elapsed=Math.min(.07,(now-frameAt)/1000);frameAt=now;if(game.phase==='combat'){
  const pieces=game.tempo===2?2:1;
  for(let i=0;i<pieces;i++)game.update(elapsed);
}
  renderer.render(game,elapsed);if(now-uiAt>120){renderCombatHUD();if(game.phase==='combat'){$('enemyCount').textContent=game.living('enemy').length;}uiAt=now;}
  requestAnimationFrame(frame);
}
buildCells();renderUI();requestAnimationFrame(frame);