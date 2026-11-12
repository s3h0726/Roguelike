import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
const root=fileURLToPath(new URL('..',import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
const css=readFileSync(join(root,'unified-menu.css'),'utf8');
const js=readFileSync(join(root,'unified-menu.js'),'utf8');
const advanced=readFileSync(join(root,'advanced-ui.js'),'utf8');

function harness(){
 let mobile=false; const expansionCalls=[],legacyCalls=[];const elements=new Map();
 class Classes { constructor(){this.values=new Set();} toggle(k,force){if(force===undefined)force=!this.values.has(k);force?this.values.add(k):this.values.delete(k);return force;} contains(k){return this.values.has(k);} }
 class El{
  constructor(id){this.id=id;this.classList=new Classes();this.dataset={};this.children=[];this.listeners={};this.hidden=false;this.scrollTop=7;this.value='';this.textContent='';this._innerHTML='';this.attributes={};}
  set innerHTML(s){this._innerHTML=s;this.children=[];const pattern=/<button\b([^>]*)>([\s\S]*?)<\/button>/g;for(const match of s.matchAll(pattern)){const el=new El('button');const attrs=match[1];for(const [,key,val] of attrs.matchAll(/data-(group|view)="([^"]*)"/g))el.dataset[key]=val;this.children.push(el);}}
  get innerHTML(){return this._innerHTML;}
  querySelectorAll(selector){return selector==='button'?this.children:[];}
  querySelector(selector){return selector==='button'?this.children[0]:undefined;}
  addEventListener(event,fn){this.listeners[event]=fn;}
  setAttribute(key,val){this.attributes[key]=val;}
  focus(){this.focused=true;}
  click(){this.listeners.click?.();}
 }
 const ids=['unifiedGroups','mobileQuickDock','unifiedViews','unifiedCurrentTitle','expansionMenuPanel','legacyMenuPanel','battleLogPanel','unifiedContent','unifiedSidebar','unifiedBackdrop','unifiedPalette','unifiedPaletteSearch','unifiedPaletteResults','unifiedSearchTrigger','unifiedClose'];
 for(const id of ids)elements.set(id,new El(id));elements.get('unifiedPalette').hidden=true;
 const document={getElementById:(id)=>elements.get(id),body:{classList:new Classes()},addEventListener(){}};
 const window={matchMedia:()=>({matches:mobile}),addEventListener(){},ChaosExpansion:{show:id=>expansionCalls.push(id)},showMainTab:id=>legacyCalls.push(id)};
 const sessionStorage={getItem:()=>null,setItem:()=>{}};
 runInNewContext(js,{window,document,sessionStorage});
 return {window,elements,expansionCalls,legacyCalls,setMobile(v){mobile=v;}};
}

test('all existing six RPG menus and fourteen dimensional expansion views remain accessible',()=>{
 const keys=[...js.matchAll(/\['((?:rpg|exp|log):[^']+)',/g)].map(x=>x[1]);
 assert.equal(new Set(keys).size,keys.length);
 for(const p of ['growth','fields','boss','tower','skills','armory'])assert.ok(keys.includes(`rpg:${p}`));
 const tabs=[...advanced.matchAll(/\['([^']+)','[^']+'\]/g)].map(x=>x[1]);
 for(const tab of ['overview','buildings','research','relics','talents','recipes','potions','expedition','contracts','market','factions','automation','ascension','achievements'])assert.ok(keys.includes(`exp:${tab}`));
 assert.ok(html.includes('id="unifiedGroups"')&&html.includes('id="mobileQuickDock"'));
 assert.match(css,/\.unified-sidebar\{position:sticky/);
 assert.match(css,/\.mobile-quick-dock\{position:fixed/);
});
test('unified navigation switches between old and new systems without changing game state',()=>{
 const {window,elements,expansionCalls,legacyCalls}=harness();
 assert.equal(window.UnifiedMenu.category,'home');assert.equal(window.UnifiedMenu.view,'exp:overview');
 assert.equal(elements.get('unifiedGroups').children.length,5);
 assert.equal(elements.get('mobileQuickDock').children.length,5);
 window.UnifiedMenu.select('rpg:skills');
 assert.equal(legacyCalls.at(-1),'skills');
 assert.equal(elements.get('expansionMenuPanel').classList.contains('ui-pane-hidden'),true);
 assert.equal(elements.get('legacyMenuPanel').classList.contains('ui-pane-hidden'),false);
 assert.equal(elements.get('unifiedContent').scrollTop,0);
 window.UnifiedMenu.select('exp:research');
 assert.equal(expansionCalls.at(-1),'research');
 assert.equal(elements.get('legacyMenuPanel').classList.contains('ui-pane-hidden'),true);
 window.UnifiedMenu.select('log:history');
 assert.equal(elements.get('battleLogPanel').classList.contains('ui-pane-hidden'),false);
});
test('mobile bottom dock opens and closes overlay without page navigation',()=>{
 const {window,elements,setMobile}=harness();setMobile(true);
 window.UnifiedMenu.close();assert.equal(elements.get('unifiedSidebar').classList.contains('is-open'),false);
 window.UnifiedMenu.group('industry');
 assert.equal(window.UnifiedMenu.category,'industry');assert.equal(window.UnifiedMenu.view,'exp:buildings');
 assert.equal(elements.get('unifiedSidebar').classList.contains('is-open'),true);
 assert.equal(elements.get('unifiedBackdrop').classList.contains('is-open'),true);
 window.UnifiedMenu.select('exp:market');assert.equal(window.UnifiedMenu.view,'exp:market');
 window.UnifiedMenu.close();assert.equal(elements.get('unifiedSidebar').classList.contains('is-open'),false);
});
test('command palette filters all groups including legacy menus',()=>{
 const {window,elements}=harness();window.UnifiedMenu.palette();
 assert.equal(elements.get('unifiedPalette').hidden,false);
 elements.get('unifiedPaletteSearch').listeners.input({target:{value:'무한'}});
 assert.equal(elements.get('unifiedPaletteResults').children.length,1);
 elements.get('unifiedPaletteResults').children[0].click();
 assert.equal(window.UnifiedMenu.view,'rpg:tower');
 assert.equal(elements.get('unifiedPalette').hidden,true);
});
