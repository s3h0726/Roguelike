export const COLS = 8;
export const ROWS = 4;
export const MAX_BENCH = 8;
export const MAX_ROUND = 30;

export const TRAITS = {
  Celestial: { color:'#ffd38d', icon:'✦', description:'All allies gain a shield and an opening damage surge.', levels:[2,4] },
  Void: { color:'#c18aff', icon:'◈', description:'Allies steal life when dealing damage.', levels:[2,4] },
  Ember: { color:'#ff795e', icon:'♨', description:'Attacks ignite enemies for damage over time.', levels:[2,4] },
  Storm: { color:'#79ddff', icon:'ϟ', description:'Every third allied hit calls down chain lightning.', levels:[2,4] },
  Arcane: { color:'#b7a6ff', icon:'✺', description:'Abilities charge faster and strike harder.', levels:[2,4] },
  Iron: { color:'#a0e6d2', icon:'⬡', description:'Allies gain armor and extra maximum health.', levels:[2,4] },
};

// unit ability type drives both combat logic and unique FX in renderer.
export const UNITS = [
  {id:'aether',name:'Aether Knight',title:'The First Light',icon:'♜',traits:['Celestial','Iron'],role:'Tank',cost:1,hp:235,atk:14,armor:7,speed:1.0,range:62,mana:90,ability:'shield',abilityName:'Astral Bulwark',color:'#ffe0a5'},
  {id:'nova',name:'Nova Ranger',title:'Stellar Marksman',icon:'➶',traits:['Celestial','Storm'],role:'Ranger',cost:1,hp:146,atk:23,armor:2,speed:1.26,range:310,mana:72,ability:'volley',abilityName:'Starfall Volley',color:'#8ad9ff'},
  {id:'cinder',name:'Cinder Witch',title:'Infernal Scholar',icon:'♨',traits:['Ember','Arcane'],role:'Mage',cost:1,hp:145,atk:18,armor:1,speed:1.0,range:270,mana:72,ability:'meteor',abilityName:'Meteor Descent',color:'#ff9b6f'},
  {id:'rune',name:'Runic Sentinel',title:'Silent Bastion',icon:'⬡',traits:['Iron','Arcane'],role:'Tank',cost:1,hp:258,atk:11,armor:10,speed:.85,range:65,mana:75,ability:'fortify',abilityName:'Runic Fortress',color:'#8ee6c7'},
  {id:'tempest',name:'Tempest Monk',title:'Thunder Dancer',icon:'ϟ',traits:['Storm','Iron'],role:'Fighter',cost:2,hp:201,atk:20,armor:5,speed:1.45,range:66,mana:60,ability:'chain',abilityName:'Thunder Cascade',color:'#7bdcff'},
  {id:'stalker',name:'Void Stalker',title:'The Silent Edge',icon:'◈',traits:['Void','Storm'],role:'Assassin',cost:2,hp:158,atk:30,armor:2,speed:1.6,range:66,mana:58,ability:'dash',abilityName:'Shadow Sever',color:'#be8aff'},
  {id:'priest',name:'Solar Priest',title:'Keeper of Dawn',icon:'☼',traits:['Celestial','Arcane'],role:'Support',cost:2,hp:174,atk:13,armor:3,speed:1.02,range:265,mana:65,ability:'heal',abilityName:'Dawn Benediction',color:'#ffe08f'},
  {id:'duelist',name:'Blaze Duelist',title:'Sword of Ash',icon:'⚔',traits:['Ember','Iron'],role:'Fighter',cost:2,hp:196,atk:27,armor:4,speed:1.42,range:62,mana:65,ability:'spin',abilityName:'Phoenix Waltz',color:'#ff746d'},
  {id:'oracle',name:'Dusk Oracle',title:'Prophet of the Rift',icon:'☾',traits:['Void','Arcane'],role:'Mage',cost:3,hp:159,atk:26,armor:2,speed:1.05,range:295,mana:85,ability:'vortex',abilityName:'Event Horizon',color:'#c196ff'},
  {id:'gunner',name:'Meteor Gunner',title:'The Railbreaker',icon:'⌁',traits:['Ember','Storm'],role:'Ranger',cost:3,hp:173,atk:37,armor:2,speed:.88,range:340,mana:78,ability:'beam',abilityName:'Helios Railgun',color:'#ffad70'},
  {id:'colossus',name:'Abyss Colossus',title:'Monolith of Night',icon:'♟',traits:['Void','Iron'],role:'Tank',cost:3,hp:390,atk:23,armor:11,speed:.7,range:70,mana:100,ability:'slam',abilityName:'Graviton Crush',color:'#aa92f9'},
  {id:'seraph',name:'Eclipse Seraph',title:'Bearer of Judgment',icon:'✧',traits:['Celestial','Void'],role:'Legendary',cost:4,hp:249,atk:44,armor:5,speed:1.2,range:300,mana:105,ability:'apocalypse',abilityName:'Astral Annihilation',color:'#f5d9ff'},
  {id:'devourer',name:'Star Devourer',title:'The Last Horizon',icon:'✹',traits:['Void','Ember'],role:'Legendary',cost:4,hp:290,atk:40,armor:6,speed:.95,range:270,mana:100,ability:'supernova',abilityName:'Celestial Collapse',color:'#ff8bb6'},
  {id:'conductor',name:'Sky Conductor',title:'The Living Current',icon:'⌘',traits:['Storm','Arcane'],role:'Mage',cost:3,hp:178,atk:29,armor:2,speed:1.15,range:290,mana:64,ability:'chain',abilityName:'Ion Cataclysm',color:'#84dfff'}
];
export const UNIT_BY_ID = Object.fromEntries(UNITS.map(u=>[u.id,u]));
export const RELICS = [
  {id:'comet',name:'Comet Engine',icon:'☄',rarity:'RARE',desc:'All allied attacks deal +20% damage.',mods:{atk:0.20}},
  {id:'aegis',name:'Titan Heart',icon:'♥',rarity:'RARE',desc:'All allied units gain +30% maximum HP.',mods:{hp:0.30}},
  {id:'mana',name:'Infinite Circuit',icon:'✺',rarity:'RARE',desc:'Abilities charge 40% faster.',mods:{mana:0.40}},
  {id:'blaze',name:'Ashen Crown',icon:'♨',rarity:'EPIC',desc:'Burns deal +80% damage and last longer.',mods:{burn:0.80}},
  {id:'crown',name:'Crown of Stars',icon:'✦',rarity:'EPIC',desc:'Celestial units strike +45% harder.',mods:{celestial:0.45}},
  {id:'gravity',name:'Gravity Well',icon:'◉',rarity:'EPIC',desc:'Abilities deal +35% area damage.',mods:{spell:0.35}},
  {id:'fortress',name:'Adamant Shell',icon:'⬡',rarity:'RARE',desc:'All allied units gain +8 armor.',mods:{armor:8}},
  {id:'frenzy',name:'Tempo Fracture',icon:'ϟ',rarity:'RARE',desc:'Allied attacks are 25% faster.',mods:{speed:0.25}},
  {id:'vampire',name:'Hunger of Night',icon:'◈',rarity:'EPIC',desc:'Allies gain +20% life steal.',mods:{lifesteal:0.20}},
  {id:'spark',name:'Thunder Echo',icon:'⌁',rarity:'EPIC',desc:'Chain lightning triggers one strike sooner.',mods:{chain:1}},
  {id:'fortune',name:'Golden Orbit',icon:'◆',rarity:'RARE',desc:'Gain +3 bonus gold after every victory.',mods:{gold:3}},
  {id:'spectrum',name:'Prismatic Soul',icon:'◈',rarity:'LEGENDARY',desc:'All allies gain +20% attack and +20% HP.',mods:{atk:0.20,hp:0.20}},
  {id:'anthem',name:'War Anthem',icon:'⚔',rarity:'EPIC',desc:'Start each fight with 30 extra mana.',mods:{startMana:30}},
  {id:'focus',name:'Astral Focus',icon:'◎',rarity:'RARE',desc:'Allies gain +15% critical chance.',mods:{crit:0.15}},
  {id:'resonance',name:'Rift Resonance',icon:'✴',rarity:'LEGENDARY',desc:'Command Burst charges 60% faster.',mods:{burst:0.60}},
  {id:'oracleEye',name:'Oracle Eye',icon:'☾',rarity:'RARE',desc:'Refresh the shop for free once each round.',mods:{reroll:1}}
];
export const STAGES = [
  {name:'THE FIRST SPARK',affix:'Neutral Skies',kind:'normal'},
  {name:'STATIC AWAKENING',affix:'Mana Surge',kind:'mana'},
  {name:'ASHES OF DAWN',affix:'Solar Flare',kind:'meteor'},
  {name:'THE FRACTURED PATH',affix:'Haste Field',kind:'haste'},
  {name:'ECLIPSE GUARDIAN',affix:'BOSS // OBELISK',kind:'boss'}
];
export function stageFor(round){ const a=STAGES[(round-1)%STAGES.length];return {...a,boss:round%5===0}; }
export function maxField(level){return Math.min(7,2+level);}
export function weightPool(level){return UNITS.filter(u=>u.cost<=Math.min(4,1+Math.floor(level/2)));}