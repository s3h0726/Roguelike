import { ARENA } from './data.js';

// Dedicated Canvas2D renderer. The game simulation remains renderer-independent.
const TAU = Math.PI * 2;
const minmax = (x, a, b) => Math.max(a, Math.min(b, x));
const rgba = (hex, opacity) => {
  const h = (hex || '#ffffff').replace('#', '');
  if (h.length !== 6) return `rgba(255,255,255,${opacity})`;
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${opacity})`;
};
const random = (min, max) => min + Math.random() * (max - min);

export class CanvasBattleRenderer {
  constructor(root) {
    this.root = root;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'battle-canvas';
    this.canvas.setAttribute('aria-label', 'Cosmic battlefield');
    this.ctx = this.canvas.getContext('2d', {alpha: false});
    root.prepend(this.canvas);
    this.quality = 'ultra';
    this.particles = [];
    this.effects = [];
    this.floaters = [];
    this.stars = [];
    this.camera = {x: 0, y: 0};
    this.time = 0;
    this.shake = 0;
    this.flash = 0;
    this.flashColor = '#ffffff';
    this.width = 1;
    this.height = 1;
    this.resize();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(root);
  }

  resize() {
    this.width = Math.max(1, this.root.clientWidth);
    this.height = Math.max(1, this.root.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality === 'ultra' ? 2 : 1.35);
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.scale = Math.min(this.width / 38, this.height / 25);
    this.stars = Array.from({length: this.quality === 'ultra' ? 210 : 100}, (_, i) => ({
      x: Math.random() * (this.width + 20), y: Math.random() * (this.height + 20),
      r: random(.4, i % 10 === 0 ? 2 : 1.25),
      opacity: random(.12, .68), speed: random(.03, .35), phase: random(0, TAU),
      tint: i % 9 === 0 ? '#ffb8ef' : i % 5 === 0 ? '#83ddff' : '#fff5ff'
    }));
    this.bg = this.buildBackground();
  }

  buildBackground() {
    const bg = document.createElement('canvas');
    const cw = Math.max(1, Math.floor(this.width * .5));
    const ch = Math.max(1, Math.floor(this.height * .5));
    bg.width = cw; bg.height = ch;
    const b = bg.getContext('2d');
    const base = b.createLinearGradient(0, 0, cw, ch);
    base.addColorStop(0, '#080e22'); base.addColorStop(.5, '#06071c'); base.addColorStop(1, '#090718');
    b.fillStyle = base; b.fillRect(0,0,cw,ch);
    const clouds = [
      [.21,.25,.48,'#33207c',.46], [.77,.44,.61,'#172f71',.39],
      [.44,.83,.48,'#6d1754',.27], [.92,.08,.31,'#2e4b79',.23]
    ];
    for (const [x,y,r,color,a] of clouds) {
      const R = Math.max(cw,ch)*r;
      const g=b.createRadialGradient(cw*x,ch*y,0,cw*x,ch*y,R);
      g.addColorStop(0,rgba(color,a));g.addColorStop(.42,rgba(color,a*.38));g.addColorStop(1,rgba(color,0));
      b.fillStyle=g;b.fillRect(0,0,cw,ch);
    }
    return bg;
  }

  setQuality(q) {
    const quality = q === 'lite' ? 'lite' : 'ultra';
    if (this.quality === quality) return;
    this.quality=quality;
    this.resize();
    if (quality === 'lite' && this.particles.length > 320) this.particles.splice(0,this.particles.length-320);
  }

  world(x,y) {return [this.width*.5 + (x-this.camera.x)*this.scale, this.height*.51+(y-this.camera.y)*this.scale];}

  circle(x,y,r,color,blur=0) {
    const c=this.ctx;
    if (r <= 0) return;
    c.fillStyle=color;
    if(blur){c.shadowColor=color;c.shadowBlur=blur;}
    c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    if(blur)c.shadowBlur=0;
  }
  line(x1,y1,x2,y2,width,color,blur=0) {
    const c=this.ctx;
    c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';
    if(blur){c.shadowBlur=blur;c.shadowColor=color;}
    c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
    if(blur)c.shadowBlur=0;
  }

  burst(e, count, speed=8, life=.8, kind='spark') {
    const cap = this.quality==='ultra'?1450:410;
    count=Math.min(count,this.quality==='ultra'?230:48,Math.max(0,cap-this.particles.length));
    for(let i=0;i<count;i++){
      const a=random(0,TAU), v=random(speed*.2,speed);
      this.particles.push({x:e.x||0,y:e.y||0,px:e.x||0,py:e.y||0,
        vx:Math.cos(a)*v,vy:Math.sin(a)*v,
        max:random(life*.5,life*1.3),life:0,
        size:random(.055,.18),color:e.color||'#ffffff',kind,
        rotation:random(-2,2)});
    }
  }

  consume(events) {
    for(const e of events){
      switch(e.type){
        case 'ultimate':
          this.effects.push({...e,age:0,life:1.45});
          this.burst(e,240,23,1.5,'streak');
          this.burst(e,120,10,1.8,'spark');
          this.shake=Math.max(this.shake,22);
          this.flash=Math.max(this.flash,.78);
          this.flashColor='#dbaaff';break;
        case 'pulse':
          this.effects.push({...e,age:0,life:.60});
          this.burst(e,(e.r||4)>9?60:22,7,.66);break;
        case 'meteor':
          this.effects.push({...e,age:0,life:.93});
          this.burst(e,75,11,1,'streak');
          this.shake=Math.max(this.shake,7);break;
        case 'beam':
          this.effects.push({...e,age:0,life:e.kind==='warning'?.20:.34});
          this.burst(e,14,6,.35);break;
        case 'spawn':
          this.effects.push({...e,type:'portal',age:0,life:.77});
          this.burst(e,16,4,.65);break;
        case 'burst':
          this.burst(e,e.count||25,e.count>100?17:8,e.count>100?1.4:.7,'streak');
          if((e.count||0)>100)this.shake=Math.max(this.shake,12);break;
        case 'hit':
          this.burst(e,e.crit?13:5,5,.38);
          if(e.crit) this.effects.push({...e,type:'crit',age:0,life:.32});
          if(this.floaters.length<100)this.floaters.push({x:e.x,y:e.y,text:`${e.crit?'✦ ':''}${e.amount||''}`,
            color:e.crit?'#ffe69c':'#f6e6ff',age:0,life:.75,dx:random(-.7,.7)});
          break;
        case 'heroHit':
          this.shake=Math.max(this.shake,12);this.flash=.22;this.flashColor='#ff5275';
          this.burst(e,34,7,.7);break;
        case 'trail':this.burst(e,3,2,.33,'ember');break;
        case 'muzzle':this.burst(e,4,4,.22);break;
        case 'xp':this.burst(e,5,3,.32);break;
      }
    }
    // Rejected old effects cannot consume unbounded memory in long survival runs.
    if(this.effects.length>90)this.effects.splice(0,this.effects.length-90);
  }

  background(s){
    const c=this.ctx,w=this.width,h=this.height;
    c.drawImage(this.bg,0,0,w,h);
    for(const st of this.stars){
      let x=(st.x - this.camera.x*st.speed*4)%(w+20);
      let y=(st.y - this.camera.y*st.speed*4)%(h+20);
      if(x<0)x+=w+20;if(y<0)y+=h+20;
      const alpha=st.opacity*(.78+.22*Math.sin(this.time*1.3+st.phase));
      this.circle(x,y,st.r,rgba(st.tint,alpha));
    }
    const left=this.camera.x-w/(2*this.scale)-2,top=this.camera.y-h/(2*this.scale)-2;
    c.strokeStyle='rgba(124,107,215,.085)';c.lineWidth=1;
    let x=Math.floor(left/2)*2;
    for(;x<this.camera.x+w/(2*this.scale)+4;x+=2){let px=this.world(x,0)[0];c.beginPath();c.moveTo(px,0);c.lineTo(px,h);c.stroke();}
    let y=Math.floor(top/2)*2;
    for(;y<this.camera.y+h/(2*this.scale)+4;y+=2){let py=this.world(0,y)[1];c.beginPath();c.moveTo(0,py);c.lineTo(w,py);c.stroke();}
    const [minx,miny]=this.world(-ARENA.width/2,-ARENA.height/2);
    c.save();c.lineWidth=2;c.strokeStyle='rgba(171,124,255,.55)';
    c.shadowColor='#a576ff';c.shadowBlur=18;
    c.strokeRect(minx,miny,ARENA.width*this.scale,ARENA.height*this.scale);
    c.restore();
    const fog=c.createRadialGradient(w*.5,h*.5,h*.2,w*.5,h*.5,Math.max(w,h)*.82);
    fog.addColorStop(0,'rgba(4,2,18,0)');fog.addColorStop(1,'rgba(4,1,12,.67)');
    c.fillStyle=fog;c.fillRect(0,0,w,h);
    if(s.stage%4===0){let a=.06+.03*Math.sin(this.time*2);c.fillStyle=`rgba(165,24,87,${a})`;c.fillRect(0,0,w,h);}
  }

  drawArenaSymbols(){
    const c=this.ctx;
    // Faint ritual geometry makes the floor feel hand-crafted rather than an empty grid.
    const positions=[[-12,-9],[11,8],[-12,8],[11,-9]];
    for(const [px,py] of positions){
      const [x,y]=this.world(px,py),r=this.scale*1.9;
      if(x<-r||x>this.width+r||y<-r||y>this.height+r)continue;
      c.save();c.translate(x,y);c.rotate(this.time*.018);
      c.strokeStyle='rgba(139,114,250,.13)';c.lineWidth=1;
      c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();
      for(let i=0;i<6;i++){const a=i*TAU/6;c.beginPath();c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(Math.cos(a+TAU/3)*r,Math.sin(a+TAU/3)*r);c.stroke();}
      c.restore();
    }
  }

  drawPickups(s){
    const c=this.ctx;
    c.save();c.globalCompositeOperation='lighter';
    for(const g of s.pickups){
      const [x,y]=this.world(g.x,g.y);if(x<-30||x>this.width+30||y<-30||y>this.height+30)continue;
      const radius=2.8+Math.sin(this.time*5+g.x)*.6;
      this.circle(x,y,radius*2.2,rgba('#56ffe0',.16));
      this.circle(x,y,radius,'#98ffe5',7);
      c.save();c.translate(x,y);c.rotate(this.time*2);
      c.strokeStyle='rgba(194,255,237,.9)';c.lineWidth=1;c.strokeRect(-radius*.85,-radius*.85,radius*1.7,radius*1.7);
      c.restore();
    }
    c.restore();
  }

  drawEnemies(s){
    const c=this.ctx;
    for(const m of s.enemies){
      if(m.hp<=0)continue;
      const [x,y]=this.world(m.x,m.y),r=Math.max(7,m.r*this.scale);
      if(x<-r-80||x>this.width+r+80||y<-r-80||y>this.height+r+80)continue;
      const boss=m.type==='boss';
      c.save();c.translate(x,y);
      const rotation=this.time*(boss?.34:m.type==='specter'?-.75:.6)+m.id;
      c.rotate(rotation);
      this.circle(0,0,r*1.38,rgba(m.color,boss?.24:.12));
      const sides=boss?9:m.type==='bulwark'?6:m.type==='specter'?4:m.type==='bomber'?8:3;
      if(boss){
        c.strokeStyle='rgba(255,107,205,.4)';c.lineWidth=2;
        c.beginPath();c.arc(0,0,r*1.5,0,TAU);c.stroke();
        for(let i=0;i<12;i++){let a=i*TAU/12;this.line(Math.cos(a)*r*1.55,Math.sin(a)*r*1.55,Math.cos(a)*r*1.7,Math.sin(a)*r*1.7,2,'#ffa0e0');}
      }
      c.shadowColor=m.color;c.shadowBlur=boss?28:13;c.fillStyle=rgba(m.color,.75);
      c.beginPath();for(let i=0;i<sides;i++){
        const a=i*TAU/sides-Math.PI/2;
        let mod=(i%2&&m.type==='bomber')?.73:1;
        const xx=Math.cos(a)*r*mod,yy=Math.sin(a)*r*mod;
        if(!i)c.moveTo(xx,yy);else c.lineTo(xx,yy);
      }c.closePath();c.fill();c.lineWidth=2;c.strokeStyle=rgba('#ffffff',boss?.9:.6);c.stroke();c.shadowBlur=0;
      c.rotate(-rotation);
      this.circle(0,0,r*(boss?.52:.40),rgba('#10091e',.82));
      this.circle(0,0,r*.18,boss?'#fff0fb':'#efddff',boss?15:6);
      c.restore();
      if(boss||m.hp<m.maxHp){
        const bw=boss?Math.max(72,r*2):Math.max(25,r*1.65);
        c.fillStyle='rgba(8,8,23,.82)';c.fillRect(x-bw/2,y-r-14,bw,4);
        c.fillStyle=m.color;c.fillRect(x-bw/2,y-r-14,bw*minmax(m.hp/m.maxHp,0,1),4);
      }
    }
  }

  drawShots(s){
    const c=this.ctx;
    c.save();c.globalCompositeOperation='lighter';
    for(const p of s.shots.concat(s.enemyShots)){
      const [x,y]=this.world(p.x,p.y),r=minmax((p.r||.25)*this.scale,3.2,13);
      if(x<-30||x>this.width+30||y<-30||y>this.height+30)continue;
      const angle=Math.atan2(p.vy,p.vx),tail=Math.min(32,r*5);
      this.line(x-Math.cos(angle)*tail,y-Math.sin(angle)*tail,x,y,Math.max(2,r*1.15),rgba(p.color,.35),12);
      this.circle(x,y,r*1.8,rgba(p.color,.20));
      this.circle(x,y,r,p.color,16);
      this.circle(x,y,r*.35,'#ffffff',8);
    }
    c.restore();
  }

  drawHero(s){
    const h=s.hero;if(!h)return;
    const c=this.ctx,[x,y]=this.world(h.x,h.y),r=Math.max(11,this.scale*.68),theta=h.aim+Math.PI/2;
    c.save();c.translate(x,y);
    const halo=r*(1.48+.06*Math.sin(this.time*6));
    c.rotate(this.time*.45);
    c.strokeStyle=rgba(h.color,.32);c.lineWidth=2;
    c.setLineDash([8,6]);c.beginPath();c.arc(0,0,halo,0,TAU);c.stroke();c.setLineDash([]);
    for(let i=0;i<4;i++){const a=i*TAU/4;this.circle(Math.cos(a)*halo,Math.sin(a)*halo,2.6,h.color,8);}
    c.rotate(-this.time*.45);
    if(h.shield>0){c.strokeStyle='rgba(109,218,255,.72)';c.lineWidth=3;c.shadowColor='#52c8ff';c.shadowBlur=18;c.beginPath();c.arc(0,0,r*1.85,0,TAU);c.stroke();c.shadowBlur=0;}
    if(h.dashTime>0){this.circle(0,0,r*2.9,rgba(h.color,.16),15);}
    c.rotate(theta);
    c.shadowColor=h.color;c.shadowBlur=23;
    c.fillStyle=rgba(h.color,h.invuln>0?.75:1);
    c.beginPath();c.moveTo(0,-r*1.3);c.lineTo(r*.94,r*.85);c.lineTo(0,r*.48);c.lineTo(-r*.94,r*.85);c.closePath();c.fill();
    c.shadowBlur=0;c.strokeStyle='#ffffff';c.lineWidth=2;c.stroke();
    c.beginPath();c.moveTo(0,-r*.83);c.lineTo(0,r*.43);c.strokeStyle='rgba(255,255,255,.75)';c.stroke();
    this.circle(0,-r*.1,r*.25,'#fff9ff',9);
    c.restore();
    if(h.abilities.orbit){const count=1+Math.floor(h.abilities.orbit*.8);
      for(let i=0;i<count;i++){const a=s.elapsed*2.5+i*TAU/count;
        const [bx,by]=this.world(h.x+Math.cos(a)*(2.4+h.abilities.orbit*.32),h.y+Math.sin(a)*(2.4+h.abilities.orbit*.32));
        c.save();c.translate(bx,by);c.rotate(a+Math.PI/2);
        c.shadowColor='#ff79d8';c.shadowBlur=18;c.fillStyle='#ff92e5';
        c.beginPath();c.moveTo(0,-12);c.lineTo(7,1);c.lineTo(0,9);c.lineTo(-7,1);c.closePath();c.fill();c.restore();
      }
    }
  }

  drawRunes(x,y,r,progress,color,age=0,alpha=1){
    const c=this.ctx;
    c.save();c.translate(x,y);c.globalAlpha*=alpha;c.strokeStyle=color;
    c.shadowColor=color;c.shadowBlur=this.quality==='ultra'?18:7;
    c.lineWidth=2;
    c.beginPath();c.arc(0,0,r,0,TAU);c.stroke();
    c.beginPath();c.arc(0,0,r*.74,0,TAU);c.stroke();
    c.rotate(age*1.9);
    for(let i=0;i<12;i++){
      const a=i*TAU/12;
      this.line(Math.cos(a)*r*.83,Math.sin(a)*r*.83,Math.cos(a)*r*.99,Math.sin(a)*r*.99,i%3===0?3:1.5,color);
    }
    c.rotate(-age*3);
    for(let i=0;i<6;i++){
      const a=i*TAU/6;
      c.beginPath();c.moveTo(Math.cos(a)*r*.66,Math.sin(a)*r*.66);
      c.lineTo(Math.cos(a+TAU/3)*r*.66,Math.sin(a+TAU/3)*r*.66);c.stroke();
    }
    c.restore();
  }

  drawEffects(dt){
    const c=this.ctx;
    c.save();c.globalCompositeOperation='lighter';
    for(let i=this.effects.length-1;i>=0;i--){
      const f=this.effects[i];f.age+=dt;
      const t=minmax(f.age/f.life,0,1);
      if(t>=1){this.effects.splice(i,1);continue;}
      const [x,y]=this.world(f.x||0,f.y||0);
      const color=f.color||'#b98dff';
      if(f.type==='beam'){
        const [endX,endY]=this.world(f.toX,f.toY),life=1-t;
        c.globalAlpha=life;
        if(f.kind==='lightning'){
          const dx=endX-x,dy=endY-y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
          const segs=Math.max(5,Math.ceil(len/17));
          const path=[];
          for(let z=0;z<=segs;z++){
            const u=z/segs,offset=z===0||z===segs?0:Math.sin(z*13.58+f.age*65)*Math.min(15,len*.095);
            path.push([x+dx*u+nx*offset,y+dy*u+ny*offset]);
          }
          for(const [w,alpha,clr] of [[13,.25,color],[5,.8,color],[1.8,1,'#ffffff']]){
            c.strokeStyle=clr;c.globalAlpha=life*alpha;c.lineWidth=w;
            c.shadowBlur=w*1.4;c.shadowColor=clr;c.beginPath();
            path.forEach(([px,py],z)=>z?c.lineTo(px,py):c.moveTo(px,py));c.stroke();
          }
          this.circle(endX,endY,8,color,22);
        }else{
          this.line(x,y,endX,endY,f.kind==='warning'?3:24,rgba(color,.20),23);
          this.line(x,y,endX,endY,f.kind==='warning'?1:10,rgba(color,.80),20);
          this.line(x,y,endX,endY,2,'rgba(255,255,255,.95)',14);
          if(f.kind!=='warning')for(let j=0;j<5;j++){
            let px=x+(endX-x)*(j/5),py=y+(endY-y)*(j/5);
            this.circle(px,py,3+Math.random()*5,color,11);
          }
        }
        c.shadowBlur=0;c.globalAlpha=1;continue;
      }
      if(f.type==='meteor'){
        const radius=Math.max(7,(f.r||3)*this.scale),impact=.52;
        c.globalAlpha=t<impact?.25+t*.55:(1-t)*2;
        if(t<impact){
          this.drawRunes(x,y,radius*.76,.8,color,f.age,.62);
          const fall=1-t/impact;
          const sx=x+fall*radius*1.45,sy=y-fall*(radius*2.7+180);
          this.line(sx+radius*.7,sy-radius*1.9,sx,sy,Math.max(6,radius*.29),rgba(color,.22),30);
          this.line(sx+radius*.3,sy-radius*1.1,sx,sy,Math.max(2,radius*.13),color,22);
          this.circle(sx,sy,Math.max(8,radius*.22),'#fff7dc',27);
        }else{
          let p=(t-impact)/(1-impact);
          this.circle(x,y,radius*(.3+p*1.7),rgba(color,(1-p)*.18),34);
          c.strokeStyle=color;c.lineWidth=Math.max(2,9*(1-p));c.shadowBlur=24;c.shadowColor=color;
          c.beginPath();c.arc(x,y,radius*p*1.9,0,TAU);c.stroke();c.shadowBlur=0;
          if(p<.12){this.circle(x,y,radius*.48,'#fff0cf',38);}
        }
        c.globalAlpha=1;continue;
      }
      if(f.type==='ultimate'){
        const R=Math.max(20,(f.r||16)*this.scale),p=t<.16?t/.16:1;
        c.globalAlpha=Math.min(1,p*2)*Math.pow(1-t,.45);
        // Pre-cast multiple expanding sigils before the shockwave overtakes the arena.
        if(t<.72)this.drawRunes(x,y,R*(.30+.28*t),1,color,f.age,1-t*.55);
        if(t>.12){
          const q=minmax((t-.12)/.77,0,1);
          for(let ring=0;ring<3;ring++){
            let v=minmax(q*1.22-ring*.12,0,1);
            if(v<=0||v>=1)continue;
            c.strokeStyle=ring===1?'#fef1ff':color;
            c.shadowColor=color;c.shadowBlur=36*(1-v);
            c.lineWidth=(ring===1?8:16)*(1-v)+1;
            c.beginPath();c.arc(x,y,R*v,0,TAU);c.stroke();
          }
          c.shadowBlur=0;
        }
        if(t<.47){
          const a=(.47-t)/.47;
          this.circle(x,y,R*(.15+t*.27),rgba(color,.14*a),35);
          this.circle(x,y,R*.11*a,'#fff4ff',45);
        }
        const spokes=24;
        for(let j=0;j<spokes;j++){
          const a=j*TAU/spokes+t*.35;
          const inner=R*(.12+t*.12),outer=R*(.16+t*.70);
          this.line(x+Math.cos(a)*inner,y+Math.sin(a)*inner,x+Math.cos(a)*outer,y+Math.sin(a)*outer,
            j%3===0?2.5:1.2,rgba(j%3===0?'#fff8ff':color,(1-t)*.58),12);
        }
        c.globalAlpha=1;continue;
      }
      if(f.type==='portal'){
        c.globalAlpha=1-t;this.drawRunes(x,y,this.scale*(1.2+t*.85),t,color,f.age, .8);c.globalAlpha=1;continue;
      }
      if(f.type==='crit'){
        const r=this.scale*(.35+1.3*t);
        c.globalAlpha=1-t;c.strokeStyle='#ffe7aa';c.lineWidth=2;
        for(let j=0;j<8;j++){
          const a=j*TAU/8;this.line(x+Math.cos(a)*r*.25,y+Math.sin(a)*r*.25,x+Math.cos(a)*r,y+Math.sin(a)*r,1.8,'#ffe7aa',10);
        }c.globalAlpha=1;continue;
      }
      // Standard ability shockwave: ring, inner ring and sharp radial rays.
      const R=Math.max(12,(f.r||2)*this.scale),u=1-Math.pow(1-t,2);
      c.globalAlpha=Math.pow(1-t,.7);
      c.strokeStyle=color;c.lineWidth=3+6*(1-t);c.shadowBlur=28;c.shadowColor=color;
      c.beginPath();c.arc(x,y,R*u,0,TAU);c.stroke();
      if(R>this.scale*4){
        c.lineWidth=2;c.beginPath();c.arc(x,y,R*u*.70,0,TAU);c.stroke();
        if(t<.62)this.drawRunes(x,y,R*.4*(.7+t*.18),t,color,f.age,1-t);
      }
      c.shadowBlur=0;c.globalAlpha=1;
    }
    c.restore();
  }

  drawParticles(dt){
    const c=this.ctx;
    c.save();c.globalCompositeOperation='lighter';
    for(let i=this.particles.length-1;i>=0;i--){
      const p=this.particles[i];p.life+=dt;
      if(p.life>=p.max){this.particles.splice(i,1);continue;}
      p.px=p.x;p.py=p.y;
      p.x+=p.vx*dt;p.y+=p.vy*dt;
      const drag=Math.exp(-dt*(p.kind==='streak'?1.5:2.5));p.vx*=drag;p.vy*=drag;
      const t=p.life/p.max,opacity=Math.pow(1-t,.7);
      const [x,y]=this.world(p.x,p.y);if(x<-50||x>this.width+50||y<-50||y>this.height+50)continue;
      const rad=Math.max(.7,p.size*this.scale*(.75+(.4-t)));
      if(p.kind==='streak'){
        const [bx,by]=this.world(p.px,p.py);
        this.line(x,y,bx,by,Math.max(1,rad),rgba(p.color,opacity),this.quality==='ultra'?11:4);
      }else if(p.kind==='ember'){
        this.circle(x,y,Math.max(1,rad),rgba(p.color,.35*opacity),5);
      }else{
        this.circle(x,y,rad*1.55,rgba(p.color,.14*opacity));
        this.circle(x,y,rad,rgba(p.color,opacity),this.quality==='ultra'?10:2);
      }
    }
    c.restore();
  }

  drawFloaters(dt){
    const c=this.ctx;
    c.textAlign='center';c.textBaseline='middle';
    for(let i=this.floaters.length-1;i>=0;i--){
      const f=this.floaters[i];f.age+=dt;
      if(f.age>f.life){this.floaters.splice(i,1);continue;}
      const [x,y]=this.world(f.x+f.dx*f.age,f.y-1.6*f.age);
      c.globalAlpha=1-f.age/f.life;c.font=`800 ${f.color==='#ffe69c'?17:13}px ui-sans-serif,system-ui`;
      c.shadowColor=f.color;c.shadowBlur=8;c.fillStyle=f.color;
      c.fillText(f.text,x,y);c.shadowBlur=0;
    }
    c.globalAlpha=1;
  }

  render(s,dt){
    if(!this.ctx)return;
    dt=minmax(dt,0,.05);this.time+=dt;
    if(s.hero){
      const follow=minmax(1-Math.exp(-dt*6.5),0,1);
      this.camera.x+=(s.hero.x-this.camera.x)*follow;
      this.camera.y+=(s.hero.y-this.camera.y)*follow;
    }
    const c=this.ctx,w=this.width,h=this.height;
    c.save();
    if(this.shake>.15){
      let amplitude=Math.min(this.shake,this.quality==='ultra'?22:9);
      c.translate(random(-amplitude,amplitude),random(-amplitude,amplitude));
      this.shake*=Math.exp(-dt*13);
    }else this.shake=0;
    this.background(s);
    this.drawArenaSymbols();
    this.drawPickups(s);
    this.drawEnemies(s);
    this.drawShots(s);
    this.drawHero(s);
    this.drawEffects(dt);
    this.drawParticles(dt);
    this.drawFloaters(dt);
    c.restore();
    if(this.flash>.001){
      c.fillStyle=rgba(this.flashColor,Math.min(.50,this.flash*.42));
      c.fillRect(0,0,w,h);
      this.flash*=Math.exp(-dt*7);
    }
  }

  dispose(){this.observer?.disconnect();this.canvas.remove();}
}
