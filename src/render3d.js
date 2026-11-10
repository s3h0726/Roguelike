import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ARENA, ABILITIES, ENEMIES } from './data.js';
const PI2=Math.PI*2;
const COL=c=>new THREE.Color(c||'#ffffff');
const additive=THREE.AdditiveBlending;
const mat=(color,opacity=1)=>new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false,blending:additive,side:THREE.DoubleSide});
export class ThreeBattleRenderer {
 constructor(root){
  this.root=root;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#03040f');this.scene.fog=new THREE.FogExp2('#03040f',.014);
  this.camera=new THREE.PerspectiveCamera(49,1,.1,180);this.camera.position.set(0,33,27);this.camera.lookAt(0,0,0);
  this.renderer=new THREE.WebGLRenderer({alpha:false,antialias:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.35;
  this.renderer.setClearColor(0x050613,1);root.appendChild(this.renderer.domElement);
  this.composer=null;this.quality='ultra';this.time=0;this.shake=0;this.flash=0;this.effects=[];this.enemyObjects=new Map();this.shotObjects=[];this.xpObjects=[];
  this.sphere=new THREE.IcosahedronGeometry(1,2);this.oct=new THREE.OctahedronGeometry(1);this.plane=new THREE.PlaneGeometry(1,1);this.ringGeometry=new THREE.TorusGeometry(1,.037,5,96);this.beamGeometry=new THREE.CylinderGeometry(1,1,1,8);
  const amb=new THREE.AmbientLight('#43507c',1.15);this.scene.add(amb);
  const key=new THREE.DirectionalLight('#98b0ff',3.4);key.position.set(-12,26,8);this.scene.add(key);
  const warm=new THREE.PointLight('#b05eff',115,65,2);warm.position.set(7,9,-8);this.scene.add(warm);
  this.buildArena();this.buildHero();this.buildParticles();
  try {this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));
    this.bloom=new UnrealBloomPass(new THREE.Vector2(1,1),1.6,.55,.12);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  } catch(err) {console.warn('Bloom fallback:',err);this.composer=null;}
  this.resize();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(root);
 }
 buildArena(){
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,80),new THREE.MeshStandardMaterial({color:'#090e27',roughness:.45,metalness:.42}));floor.rotation.x=-Math.PI/2;floor.position.y=-.24;this.scene.add(floor);
  const g=new THREE.GridHelper(90,45,'#24315e','#101b39');g.position.y=-.17;g.material.transparent=true;g.material.opacity=.43;this.scene.add(g);
  for(let i=0;i<4;i++){let r=new THREE.Mesh(new THREE.TorusGeometry(11.2+i*6.6,.03,4,160),mat(i%2?'#7b3cf3':'#36cafa',.20));r.rotation.x=-Math.PI/2;r.position.y=-.10;this.scene.add(r);}
  const bounds=new THREE.Group();for(let i=0;i<4;i++){let x=i<2?(i===0?-ARENA.width/2:ARENA.width/2):0,z=i>=2?(i===2?-ARENA.height/2:ARENA.height/2):0;
   let b=new THREE.Mesh(new THREE.BoxGeometry(i<2?.13:ARENA.width,.12,i<2?ARENA.height:.13),mat('#6959ff',.70));b.position.set(x,0,z);bounds.add(b);}
  this.scene.add(bounds);
  this.decor=[];for(let i=0;i<60;i++){let a=(i/60)*PI2,r=25+(i%5)*3,x=Math.cos(a)*r,z=Math.sin(a)*r,geo=i%3===0?new THREE.OctahedronGeometry(1,0):new THREE.TetrahedronGeometry(1);
   let o=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:i%2?'#192c4d':'#25163e',emissive:i%2?'#0f275b':'#300b67',emissiveIntensity:1.1,roughness:.3,metalness:.6}));o.position.set(x,1.1,z);o.scale.setScalar(.7+(i%4)*.35);o.rotation.set(i,0,i*.35);this.scene.add(o);this.decor.push(o);}
  const stars=new Float32Array(1500);for(let i=0;i<500;i++){stars[3*i]=(Math.random()-.5)*140;stars[3*i+1]=10+Math.random()*55;stars[3*i+2]=(Math.random()-.5)*135;}
  let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(stars,3));let dots=new THREE.Points(geo,new THREE.PointsMaterial({color:'#5e84da',size:.17,transparent:true,opacity:.65,depthWrite:false,blending:additive}));this.scene.add(dots);
 }
 buildHero(){
  this.hero=new THREE.Group();this.scene.add(this.hero);
  const body=new THREE.Mesh(new THREE.ConeGeometry(.74,1.85,6),new THREE.MeshStandardMaterial({color:'#ded2ff',metalness:.55,roughness:.23,emissive:'#7136c8',emissiveIntensity:.9}));body.rotation.z=Math.PI;body.position.y=1.2;this.hero.add(body);
  const core=new THREE.Mesh(this.sphere,mat('#ffffff',.95));core.scale.setScalar(.38);core.position.y=1.55;this.hero.add(core);
  let outer=new THREE.Mesh(new THREE.TorusGeometry(1.1,.075,6,48),mat('#ac76ff',.85));outer.rotation.x=-Math.PI/2;outer.position.y=.2;this.hero.add(outer);this.heroRing=outer;
  let crest=new THREE.Mesh(new THREE.OctahedronGeometry(.52),mat('#b895ff',.8));crest.position.y=2.25;this.hero.add(crest);this.heroCrest=crest;
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.2,36),new THREE.MeshBasicMaterial({color:'#8054df',transparent:true,opacity:.25,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.13;this.hero.add(shadow);
  this.heroLight=new THREE.PointLight('#b285ff',18,10,2);this.heroLight.position.y=2;this.hero.add(this.heroLight);
 }
 buildParticles(){this.particleCap=1350;this.particles=[];const geo=new THREE.BufferGeometry();const positions=new Float32Array(this.particleCap*3),colors=new Float32Array(this.particleCap*3),sizes=new Float32Array(this.particleCap),alpha=new Float32Array(this.particleCap);
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('aColor',new THREE.BufferAttribute(colors,3));geo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geo.setAttribute('aAlpha',new THREE.BufferAttribute(alpha,1));geo.setDrawRange(0,0);
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:additive,vertexColors:false,
   vertexShader:`attribute vec3 aColor;attribute float aSize;attribute float aAlpha;varying vec3 vColor;varying float vAlpha;void main(){vColor=aColor;vAlpha=aAlpha;vec4 mvPosition=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mvPosition;gl_PointSize=min(80.,max(1.,aSize*(190./-mvPosition.z)));}`,
   fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-vec2(.5))*2.;float fall=exp(-d*d*5.0);gl_FragColor=vec4(vColor*1.5,fall*vAlpha);}`});
  this.particleGeo=geo;this.particleMesh=new THREE.Points(geo,material);this.particleMesh.frustumCulled=false;this.scene.add(this.particleMesh);
 }
 addParticle(x,z,color,n=1,velocity=5){let c=COL(color);n=Math.min(n,this.quality==='lite'?20:220);for(let i=0;i<n;i++){if(this.particles.length>=this.particleCap)this.particles.shift();let a=Math.random()*PI2,v=(.3+Math.random())*velocity,life=.28+Math.random()*.78;
  this.particles.push({x,y:.3+Math.random()*2.4,z,vx:Math.cos(a)*v,vy:(Math.random()-.27)*v*.9,vz:Math.sin(a)*v,life,maxLife:life,size:4+Math.random()*7,color:c});}}
 ring(x,z,r,color,duration=.8){const object=new THREE.Mesh(this.ringGeometry,mat(color,.85));object.rotation.x=-Math.PI/2;object.position.set(x,.22,z);object.scale.setScalar(.2);this.scene.add(object);this.effects.push({type:'ring',object,x,z,r,age:0,duration});return object;}
 sphereBlast(x,z,r,color,duration=.5){let obj=new THREE.Mesh(this.sphere,mat(color,.18));obj.position.set(x,1,z);obj.scale.setScalar(.2);this.scene.add(obj);this.effects.push({type:'sphere',object:obj,r,age:0,duration});}
 beam(x,z,tx,tz,color,kind='laser'){
   const points=[];let count=kind==='lightning'?9:2;for(let i=0;i<count;i++){let t=i/(count-1);points.push(new THREE.Vector3(x+(tx-x)*t+(i>0&&i<count-1?(Math.random()-.5)*1.1:0),1.1+(kind==='laser'?1:Math.random()*1.3),z+(tz-z)*t+(i>0&&i<count-1?(Math.random()-.5)*1.1:0)));}
   let geom=new THREE.BufferGeometry().setFromPoints(points);let line=new THREE.Line(geom,new THREE.LineBasicMaterial({color,transparent:true,opacity:1,blending:additive,depthWrite:false}));this.scene.add(line);this.effects.push({type:'line',object:line,age:0,duration:kind==='warning'?.12:kind==='lightning'?.3:.40});
   if(kind==='laser'){let from=new THREE.Vector3(x,1.8,z),to=new THREE.Vector3(tx,1.8,tz),dir=to.clone().sub(from),len=dir.length(),core=new THREE.Mesh(this.beamGeometry,mat(color,.46));core.position.copy(from.add(to).multiplyScalar(.5));core.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());core.scale.set(.32,len,.32);this.scene.add(core);this.effects.push({type:'line',object:core,age:0,duration:.28});this.shake=Math.max(this.shake,.28);}
   this.addParticle(tx,tz,color,kind==='laser'?35:11,8);
 }
 meteor(x,z,color,r){this.ring(x,z,r,color,.7);this.sphereBlast(x,z,r*.72,color,.50);
  let p1=new THREE.Vector3(x,17,z-4),p2=new THREE.Vector3(x,0,z),dir=p1.clone().sub(p2),beam=new THREE.Mesh(this.beamGeometry,mat(color,.72));beam.position.copy(p1.clone().add(p2).multiplyScalar(.5));beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());beam.scale.set(.45,dir.length(),.45);this.scene.add(beam);this.effects.push({type:'line',object:beam,age:0,duration:.48});this.addParticle(x,z,color,75,13);this.shake=Math.max(this.shake,.62);
 }
 consume(events){for(const e of events){let x=e.x||0,z=e.y||0,color=e.color||'#ffffff';switch(e.type){
   case 'pulse':this.ring(x,z,e.r||5,color,.75);this.sphereBlast(x,z,(e.r||5)*.65,color,.4);break;
   case 'burst':this.addParticle(x,z,color,e.count||20,e.count>100?18:10);break;
   case 'spawn':this.ring(x,z,1.5,color,.4);break;
   case 'hit':this.addParticle(x,z,color,e.crit?18:6,5);break;
   case 'muzzle':this.addParticle(x,z,color,5,3);break;
   case 'xp':this.addParticle(x,z,color,3,2);break;
   case 'trail':this.addParticle(x,z,color,2,2);break;
   case 'heroHit':this.addParticle(x,z,color,24,8);this.shake=Math.max(this.shake,.2);this.flash=.28;break;
   case 'beam':this.beam(x,z,e.toX,e.toY,color,e.kind);break;
   case 'meteor':this.meteor(x,z,color,e.r||4);break;
   case 'ultimate':this.ultimate(x,z,e.r||18,color);break;
  }} }
 ultimate(x,z,r,color){this.shake=1.75;this.flash=.9;this.ring(x,z,r,color,1.25);this.ring(x,z,r*.77,'#ffffff',1.00);this.ring(x,z,r*.45,'#ff94ec',.85);this.sphereBlast(x,z,r*.68,color,1.10);this.addParticle(x,z,color,this.quality==='ultra'?220:60,22);
   const spire=new THREE.Mesh(new THREE.CylinderGeometry(1.8,.4,26,16,1,true),mat('#d69fff',.4));spire.position.set(x,13,z);this.scene.add(spire);this.effects.push({type:'spire',object:spire,age:0,duration:.85});
   const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(4.4,1),mat('#ffffff',.45));crystal.position.set(x,7,z);this.scene.add(crystal);this.effects.push({type:'crystal',object:crystal,age:0,duration:1.0});
 }
 makeEnemy(m){let group=new THREE.Group();let geo=m.type==='boss'?new THREE.DodecahedronGeometry(m.r,1):m.type==='specter'?new THREE.OctahedronGeometry(m.r,0):m.type==='bulwark'?new THREE.DodecahedronGeometry(m.r,0):new THREE.IcosahedronGeometry(m.r,0);
  let material=new THREE.MeshStandardMaterial({color:m.color,metalness:.66,roughness:.19,emissive:m.color,emissiveIntensity:m.type==='boss'?2.5:1.3});let mesh=new THREE.Mesh(geo,material);mesh.position.y=1.1*m.r;group.add(mesh);
  let ring=new THREE.Mesh(new THREE.TorusGeometry(m.r*1.25,.035,5,32),mat(m.color,m.type==='boss'?.8:.35));ring.rotation.x=-Math.PI/2;ring.position.y=.05;group.add(ring);
  if(m.type==='boss'){let crown=new THREE.Mesh(new THREE.TorusKnotGeometry(m.r*.87,.1,70,9,2,3),mat('#f4a2ff',.88));crown.rotation.x=.9;crown.position.y=m.r*1.15;group.add(crown);group.userData.crown=crown;}
  group.userData={...group.userData,mesh,ring,defColor:m.color};this.scene.add(group);return group;
 }
 updateEntities(s,dt){if(s.hero){this.hero.visible=true;this.hero.position.set(s.hero.x,Math.sin(this.time*3)*.12,s.hero.y);this.hero.rotation.y=-s.hero.aim;this.heroRing.rotation.z=this.time*.8;this.heroCrest.rotation.y=this.time*1.1;this.heroLight.color.set(s.hero.color);
 this.hero.visible=!(s.hero.invuln>0&&Math.floor(this.time*18)%4===0);
 }else this.hero.visible=false;
 let aliveIds=new Set();for(const m of s.enemies){aliveIds.add(m.id);let obj=this.enemyObjects.get(m.id);if(!obj){obj=this.makeEnemy(m);this.enemyObjects.set(m.id,obj);}obj.position.set(m.x,Math.sin(this.time*2+m.id)*.19,m.y);obj.rotation.y+=dt*.9;if(obj.userData.crown)obj.userData.crown.rotation.y+=dt*.5;obj.userData.mesh.material.emissiveIntensity=m.slow>0?3.1:1.3+(m.type==='boss'?1.2:0);}
 for(const [id,obj] of this.enemyObjects){if(!aliveIds.has(id)){this.scene.remove(obj);obj.userData.mesh.geometry.dispose();obj.userData.mesh.material.dispose();this.enemyObjects.delete(id);}}
 const shotCount=Math.max(s.shots.length,s.enemyShots.length);let combined=s.shots.concat(s.enemyShots);
 while(this.shotObjects.length<combined.length){let o=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),mat('#ffffff',.93));this.scene.add(o);this.shotObjects.push(o);}
 this.shotObjects.forEach((o,i)=>{let p=combined[i];o.visible=!!p;if(p){o.position.set(p.x,.8,p.y);o.scale.setScalar(p.r*3);o.material.color.set(p.color||'#ffffff');o.rotation.y=this.time*6;}});
 while(this.xpObjects.length<s.pickups.length){let o=new THREE.Mesh(new THREE.OctahedronGeometry(.26,0),mat('#6dfbc8',.93));this.scene.add(o);this.xpObjects.push(o);}
 this.xpObjects.forEach((o,i)=>{let p=s.pickups[i];o.visible=!!p;if(p){o.position.set(p.x,.55+Math.sin(this.time*6+i)*.17,p.y);o.rotation.y+=dt*3;}});
 }
 updateParticles(dt){let p=this.particles,geo=this.particleGeo,ps=geo.attributes.position,cs=geo.attributes.aColor,ss=geo.attributes.aSize,aa=geo.attributes.aAlpha;let length=0;
  for(let i=p.length-1;i>=0;i--){const v=p[i];v.life-=dt;if(v.life<=0){p.splice(i,1);continue;}v.x+=v.vx*dt;v.y+=v.vy*dt;v.z+=v.vz*dt;v.vx*=.98;v.vy-=9*dt;v.vz*=.98;let j=length++;ps.array[j*3]=v.x;ps.array[j*3+1]=Math.max(0,v.y);ps.array[j*3+2]=v.z;cs.array[j*3]=v.color.r;cs.array[j*3+1]=v.color.g;cs.array[j*3+2]=v.color.b;ss.array[j]=v.size;aa.array[j]=Math.min(1,v.life/.28);}
  geo.setDrawRange(0,length);ps.needsUpdate=true;cs.needsUpdate=true;ss.needsUpdate=true;aa.needsUpdate=true;
 }
 updateEffects(dt){for(let i=this.effects.length-1;i>=0;i--){let f=this.effects[i];f.age+=dt;let t=f.age/f.duration;
  if(t>=1){this.scene.remove(f.object);if(f.object.geometry!==this.ringGeometry&&f.object.geometry!==this.sphere&&f.object.geometry!==this.beamGeometry)f.object.geometry?.dispose();f.object.material?.dispose();this.effects.splice(i,1);continue;}
  if(f.type==='ring'){f.object.scale.setScalar(.1+f.r*t);f.object.material.opacity=.8*(1-t);}
  else if(f.type==='sphere'){f.object.scale.setScalar(.1+f.r*t);f.object.material.opacity=.20*(1-t);}
  else if(f.type==='spire'){f.object.scale.x=(1-t)*1.7+.2;f.object.scale.z=(1-t)*1.7+.2;f.object.material.opacity=.42*(1-t);}
  else if(f.type==='crystal'){f.object.rotation.y+=dt*7;f.object.scale.setScalar(1+t*1.7);f.object.material.opacity=.55*(1-t);}
  else if(f.type==='line'){f.object.material.opacity=1-t;}
 }}
 setQuality(q){this.quality=q==='lite'?'lite':'ultra';this.renderer.setPixelRatio(q==='lite'?1:Math.min(devicePixelRatio||1,1.65));if(this.bloom){this.bloom.strength=q==='lite'?.8:1.65;this.bloom.radius=q==='lite'?.2:.56;}this.resize();}
 resize(){let w=Math.max(320,this.root.clientWidth),h=Math.max(260,this.root.clientHeight);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.fov=w<700?63:49;this.camera.updateProjectionMatrix();this.composer?.setSize(w,h);}
 render(s,dt){this.time+=dt;this.updateEntities(s,dt);this.updateEffects(dt);this.updateParticles(dt);
  const hero=s.hero||{x:0,y:0};const target=new THREE.Vector3(hero.x,0,hero.y);let tx=hero.x,ty=hero.y+24;let h=this.root.clientWidth<700?36:31;
  this.camera.position.lerp(new THREE.Vector3(tx+1,h,ty),1-Math.exp(-dt*4));this.camera.lookAt(target.x,0,target.z);
  if(this.shake>0){let amt=this.shake*.15;this.camera.position.x+=(Math.random()-.5)*amt;this.camera.position.y+=(Math.random()-.5)*amt;this.shake=Math.max(0,this.shake-dt*1.4);}
  for(let i=0;i<this.decor.length;i++)this.decor[i].rotation.y+=dt*(i%2?.13:-.12);
  if(this.flash>0){this.flash=Math.max(0,this.flash-dt*1.6);this.renderer.toneMappingExposure=1.35+this.flash*1.0;}
  else this.renderer.toneMappingExposure=1.35;
  if(this.composer)this.composer.render();else this.renderer.render(this.scene,this.camera);
 }
 dispose(){this.resizeObserver.disconnect();this.renderer.dispose();this.root.removeChild(this.renderer.domElement);}
}
