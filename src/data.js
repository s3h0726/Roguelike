export const ARENA = { width: 46, height: 30 };
export const CLASSES = [
  {id:'void', name:'VOID REAVER', subtitle:'Close-range devastation', icon:'◆', color:'#ab70ff', hp:145, speed:8.1, atk:23, rate:0.53, range:13, starter:'nova', desc:'A cursed blade that detonates the void.'},
  {id:'storm', name:'STORM HERALD', subtitle:'Lightning & mobility', icon:'ϟ', color:'#58ddff', hp:110, speed:9.4, atk:19, rate:0.36, range:17, starter:'chain', desc:'Hunt with storms; never stand still.'},
  {id:'solar', name:'SOLAR SERAPH', subtitle:'Explosive celestial magic', icon:'✦', color:'#ffbc63', hp:120, speed:8.6, atk:21, rate:0.47, range:16, starter:'meteor', desc:'Call stars down upon the battlefield.'}
];
export const ABILITIES = {
  nova:{name:'VOID NOVA',color:'#ae7bff',desc:'Unleash a devastating radial shockwave.',cd:8},
  chain:{name:'CHAIN LIGHTNING',color:'#6ce9ff',desc:'Arc electricity between several enemies.',cd:3.7},
  meteor:{name:'STARFALL',color:'#ffb55c',desc:'Summon a blazing meteor at a target.',cd:6.5},
  orbit:{name:'ASTRAL BLADES',color:'#ff71d5',desc:'Spectral blades orbit and slice enemies.',cd:0},
  beam:{name:'CELESTIAL LANCE',color:'#a7f6ff',desc:'Pierce enemies with a focused laser.',cd:5.5},
  frost:{name:'ABSOLUTE ZERO',color:'#87adff',desc:'Freeze nearby threats in an icy blast.',cd:10}
};
export const UPGRADES = [
  {id:'nova',kind:'ability',name:'VOID NOVA',desc:'Shockwave radius and damage increase',tier:'RARE',color:'#b28aff'},
  {id:'chain',kind:'ability',name:'CHAIN LIGHTNING',desc:'More arcs, higher electrical damage',tier:'RARE',color:'#62e3ff'},
  {id:'meteor',kind:'ability',name:'STARFALL',desc:'Rain greater meteors from the sky',tier:'RARE',color:'#ffbd66'},
  {id:'orbit',kind:'ability',name:'ASTRAL BLADES',desc:'Add orbiting blades around your hero',tier:'RARE',color:'#ffa1e0'},
  {id:'beam',kind:'ability',name:'CELESTIAL LANCE',desc:'A penetrating beam of astral light',tier:'EPIC',color:'#bceaff'},
  {id:'frost',kind:'ability',name:'ABSOLUTE ZERO',desc:'Freeze and shatter surrounding enemies',tier:'EPIC',color:'#9cb5ff'},
  {id:'damage',kind:'stat',name:'RUIN',desc:'+18% attack damage',tier:'COMMON',color:'#ff8a97'},
  {id:'haste',kind:'stat',name:'QUICKEN',desc:'+15% attack speed',tier:'COMMON',color:'#93f5da'},
  {id:'vitality',kind:'stat',name:'VITAL SURGE',desc:'+26 max HP and heal 26 HP',tier:'COMMON',color:'#ff9c9e'},
  {id:'stride',kind:'stat',name:'PHASE STEP',desc:'+10% movement speed',tier:'COMMON',color:'#6ff3dc'},
  {id:'crit',kind:'stat',name:'FATEBREAKER',desc:'+8% critical strike chance',tier:'RARE',color:'#ffca69'},
  {id:'shield',kind:'stat',name:'ASTRAL BULWARK',desc:'+20 regenerating shield capacity',tier:'RARE',color:'#9bb8ff'},
  {id:'cooldown',kind:'stat',name:'TEMPORAL SHIFT',desc:'Abilities recharge 10% faster',tier:'RARE',color:'#ba9cff'},
  {id:'magnet',kind:'stat',name:'GRAVITY WELL',desc:'Expand XP collection radius',tier:'COMMON',color:'#adfca1'}
];
export const RELICS = [
  {id:'blood',name:'VAMPIRIC STAR',desc:'Heal 3 HP after each 5 kills.',color:'#ff697c',rarity:'LEGENDARY'},
  {id:'glass',name:'GLASS COSMOS',desc:'+55% damage, -20% max health.',color:'#ffb65d',rarity:'CURSED'},
  {id:'prism',name:'PRISMATIC HEART',desc:'Every fifth attack fires a second projectile.',color:'#83ecff',rarity:'EPIC'},
  {id:'eclipse',name:'ECLIPSE CROWN',desc:'Your Supernova charges 60% faster.',color:'#d09aff',rarity:'LEGENDARY'},
  {id:'thorn',name:'THORNED HALO',desc:'Return 30% contact damage to enemies.',color:'#b5ff8c',rarity:'RARE'},
  {id:'phoenix',name:'PHOENIX FEATHER',desc:'Survive one lethal blow and revive at 40% HP.',color:'#ff9055',rarity:'LEGENDARY'},
  {id:'echo',name:'ECHO OF INFINITY',desc:'Ability cooldowns are reduced by 25%.',color:'#b6c4ff',rarity:'EPIC'},
  {id:'lunar',name:'LUNAR AEGIS',desc:'+35 shield capacity; recover shield faster.',color:'#8cb5ff',rarity:'RARE'},
  {id:'hunt',name:'HUNTER’S MARK',desc:'Deal +32% damage to elites and bosses.',color:'#ffd275',rarity:'RARE'},
  {id:'celestial',name:'CELESTIAL ENGINE',desc:'Abilities deal +35% damage.',color:'#ffb7fa',rarity:'EPIC'},
  {id:'serpent',name:'SILVER SERPENT',desc:'Gain 18% attack speed and movement speed.',color:'#a2f9e2',rarity:'RARE'},
  {id:'gravity',name:'EVENT HORIZON',desc:'Supernova gains 45% blast radius.',color:'#be9fff',rarity:'EPIC'}
];
export const ENEMIES = {
  wraith:{name:'Wraith',hp:46,speed:3.0,dmg:12,r:0.65,color:'#a76aff',xp:6},
  crawler:{name:'Crawler',hp:28,speed:4.7,dmg:8,r:0.43,color:'#fa7a9d',xp:4},
  bulwark:{name:'Bulwark',hp:140,speed:1.9,dmg:20,r:1.02,color:'#ffb15c',xp:12},
  specter:{name:'Specter',hp:60,speed:2.6,dmg:12,r:0.57,color:'#64eaff',xp:8},
  bomber:{name:'Rift Bomb',hp:36,speed:3.8,dmg:19,r:0.56,color:'#ff546e',xp:7},
  boss:{name:'THE STAR DEVOURER',hp:1450,speed:2.3,dmg:26,r:2.05,color:'#fe67c5',xp:145}
};
export const TIPS = ['Keep moving. Your attacks fire automatically.','Space to dash through danger. R to unleash Supernova.','Every level offers one of three build upgrades.','Defeat the stage boss to claim a relic.','Skill combinations decide how far you survive.'];
