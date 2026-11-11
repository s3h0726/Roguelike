/* Pixel Core Hunter — pure roguelike rules. Browser global and Node compatible. */
(function (root, factory) {
  const value = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = value;
  root.PixelRogue = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_FLOOR = 10;
  const BOONS = [
    { id: 'ferocity', icon: '⚔️', name: '야수의 힘', rarity: '일반', desc: '공격력 +3. 여러 번 선택할 수 있습니다.', cap: 5 },
    { id: 'vitality', icon: '❤️', name: '생명의 뿌리', rarity: '일반', desc: '최대 체력 +22, 체력 22 회복.', cap: 5 },
    { id: 'swift', icon: '🌀', name: '신속한 손놀림', rarity: '희귀', desc: '기본 공격 주기 12% 단축.', cap: 4 },
    { id: 'arcane', icon: '🔮', name: '마력의 샘', rarity: '일반', desc: '최대 마나 +16, 공격 시 마나 회복 +1.', cap: 4 },
    { id: 'crimson', icon: '💢', name: '약점 간파', rarity: '희귀', desc: '치명타 확률 +7%.', cap: 4 },
    { id: 'bulwark', icon: '🛡️', name: '철벽 의지', rarity: '일반', desc: '방어 +2, 보호막 +10.', cap: 4 },
    { id: 'venom', icon: '🍄', name: '맹독의 손길', rarity: '희귀', desc: '기본 공격에 30% 확률로 중독 부여.', cap: 3 },
    { id: 'drain', icon: '🩸', name: '피의 맹세', rarity: '희귀', desc: '기본 공격 피해의 6%만큼 체력 회복.', cap: 4 },
    { id: 'surge', icon: '✨', name: '코어 공명', rarity: '영웅', desc: '코어 해방 충전 속도 +35%.', cap: 3 },
    { id: 'treasure', icon: '🪙', name: '도금된 운명', rarity: '일반', desc: '몬스터 처치 골드 +25%.', cap: 4 },
    { id: 'focus', icon: '🎯', name: '정밀 사격', rarity: '희귀', desc: '스킬 피해 +15%.', cap: 4 },
    { id: 'mender', icon: '🌿', name: '회복의 순환', rarity: '희귀', desc: '방 클리어 시 최대 체력의 8% 회복.', cap: 3 }
  ];
  const RELICS = [
    { id: 'phoenixFeather', icon: '🔥', name: '불사조의 깃털', rarity: '영웅', desc: '모험 중 치명타 피해를 1회 버티고 체력 35% 회복.' },
    { id: 'lightningCore', icon: '⚡', name: '뇌전 코어', rarity: '희귀', desc: '기본 공격 4회마다 추가 번개 피해.' },
    { id: 'glassDagger', icon: '💎', name: '유리 단검', rarity: '희귀', desc: '피해량 +25%, 받는 피해 +10%.' },
    { id: 'forestHeart', icon: '🌳', name: '숲의 심장', rarity: '희귀', desc: '전투 방 진입마다 체력 10% 회복.' },
    { id: 'luckyCoin', icon: '🪙', name: '행운의 동전', rarity: '일반', desc: '처치 골드 +40%, 상점 치유 비용 -5G.' },
    { id: 'manaWell', icon: '💠', name: '영원의 우물', rarity: '일반', desc: '기본 공격 시 마나 회복 +3.' },
    { id: 'stormCharm', icon: '🌩️', name: '폭풍 부적', rarity: '영웅', desc: '스킬 피해 +30% 및 스킬 재사용 대기시간 -15%.' },
    { id: 'thornShell', icon: '🌵', name: '가시 껍질', rarity: '일반', desc: '피격 시 적에게 반사 피해.' },
    { id: 'bloodChalice', icon: '🍷', name: '핏빛 성배', rarity: '영웅', desc: '보스/정예 처치 시 체력 25% 회복.' },
    { id: 'arcaneClock', icon: '⏳', name: '시간의 태엽', rarity: '희귀', desc: '기본 공격 속도 +15%.' },
    { id: 'runeCrown', icon: '👑', name: '룬 왕관', rarity: '영웅', desc: '치명타 피해 +50%.' },
    { id: 'guardianSigil', icon: '🛡️', name: '수호 문장', rarity: '희귀', desc: '방마다 보호막 15 획득.' }
  ];
  const ROOMS = {
    battle: { id: 'battle', icon: '⚔️', name: '몬스터 소굴', tag: '전투', desc: '연속 전투를 치르고 축복 하나를 선택합니다.' },
    elite: { id: 'elite', icon: '💀', name: '정예의 영역', tag: '위험', desc: '강한 적과 싸우고 유물과 축복을 모두 획득합니다.' },
    treasure: { id: 'treasure', icon: '💎', name: '잊힌 보물고', tag: '보상', desc: '적과 싸우지 않고 유물 하나를 선택합니다.' },
    camp: { id: 'camp', icon: '🔥', name: '안식의 모닥불', tag: '회복', desc: '체력·마나 회복 또는 스킬 강화 중 하나를 선택합니다.' },
    merchant: { id: 'merchant', icon: '🏪', name: '방랑 상점', tag: '거래', desc: '골드로 치유·마나수정·유물을 구입합니다.' },
    event: { id: 'event', icon: '🌀', name: '수상한 제단', tag: '선택', desc: '위험과 보상을 저울질하는 이벤트가 발생합니다.' },
    boss: { id: 'boss', icon: '🐗', name: '초원의 폭군', tag: '보스', desc: '초원의 거대멧돼지를 쓰러뜨려 모험을 완주합니다.' }
  };
  function shuffled(values, rng = Math.random) {
    const arr = values.slice();
    for (let i=arr.length-1;i>0;i--) { const j=Math.floor(rng()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }
  function sample(values, count, rng = Math.random) { return shuffled(values,rng).slice(0,count); }
  function routes(floor, rng = Math.random) {
    if (floor >= MAX_FLOOR) return ['boss'];
    if (floor === 1) return ['battle'];
    const pool = floor <= 2 ? ['battle','battle','event','treasure'] :
                 floor % 4 === 0 ? ['battle','elite','merchant','camp','treasure'] :
                 floor % 5 === 0 ? ['battle','elite','camp','event','treasure'] :
                 ['battle','elite','event','treasure','camp'];
    const rest = sample([...new Set(pool)].filter(x=>x!=='battle'),2,rng);
    return shuffled(['battle', ...rest], rng);
  }
  function boonChoices(stacks, rng = Math.random) {
    const possible=BOONS.filter(b=>(stacks?.[b.id]||0)<b.cap);
    return sample(possible.length?possible:BOONS,3,rng).map(x=>x.id);
  }
  function relicChoices(owned, rng = Math.random) {
    const choices=RELICS.filter(r=>!owned?.includes(r.id));
    return sample(choices,Math.min(3,choices.length),rng).map(x=>x.id);
  }
  function encounterCount(floor, kind) {
    if(kind==='boss') return 1;
    if(kind==='elite') return Math.min(4,2+Math.floor(floor/4));
    return Math.min(4,2+Math.floor((floor-1)/3));
  }
  function newRun(number=1,rng=Math.random) {
    return { number, phase:'route', floor:1, room:null, routes:routes(1,rng),
      options:[], rewardQueue:[], encounters:0, encounterIndex:0, kills:0,
      clearRooms:0, boons:{}, relics:[], path:[], core:0, attacks:0,
      totalGold:0, bossKills:0, usedPhoenix:false, merchantBought:[] };
  }
  function hasRelic(run,id) {return !!run?.relics?.includes(id)}
  return {MAX_FLOOR,BOONS,RELICS,ROOMS,shuffled,sample,routes,boonChoices,relicChoices,encounterCount,newRun,hasRelic};
});
