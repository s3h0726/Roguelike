import {UNIT_BY_ID,TRAITS} from './data.js';
import {cellPoint} from './engine.js';
const TWO=Math.PI*2;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const hex=(ctx,x,y,r,rotation=0)=>{ctx.beginPath();for(let i=0;i<6;i++){const a=i*TWO/6+rotation;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();};
const circle=(ctx,x,y,r)=>{ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,TWO);};

export class Renderer{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.particles=[];this.effects=[];this.texts=[];this.clock=0;this.shake=0;this.flash=0;this.vfx=true;
    this.stars=Array.from({length:130},()=>({x:rand(0,960),y:rand(0,480),r:rand(.5,2),a:rand(.13,.9),phase:rand(0,6)}));
  }
  emit(type,p={}){
    const c=p.color||'#c18aff';
    if(type==='banner'){this.bannerCallback?.(p.text,c);return;}
    if(type==='quake'){this.shake=Math.max(this.shake,p.strength||5);return;}
    if(type==='text'){this.texts.push({...p,life:1,maxLife:1});return;}
    if(type==='hit'){this.burst(p.x,p.y,c,p.critical?24:10,p.critical?240:170);this.texts.push({x:p.x,y:p.y-20,text:String(p.damage),color:c,life:.6,maxLife:.6});return;}
    if(type==='muzzle'){this.burst(p.x,p.y,c,6,85);return;}
    if(type==='ember'){this.burst(p.x,p.y,'#ff815e',3,65);return;}
    if(type==='heal'){this.burst(p.x,p.y,c,23,130);this.effects.push({type:'circle',x:p.x,y:p.y,color:c,life:.55,maxLife:.55,radius:70});return;}
    if(type==='fuse'){this.burst(p.x,p.y,c,80,310);this.effects.push({type:'glyph',x:p.x,y:p.y,color:c,life:1.3,maxLife:1.3,radius:125});this.texts.push({x:p.x,y:p.y-40,text:p.text,color:'#ffe7af',life:1.4,maxLife:1.4});this.shake=13;return;}
    if(type==='death'){this.burst(p.x,p.y,c,p.boss?130:34,p.boss?360:210);this.effects.push({type:'circle',x:p.x,y:p.y,color:c,life:p.boss?.9:.45,maxLife:p.boss?.9:.45,radius:p.boss?210:85});if(p.boss)this.shake=23;return;}
    if(type==='cast'){this.burst(p.x,p.y,c,16,115);this.effects.push({type:'glyph',x:p.x,y:p.y,color:c,life:.6,maxLife:.6,radius:67});return;}
    if(type==='shield'||type==='rune'){this.effects.push({type:'glyph',x:p.x,y:p.y,color:c,life:.9,maxLife:.9,radius:type==='shield'?145:110});this.burst(p.x,p.y,c,24,150);return;}
    if(type==='warning'){this.effects.push({type:'warning',x:p.x,y:p.y,color:c,life:.7,maxLife:.7,radius:p.radius||125});return;}
    if(type==='lightning'){this.effects.push({type:'lightning',from:p.from,to:p.to,color:c,life:.28,maxLife:.28});this.burst(p.to.x,p.to.y,c,12,160);return;}
    if(type==='beam'){this.effects.push({type:'beam',from:p.from,to:p.to,color:c,life:.5,maxLife:.5});this.burst(p.to.x,p.to.y,c,52,270);this.shake=8;return;}
    if(type==='slash'){this.effects.push({type:'slash',x:p.x,y:p.y,color:c,life:.23,maxLife:.23,radius:72,rot:rand(-2,2)});this.burst(p.x,p.y,c,8,140);return;}
    if(type==='vortex'){this.effects.push({type:'vortex',x:p.x,y:p.y,color:c,life:.85,maxLife:.85,radius:p.radius||200});this.burst(p.x,p.y,c,45,220);return;}
    if(type==='ring'||type==='shock'){this.effects.push({type:'circle',x:p.x,y:p.y,color:c,life:.65,maxLife:.65,radius:p.radius||180});this.burst(p.x,p.y,c,35,240);this.shake=9;return;}
    if(type==='apocalypse'){this.effects.push({type:'glyph',x:p.x,y:p.y,color:c,life:.8,maxLife:.8,radius:p.radius||400});this.effects.push({type:'warning',x:p.x,y:p.y,color:c,life:.7,maxLife:.7,radius:p.radius||400});this.burst(p.x,p.y,c,60,230);this.shake=11;return;}
    if(type==='impact'||type==='supernova'){
      const big=type==='supernova';this.burst(p.x,p.y,c,big?180:85,big?530:340);
      this.effects.push({type:'circle',x:p.x,y:p.y,color:'#fff',life:.6,maxLife:.6,radius:big?700:p.radius||240});
      this.effects.push({type:'glyph',x:p.x,y:p.y,color:c,life:big?1.1:.65,maxLife:big?1.1:.65,radius:big?380:180});
      this.shake=big?25:16;this.flash=big?.9:.40;return;
    }
  }
  burst(x,y,color,n,speed){const count=this.vfx?n:Math.ceil(n*.34);const max=this.vfx?760:260;
    for(let i=0;i<count&&this.particles.length<max;i++){
      const a=rand(0,TWO),v=rand(speed*.15,speed),life=rand(.25,.8);
      this.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,color,life,maxLife:life,size:rand(1.5,5.2),shape:i%6===0?'streak':'orb'});
    }
  }
  backdrop(game){const g=this.ctx,t=this.clock;const grad=g.createLinearGradient(0,0,960,480);grad.addColorStop(0,'#08132c');grad.addColorStop(.47,'#111026');grad.addColorStop(1,'#250d22');g.fillStyle=grad;g.fillRect(0,0,960,480);
    // Large translucent colored nebulae behind a subtly animated starfield.
    const nebulas=[[170,100,190,'#2363b0'],[760,325,260,'#933466'],[480,240,210,'#55327d']];
    for(const [x,y,r,c] of nebulas){const v=g.createRadialGradient(x+Math.sin(t*.11)*20,y,8,x,y,r);v.addColorStop(0,c+'40');v.addColorStop(1,c+'00');g.fillStyle=v;g.fillRect(x-r,y-r,r*2,r*2);}
    for(const s of this.stars){g.globalAlpha=s.a*(.70+.3*Math.sin(t*1.2+s.phase));g.fillStyle='#cee5ff';circle(g,s.x,s.y,s.r);g.fill();}g.globalAlpha=1;
    // Floor: two tactical zones with a luminous divide and diamond texture.
    g.fillStyle='#438eff08';g.fillRect(0,0,480,480);g.fillStyle='#ff75900a';g.fillRect(480,0,480,480);
    g.strokeStyle='#91beff17';g.lineWidth=1;
    for(let i=0;i<=8;i++){g.beginPath();g.moveTo(i*120,0);g.lineTo(i*120,480);g.stroke();}
    for(let j=0;j<=4;j++){g.beginPath();g.moveTo(0,j*120);g.lineTo(960,j*120);g.stroke();}
    for(let row=0;row<4;row++)for(let col=0;col<8;col++){
      const {x,y}=cellPoint(col,row);g.strokeStyle=col<4?'#70caff21':'#ff748c18';g.lineWidth=1;
      hex(g,x,y,49,Math.PI/6);g.stroke();
      g.fillStyle=col<4?'#6bbfff08':'#ff7b9c07';hex(g,x,y,42,Math.PI/6);g.fill();
      g.fillStyle=col<4?'#8abfff38':'#ff85a640';circle(g,x,y,1.5);g.fill();
    }
    g.strokeStyle='#cbb3ff5b';g.lineWidth=2;g.shadowColor='#9a7aff';g.shadowBlur=16;
    g.beginPath();g.moveTo(480,0);g.lineTo(480,480);g.stroke();g.shadowBlur=0;
    g.save();g.translate(480,240);g.rotate(t*.05);g.strokeStyle='#ccbdff13';g.lineWidth=2;
    for(let r=135;r<400;r+=90){circle(g,0,0,r);g.stroke();}g.restore();
    const vignette=g.createRadialGradient(480,240,80,480,240,560);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#00000089');g.fillStyle=vignette;g.fillRect(0,0,960,480);
    if(game.phase==='prep'){const glow=g.createLinearGradient(0,0,480,0);glow.addColorStop(0,'#80dfff0c');glow.addColorStop(1,'#80dfff02');g.fillStyle=glow;g.fillRect(0,0,480,480);}
  }
  fighter(u,prep=false){const g=this.ctx;const t=UNIT_BY_ID[u.type];const x=u.x,y=u.y;
    const r=(u.boss?36:24)+(u.star-1)*4;
    const enemy=u.team==='enemy';const aura=u.color;
    g.save();g.translate(x,y);
    if(!prep){g.fillStyle='#0009';g.beginPath();g.ellipse(0,r*.9,r*1.25,r*.43,0,0,TWO);g.fill();}
    const back=g.createRadialGradient(0,0,1,0,0,r*2.7);back.addColorStop(0,aura+'65');back.addColorStop(.46,aura+'23');back.addColorStop(1,aura+'00');g.fillStyle=back;circle(g,0,0,r*2.7);g.fill();
    g.lineWidth=2;g.strokeStyle=aura+'cc';g.shadowBlur=14;g.shadowColor=aura;
    hex(g,0,0,r+7,Math.PI/6+Math.sin(this.clock*1.7)*.02);g.stroke();g.shadowBlur=0;
    const fill=g.createLinearGradient(-r,-r,r,r);fill.addColorStop(0,enemy?'#49203b':'#1b3353');fill.addColorStop(1,enemy?'#17101e':'#14162c');g.fillStyle=fill;hex(g,0,0,r,Math.PI/6);g.fill();
    g.strokeStyle=aura+'6d';g.lineWidth=1;hex(g,0,0,r-5,Math.PI/6);g.stroke();
    g.fillStyle=aura;g.font=`900 ${u.boss?35:29}px system-ui, sans-serif`;g.textAlign='center';g.textBaseline='middle';g.shadowBlur=18;g.shadowColor=aura;g.fillText(t.icon,0,1);g.shadowBlur=0;
    if(!prep){
      const width=u.boss?90:73;const life=clamp(u.hp/u.maxHp,0,1);
      g.fillStyle='#030711ed';g.fillRect(-width/2,-r-29,width,7);g.fillStyle=enemy?'#fd768d':'#83e9bb';g.fillRect(-width/2,-r-29,width*life,7);
      if(u.shield>0){g.strokeStyle='#b5dbff';g.lineWidth=3;g.beginPath();g.arc(0,0,r+11,Math.PI*.1,Math.PI*1.9);g.stroke();g.fillStyle='#cde9ff';g.fillRect(-width/2,-r-20,width*clamp(u.shield/135,0,1),2);}
      g.fillStyle='#b99fff';g.fillRect(-width/2,-r-18,width*clamp(u.mana/u.maxMana,0,1),3);
      if(u.burnTime>0){g.strokeStyle='#ff835b';g.lineWidth=2;circle(g,0,0,r+14);g.stroke();}
    }
    g.fillStyle='#e5eeff';g.shadowColor='#000';g.shadowBlur=8;g.font=`800 ${u.boss?14:12}px system-ui`;g.fillText(t.name,0,r+21);g.shadowBlur=0;
    g.fillStyle='#ffd990';g.font='900 12px system-ui';g.fillText('★'.repeat(u.star),0,r+35);
    g.restore();
  }
  drawFX(dt){const g=this.ctx;g.save();g.globalCompositeOperation='screen';
    for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];e.life-=dt;if(e.life<=0){this.effects.splice(i,1);continue;}
      const f=1-e.life/e.maxLife,a=clamp(e.life/e.maxLife,0,1);
      g.save();g.globalAlpha=Math.min(1,a*1.2);g.strokeStyle=e.color;g.fillStyle=e.color;g.shadowColor=e.color;g.shadowBlur=24;
      if(e.type==='circle'){g.lineWidth=9*(1-f)+1;circle(g,e.x,e.y,e.radius*f);g.stroke();g.lineWidth=2;circle(g,e.x,e.y,e.radius*f*.79);g.stroke();}
      if(e.type==='glyph'||e.type==='vortex'){
        g.translate(e.x,e.y);g.rotate(this.clock*(e.type==='vortex'?2:-1));const r=e.radius*(e.type==='vortex'?.7+f*.3:.55+f*.25);
        for(let k=0;k<3;k++){g.lineWidth=k===0?4:1.5;circle(g,0,0,r*(.54+k*.22));g.stroke();}
        g.lineWidth=2;for(let k=0;k<8;k++){const ang=k*TWO/8;const px=Math.cos(ang)*r,py=Math.sin(ang)*r;hex(g,px,py,10,ang);g.stroke();}
        for(let k=0;k<2;k++){g.rotate(.15);g.beginPath();for(let n=0;n<6;n++){const an=n*TWO/6;const rad=n%2===0?r*.72:r*.22;n?g.lineTo(Math.cos(an)*rad,Math.sin(an)*rad):g.moveTo(Math.cos(an)*rad,Math.sin(an)*rad);}g.closePath();g.stroke();}
      }
      if(e.type==='warning'){g.lineWidth=2+Math.sin(this.clock*25)*1.2;g.setLineDash([11,8]);circle(g,e.x,e.y,e.radius*(.9+.1*f));g.stroke();g.setLineDash([]);g.fillStyle=e.color+'24';circle(g,e.x,e.y,e.radius*.75);g.fill();}
      if(e.type==='slash'){g.translate(e.x,e.y);g.rotate(e.rot);g.lineWidth=9*a;g.beginPath();g.arc(0,0,e.radius*(.6+f),-2,1.3);g.stroke();}
      if(e.type==='beam'||e.type==='lightning'){
        g.lineCap='round';const x1=e.from.x,y1=e.from.y,x2=e.to.x,y2=e.to.y;
        const trace=()=>{g.beginPath();g.moveTo(x1,y1);if(e.type==='lightning'){for(let j=1;j<7;j++){const k=j/7;g.lineTo(x1+(x2-x1)*k+rand(-16,16),y1+(y2-y1)*k+rand(-16,16));}}g.lineTo(x2,y2);g.stroke();};
        g.lineWidth=e.type==='beam'?26:15;g.globalAlpha=a*.28;trace();g.lineWidth=e.type==='beam'?12:6;g.globalAlpha=a*.8;trace();g.lineWidth=2;g.strokeStyle='#ffffff';g.globalAlpha=a;trace();
      }
      g.restore();
    }
    for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.particles.splice(i,1);continue;}
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.96,dt*60);p.vy*=Math.pow(.96,dt*60);
      const a=p.life/p.maxLife;g.globalAlpha=a;g.fillStyle=p.color;g.strokeStyle=p.color;g.shadowColor=p.color;g.shadowBlur=this.vfx?12:3;
      if(p.shape==='streak'){g.lineWidth=Math.max(.5,p.size*.4*a);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.042,p.y-p.vy*.042);g.stroke();}
      else {circle(g,p.x,p.y,p.size*a);g.fill();}
    }
    g.restore();g.save();for(let i=this.texts.length-1;i>=0;i--){const d=this.texts[i];d.life-=dt;if(d.life<=0){this.texts.splice(i,1);continue;}d.y-=dt*35;g.globalAlpha=d.life/d.maxLife;g.font=`900 ${d.text.length>5?16:21}px system-ui`;g.textAlign='center';g.fillStyle=d.color;g.shadowColor='#000';g.shadowBlur=7;g.fillText(d.text,d.x,d.y);}g.restore();
  }
  render(game,dt){this.clock+=Math.min(dt,.05);this.vfx=game.ultra;const g=this.ctx;
    g.save();const shake=this.shake;g.translate(rand(-shake,shake),rand(-shake,shake));this.shake=Math.max(0,this.shake-dt*55);
    this.backdrop(game);
    if(game.phase==='prep'||game.phase==='result'||game.phase==='over'){
      for(const u of game.enemyPreview){const p=cellPoint(u.col,u.row);this.fighter({...u,...p,team:'enemy',color:UNIT_BY_ID[u.type].color,hp:1,maxHp:1,shield:0,mana:0,maxMana:1},true);}
      for(const u of game.board()){const p=cellPoint(u.col,u.row);this.fighter({...u,...p,team:'ally',color:UNIT_BY_ID[u.type].color,hp:1,maxHp:1,shield:0,mana:0,maxMana:1},true);}
    }else{
      for(const u of game.combatUnits.filter(x=>!x.dead))this.fighter(u);
      g.save();g.globalCompositeOperation='screen';for(const p of game.projectiles){g.strokeStyle=p.color;g.shadowColor=p.color;g.shadowBlur=17;g.lineWidth=4;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-(p.target.x-p.x)*.10,p.y-(p.target.y-p.y)*.10);g.stroke();g.fillStyle='#fff';circle(g,p.x,p.y,5);g.fill();}g.restore();
    }
    this.drawFX(dt);g.restore();
    if(this.flash>0){g.fillStyle=`rgba(222,194,255,${Math.min(.85,this.flash*.62)})`;g.fillRect(0,0,960,480);this.flash=Math.max(0,this.flash-dt*2.9);}
  }
}