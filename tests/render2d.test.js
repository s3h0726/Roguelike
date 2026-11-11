import test from 'node:test';
import assert from 'node:assert/strict';
import { CanvasBattleRenderer } from '../src/render2d.js';
import { createGame, startRun } from '../src/engine.js';

function environment() {
  const gradient = {addColorStop(){}};
  const ctx = new Proxy({}, {get(target, key) {
    if (key === 'createRadialGradient' || key === 'createLinearGradient') return () => gradient;
    return Reflect.get(target,key) ?? (() => {});
  }, set(target,key,value){target[key]=value;return true;}});
  const globalBefore = {document:globalThis.document, window:globalThis.window, ResizeObserver:globalThis.ResizeObserver};
  globalThis.document = {createElement:() => ({style:{},getContext:() => ctx,setAttribute(){},remove(){}})};
  globalThis.window = {devicePixelRatio:2};
  globalThis.ResizeObserver = class {observe(){}disconnect(){}};
  const root = {clientWidth:1200,clientHeight:780,prepend(){}};
  return {root,restore(){for(const [key,value] of Object.entries(globalBefore)) if(value === undefined) delete globalThis[key];else globalThis[key]=value;}};
}

test('native Canvas2D renderer handles full spell event variety', () => {
  const env=environment();
  try {
    const r=new CanvasBattleRenderer(env.root);
    const s=createGame(5);startRun(s,'storm');
    s.enemies.push({id:10,type:'boss',x:5,y:0,hp:500,maxHp:600,r:2,color:'#dd68c4'});
    s.hero.shield=20;s.hero.abilities.orbit=3;
    s.shots.push({x:1,y:1,r:.2,vx:10,vy:0,color:'#aabbff'});
    r.consume([
      {type:'ultimate',x:0,y:0,r:15,color:'#ddbbee'},
      {type:'pulse',x:0,y:0,r:8,color:'#aabbff'},
      {type:'meteor',x:5,y:0,r:4,color:'#ffb155'},
      {type:'beam',x:0,y:0,toX:5,toY:0,kind:'lightning',color:'#aaffee'},
      {type:'beam',x:0,y:0,toX:12,toY:8,kind:'laser',color:'#aaffee'},
      {type:'hit',x:5,y:0,crit:true,amount:400,color:'#ffeeaa'},
      {type:'spawn',x:10,y:7,color:'#aa77ff'},
      {type:'heroHit',x:0,y:0,color:'#ff6688'},
    ]);
    for(let i=0;i<30;i++)r.render(s,.016);
    assert.ok(r.effects.length>0);
    assert.ok(r.particles.length>0);
    r.setQuality('lite');r.render(s,.02);
    assert.equal(r.quality,'lite');
    assert.ok(r.canvas.width<=env.root.clientWidth*1.35+1);
    r.dispose();
  }finally{env.restore();}
});

test('particle burst remains bounded on lower quality', () => {
  const env=environment();
  try {
    const r=new CanvasBattleRenderer(env.root);r.setQuality('lite');
    for(let i=0;i<1000;i++)r.consume([{type:'burst',x:0,y:0,count:200,color:'#ff99dd'}]);
    assert.ok(r.particles.length<=410);
    r.dispose();
  }finally{env.restore();}
});
