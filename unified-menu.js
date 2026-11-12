/* One-menu navigation: legacy RPG + dimensional expansion. No changes to combat state or save schema. */
(() => {
  'use strict';
  const groups = [
    {id:'home',icon:'🏠',label:'성장',items:[['exp:overview','성장 현황'],['rpg:growth','기본 성장·환생'],['rpg:skills','스킬'],['rpg:armory','무기고'],['log:history','전투 기록']]},
    {id:'battle',icon:'⚔️',label:'전투',items:[['rpg:fields','특별 전장'],['rpg:boss','보스 도전'],['rpg:tower','무한 탑'],['exp:potions','물약']]},
    {id:'industry',icon:'🏗️',label:'산업',items:[['exp:buildings','생산 시설'],['exp:recipes','제작'],['exp:market','시장'],['exp:automation','자동화']]},
    {id:'upgrade',icon:'📚',label:'연구',items:[['exp:research','기술 연구'],['exp:talents','특성'],['exp:relics','유물'],['exp:ascension','차원 순환']]},
    {id:'explore',icon:'🌌',label:'탐사',items:[['exp:expedition','탐사'],['exp:contracts','의뢰'],['exp:factions','세력'],['exp:achievements','업적']]}
  ];
  const $=id=>document.getElementById(id);
  const all=groups.flatMap(group=>group.items.map(([key,label])=>({key,label,group})));
  const known=new Map(all.map(item=>[item.key,item]));
  const groupIndex=new Map(groups.map(g=>[g.id,g]));
  const isMobile=()=>window.matchMedia('(max-width:980px)').matches;
  const memoryKey='chaos-eden-unified-menu-v1';
  let currentGroup='home',currentView='exp:overview',isOpen=false,lastByGroup={};
  try {
    const saved=JSON.parse(sessionStorage.getItem(memoryKey)||'null');
    if(saved && groupIndex.has(saved.group) && known.has(saved.view) && known.get(saved.view).group.id===saved.group){
      currentGroup=saved.group;currentView=saved.view;
    }
  } catch(_e) {/* Storage may be unavailable; the menu still works. */}
  function persist(){try{sessionStorage.setItem(memoryKey,JSON.stringify({group:currentGroup,view:currentView}));}catch(_e){}}
  function renderNav(){
    const groupHtml=(g)=>`<button type="button" data-group="${g.id}" class="${g.id===currentGroup?'active':''}" aria-pressed="${g.id===currentGroup}" title="${g.label} 메뉴"><span class="u-icon" aria-hidden="true">${g.icon}</span><span>${g.label}</span></button>`;
    $('unifiedGroups').innerHTML=groups.map(groupHtml).join('');
    $('mobileQuickDock').innerHTML=groups.map(groupHtml).join('');
    for(const el of [...$('unifiedGroups').querySelectorAll('button'),...$('mobileQuickDock').querySelectorAll('button')])el.addEventListener('click',()=>showGroup(el.dataset.group));
    const group=groupIndex.get(currentGroup);
    $('unifiedViews').innerHTML=group.items.map(([key,label])=>`<button type="button" data-view="${key}" class="${key===currentView?'active':''}" aria-pressed="${key===currentView}">${label}</button>`).join('');
    for(const el of $('unifiedViews').querySelectorAll('button'))el.addEventListener('click',()=>select(el.dataset.view));
    const chosen=known.get(currentView);
    $('unifiedCurrentTitle').textContent=`${group.icon} ${group.label} / ${chosen?.label||''}`;
  }
  function activate(){
    const [kind,id]=currentView.split(':');
    $('expansionMenuPanel').classList.toggle('ui-pane-hidden',kind!=='exp');
    $('legacyMenuPanel').classList.toggle('ui-pane-hidden',kind!=='rpg');
    $('battleLogPanel').classList.toggle('ui-pane-hidden',kind!=='log');
    if(kind==='exp' && window.ChaosExpansion)window.ChaosExpansion.show(id);
    else if(kind==='rpg' && typeof window.showMainTab==='function')window.showMainTab(id);
    $('unifiedContent').scrollTop=0;
    renderNav();persist();
  }
  function select(key){const next=known.get(key);if(!next)return false;
    currentGroup=next.group.id;currentView=key;lastByGroup[currentGroup]=key;
    closePalette();activate();open();return true;
  }
  function showGroup(id){const g=groupIndex.get(id);if(!g)return;
    if(isMobile() && isOpen && id===currentGroup){close();return;}
    const selected=lastByGroup[id] || (currentGroup===id?currentView:g.items[0][0]);
    select(selected);
  }
  function syncOverlay(){
    const show=isMobile()&&isOpen;
    $('unifiedSidebar').classList.toggle('is-open',show);
    $('unifiedBackdrop').classList.toggle('is-open',show);
    $('unifiedSidebar').setAttribute('aria-hidden',isMobile()&&!show?'true':'false');
    document.body.classList.toggle('unified-menu-open',show);
  }
  function open(){isOpen=true;syncOverlay();}
  function close(){isOpen=false;closePalette();syncOverlay();}
  function closePalette(){const el=$('unifiedPalette');if(el)el.hidden=true;}
  function palette(){const panel=$('unifiedPalette');const reveal=panel.hidden;panel.hidden=!reveal;if(!reveal)return;
    const input=$('unifiedPaletteSearch');input.value='';filterPalette('');input.focus();}
  function filterPalette(text){const term=String(text||'').trim().toLocaleLowerCase('ko');
    const results=all.filter(item=>!term || `${item.label} ${item.group.label}`.toLocaleLowerCase('ko').includes(term));
    $('unifiedPaletteResults').innerHTML=results.length?results.map(item=>`<button type="button" data-view="${item.key}">${item.group.icon} ${item.label}</button>`).join(''):'<span>일치하는 메뉴가 없습니다.</span>';
    for(const b of $('unifiedPaletteResults').querySelectorAll('button'))b.addEventListener('click',()=>select(b.dataset.view));
  }
  function onKey(event){
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(isMobile())open();palette();return;}
    if(event.key==='Escape'){if(!$('unifiedPalette').hidden){closePalette();return;}if(isMobile())close();return;}
    if(event.altKey && !event.ctrlKey && !event.metaKey && /^[1-5]$/.test(event.key)){
      event.preventDefault();showGroup(groups[Number(event.key)-1].id);
    }
  }
  $('unifiedSearchTrigger').addEventListener('click',palette);
  $('unifiedPaletteSearch').addEventListener('input',event=>filterPalette(event.target.value));
  $('unifiedPaletteSearch').addEventListener('keydown',event=>{
    if(event.key==='Enter'){$('unifiedPaletteResults').querySelector('button')?.click();event.preventDefault();}
  });
  $('unifiedClose').addEventListener('click',close);
  $('unifiedBackdrop').addEventListener('click',close);
  document.addEventListener('keydown',onKey);
  window.addEventListener('resize',syncOverlay,{passive:true});
  window.UnifiedMenu={groups,select,group:showGroup,open,close,palette,get view(){return currentView;},get category(){return currentGroup;}};
  activate();syncOverlay();
})();
