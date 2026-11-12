import {Engine,makeState,restoreState,SAVE_KEY,fmt,fmtTime} from './engine.js';
import {NAV,UI,navHtml,topHtml,resourceFilterHtml,resourceHtml,statusHtml,contentHtml} from './ui.js';

const $=id=>document.getElementById(id);
const engine=new Engine(loadInitial());
const outlet=$('mainContent');
let lastFrame=performance.now();
let lastRender=0;
let lastAutosave=performance.now();
let saving=false;
let hiddenSince=null;
const sound={enabled:false};
const actionLabels={build:'Build',research:'Research',craft:'Craft',forge:'Forge',upgrade:'Upgrade',mission:'Contract',expedition:'Expedition',achievement:'Achievement',prestige:'Prestige',meta:'Permanent upgrade'};

function loadInitial(){
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){const parsed=JSON.parse(raw);if(parsed?.version===1)return parsed;}
  } catch(err){console.warn('OMEGA save could not be loaded',err);}
  return makeState();
}
function notify(message,type='info'){
  const container=$('toastContainer');
  const element=document.createElement('div');
  element.className=`toast ${type}`;element.textContent=message;
  container.prepend(element);
  while(container.children.length>4)container.lastChild.remove();
  setTimeout(()=>element.remove(),3100);
}
function save(silent=true){
  try {localStorage.setItem(SAVE_KEY,engine.serialize());saving=true;
    $('saveSignal').textContent='● SAVED';$('saveSignal').style.color='#7de7bc';
    if(!silent)notify('Universe saved locally.','success');return true;
  } catch(err){$('saveSignal').textContent='● SAVE ERROR';$('saveSignal').style.color='#ff9c9c';
    if(!silent)notify('Save failed. Check local storage permissions.','error');console.error(err);return false;
  }
}
function render(force=false){
  const oldScroll=outlet.scrollTop;
  $('tabNav').innerHTML=navHtml();
  $('topStats').innerHTML=topHtml(engine);
  $('resourceFilters').innerHTML=resourceFilterHtml();
  $('resourceList').innerHTML=resourceHtml(engine);
  $('currentStatus').innerHTML=statusHtml(engine);
  $('resourceToggle').textContent=UI.showAllResources?'ALL':'ACTIVE';
  if(force||document.activeElement?.tagName!=='SELECT'){
    outlet.innerHTML=contentHtml(engine);
    outlet.scrollTop=oldScroll;
  }
  $('navFooterText').textContent=`TIER ${engine.era} · ${engine.countTech}/27 RESEARCH`;
  $('pulseButton').disabled=engine.s.clock-engine.s.lastPulse<15;
  const remaining=Math.max(0,15-(engine.s.clock-engine.s.lastPulse));
  $('pulseButton').textContent=remaining>0?`⚡ ${Math.ceil(remaining)}s`:'⚡ OVERDRIVE';
  $('liveClock').textContent=fmtTime(engine.s.played);
  $('versionStatus').textContent=`${engine.s.stats.reboots} REBOOTS · ${engine.s.stats.ascensions} ASCENSIONS`;
}
function setTab(id){if(!NAV.some(n=>n[0]===id))return;UI.tab=id;outlet.scrollTop=0;render(true);if(window.matchMedia('(max-width:760px)').matches)document.querySelector('.content-frame')?.scrollIntoView({block:'start',behavior:'smooth'});}
const getQuantity=n=>n==='max'?'max':Math.max(1,Math.min(1000,Number(n)||1));
function runAction(action,id){
  let ok=false;let message='';
  switch(action){
    case 'pulse': ok=engine.pulse();message=ok?'OVERDRIVE: all production ×3 for 8 seconds!':'Pulse capacitor is charging.';break;
    case 'build':{const r=engine.buyBuilding(id,UI.buyAmt);ok=r.ok;message=r.ok?`Constructed ${r.count} facility${r.count===1?'':'ies'}.`:r.message;break;}
    case 'toggleBuild':ok=engine.toggleBuilding(id);message=ok?'Facility enabled / disabled.':'Facility not available.';break;
    case 'research':ok=engine.research(id);message=ok?'New technology discovered!':'Research requirements not met.';break;
    case 'craft':{const count=engine.craft(id,UI.craftAmt);ok=count>0;message=ok?`Synthesis completed ×${count}`:'Insufficient resources or locked formula.';break;}
    case 'forge':ok=engine.forge(id);message=ok?'Artifact forged! Permanent boost for this run.':'Artifact unavailable.';break;
    case 'upgrade':ok=engine.upgrade(id);message=ok?'Upgrade purchased.':'Upgrade requirements not met.';break;
    case 'tradeBuy':{const qty=engine.trade(id,'buy',UI.marketAmt);ok=qty>0;message=ok?`Purchased ${fmt(qty)} units.`:'Not enough credits.';break;}
    case 'tradeSell':{const qty=engine.trade(id,'sell',UI.marketAmt);ok=qty>0;message=ok?`Sold ${fmt(qty)} units.`:'Not enough stock.';break;}
    case 'mission':ok=engine.fulfillMission(id);message=ok?'Contract fulfilled! Rewards delivered.':'Unable to fulfill contract.';break;
    case 'expedition':ok=engine.startExpedition(id);message=ok?'Expedition launched. Crew will return automatically.':'Expedition unavailable.';break;
    case 'achievement':ok=engine.claimAchievement(id);message=ok?'Achievement claimed.':'Achievement not ready.';break;
    case 'auto':ok=engine.toggleAutomation(id);message=ok?'Automation directive changed.':'Research automation before using it.';break;
    case 'meta':ok=engine.buyMeta(id);message=ok?'Permanent upgrade activated.':'Not enough meta-currency.';break;
    case 'prestige':{
      const g=engine.prestigeGain(id);if(g<=0){message='Not enough progress to transcend.';break;}
      if(!confirm(`Initiate ${id.toUpperCase()}?\n\nGain ${g} meta-currency. All current factories, research and ordinary resources will reset. Permanent currencies and upgrades survive.`))return;
      const result=engine.prestige(id);ok=result>0;message=ok?`${id.toUpperCase()} COMPLETE! +${fmt(result)} gained.`:'Reset failed.';if(ok){UI.tab='dashboard';outlet.scrollTop=0;}break;
    }
    default:return;
  }
  if(ok){save();render(true);}else{render(true);}
  if(message)notify(message,ok?'success':'error');
}
function download(filename,text){const blob=new Blob([text],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function importFile(file){if(!file)return;if(file.size>4_000_000){notify('File too large.','error');return;}
 file.text().then(text=>{
    const data=JSON.parse(text);
    if(data?.version!==1||!data.res||!data.buildings)throw Error('Invalid OMEGA save');
    if(!confirm('Replace your current universe with this save file?'))return;
    engine.s=restoreState(data,Date.now());engine.s.lastSavedAt=Number.isFinite(data.lastSavedAt)?Math.min(Date.now(),Math.max(0,data.lastSavedAt)):Date.now();
    const duration=engine.offline(Date.now());UI.tab='dashboard';save();render(true);notify(`Save imported. ${fmtTime(duration)} of offline progress applied.`,'success');
  }).catch(err=>{console.error('Import failed',err);notify('Invalid or corrupted save file.','error')});
}
function extraAction(action,id){
 switch(action){
  case 'tab':setTab(id);return true;
  case 'resourceGroup':UI.resourceGroup=id;render(true);return true;
  case 'toggleResources':UI.showAllResources=!UI.showAllResources;render(true);return true;
  case 'techLane':UI.techLane=id;render(true);return true;
  case 'buyAmt':UI.buyAmt=getQuantity(id);render(true);return true;
  case 'craftAmt':UI.craftAmt=getQuantity(id);render(true);return true;
  case 'marketAmt':UI.marketAmt=getQuantity(id);render(true);return true;
  case 'reserve':engine.s.marketReserve=Number(id)||1000;save();render(true);return true;
  case 'save':save(false);render(true);return true;
  case 'export':save();download(`omega-save-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(engine.s,null,2));notify('Save exported.','success');return true;
  case 'import':$('importFile')?.click();return true;
  case 'reset':if(confirm('ERASE your entire universe and all permanent progress? This cannot be undone.')&&confirm('Confirm complete reset?')){engine.s=makeState();UI.tab='dashboard';save();render(true);notify('New universe created.','success');}return true;
 }
 return false;
}
function init(){
  document.body.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action]');
    if(!button||button.disabled)return;
    const action=button.dataset.action,id=button.dataset.id||'';
    if(extraAction(action,id))return;
    runAction(action,id);
  });
  document.addEventListener('change',event=>{
    if(event.target.matches('[data-select="autoRecipe"]')){engine.s.autoRecipe=event.target.value;save();notify('Auto-synthesis recipe updated.','success');}
    if(event.target.id==='importFile'){const file=event.target.files?.[0];importFile(file);event.target.value='';}
  });
  window.addEventListener('keydown',event=>{
    if(event.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
    if(event.code==='Space'){event.preventDefault();runAction('pulse','');}
    if(event.key>='1'&&event.key<='9'){const index=Number(event.key)-1;if(NAV[index])setTab(NAV[index][0]);}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){save();hiddenSince=Date.now();}
    else{if(hiddenSince){engine.offline(Date.now());hiddenSince=null;save();render(true);}lastFrame=performance.now();}
  });
  window.addEventListener('pagehide',()=>save());
  let priorSave=null;try{priorSave=localStorage.getItem(SAVE_KEY)}catch{}
  if(priorSave){
    // Preserves the original saved timestamp so offline progress can be calculated.
    try{const saved=JSON.parse(priorSave);if(Number.isFinite(saved.lastSavedAt))engine.s.lastSavedAt=saved.lastSavedAt;}catch{}
    const offline=engine.offline(Date.now());if(offline>5)notify(`Welcome back! ${fmtTime(offline)} of offline progress collected.`,'success');
  }
  render(true);
  function animate(now){
    const dt=Math.min(2,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
    if(!document.hidden){engine.step(dt);if(now-lastRender>900){render();lastRender=now;}if(now-lastAutosave>5000){save();lastAutosave=now;}}
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
init();
