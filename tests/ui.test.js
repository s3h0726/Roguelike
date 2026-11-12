import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine,makeState} from '../src/engine.js';
import {NAV,UI,navHtml,contentHtml,resourceHtml,topHtml,esc} from '../src/ui.js';

test('all eleven game screens render live controls',()=>{
 const e=new Engine(makeState());
 assert.equal(NAV.length,11);
 for(const [key] of NAV){UI.tab=key;const html=contentHtml(e);assert.ok(html.includes('<h1>'),key);assert.ok(html.length>600,key);assert.ok(!html.includes('undefined')&&!html.includes('NaN'),key);}
 UI.tab='dashboard';
});
test('research, facility and prestige actions are represented in views',()=>{
 const e=new Engine(makeState());
 for(const [tab,action] of [['factories','build'],['research','research'],['fabrication','craft'],['artifacts','forge'],['prestige','prestige']]){
  UI.tab=tab;assert.ok(contentHtml(e).includes(`data-action="${action}"`));
 }
 UI.tab='dashboard';
});
test('resource and nav displays include all groups and properly escape text',()=>{
 const e=new Engine(makeState());
 assert.equal((resourceHtml(e).match(/class="resource-item"/g)||[]).length,32);
 assert.equal((navHtml().match(/class="nav-item/g)||[]).length,11);
 assert.ok(topHtml(e).includes('MATTER'));
 assert.equal(esc('<script>alert("x")</script>'),'&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});
