'use strict';

const grades = [
  { name: '낡은 핵', mult: 1, icon: '🔹' },
  { name: '청동 핵', mult: 1.7, icon: '🔸' },
  { name: '흑철 핵', mult: 2.8, icon: '💠' },
  { name: '월광 핵', mult: 4.5, icon: '🌙' },
  { name: '천년 핵', mult: 7.3, icon: '🌟' },
];


const regionFields = {
  meadow: {
    label: '초원 지역', cls: 'meadow', reward: 'mixed', hp: 1.0, atk: 1.0,
    desc: '초반 성장 지역입니다. 약한 몬스터가 많이 등장하지만 회피, 중독, 분노 같은 기본 패턴을 익힐 수 있습니다.',
    tip: '기본 피해와 자동 힐을 먼저 올린 뒤 안정적으로 사냥하세요.',
    pool: [
      { grade:'일반', icon:'🟢', name:'슬라임', concept:'가장 기본적인 젤리 몬스터', element:'무속성', trait:'약하지만 많이 등장합니다.', hp:.75, atk:.65, mechanic:'swarm' },
      { grade:'일반', icon:'🐰', name:'뿔토끼', concept:'뿔이 달린 빠른 토끼', element:'자연', trait:'회피율이 높습니다.', hp:.72, atk:.85, mechanic:'evasion' },
      { grade:'일반', icon:'🐺', name:'들늑대', concept:'초원에서 사냥하는 늑대', element:'물리', trait:'공격 속도가 빠릅니다.', hp:.9, atk:1.05, mechanic:'fast' },
      { grade:'일반', icon:'🍄', name:'독버섯', concept:'독 포자를 뿌리는 버섯', element:'독', trait:'중독 효과를 겁니다.', hp:.82, atk:.9, mechanic:'poison' },
      { grade:'일반', icon:'👺', name:'고블린 정찰병', concept:'약한 고블린 병사', element:'물리', trait:'체력은 낮지만 이동이 빠릅니다.', hp:.68, atk:.95, mechanic:'fast' },
      { grade:'정예', icon:'🐺', name:'붉은갈기 늑대', concept:'늑대 무리의 우두머리', element:'화염', trait:'체력이 낮을수록 강해집니다.', hp:1.45, atk:1.25, mechanic:'enrage' }
    ]
  },
  forest: {
    label: '숲 지역', cls: 'forest', reward: 'dust', hp: 1.15, atk: 1.05,
    desc: '자연과 독 속성 몬스터가 많은 지역입니다. 속도 감소, 반사 피해, 회복 방해를 경험할 수 있습니다.',
    tip: '도트뎀과 디버프를 이용하면 체력이 높은 식물형 몬스터를 안정적으로 처치할 수 있습니다.',
    pool: [
      { grade:'일반', icon:'🌿', name:'덩굴 괴물', concept:'움직이는 식물 몬스터', element:'자연', trait:'플레이어 속도를 감소시킵니다.', hp:1.05, atk:.9, mechanic:'slow' },
      { grade:'일반', icon:'🕷️', name:'숲거미', concept:'숲에 사는 거미', element:'독', trait:'독 공격을 사용합니다.', hp:.9, atk:1.05, mechanic:'poison' },
      { grade:'일반', icon:'🌳', name:'나무 정령', concept:'오래된 나무의 영혼', element:'자연', trait:'방어력이 높습니다.', hp:1.35, atk:.85, mechanic:'armor' },
      { grade:'일반', icon:'🌵', name:'가시덩굴', concept:'가시가 돋은 덩굴 생명체', element:'자연', trait:'반사 피해를 줍니다.', hp:1.0, atk:.95, mechanic:'reflect' },
      { grade:'정예', icon:'🧝', name:'숲의 파수꾼', concept:'숲을 지키는 정령', element:'자연', trait:'자신을 회복합니다.', hp:1.55, atk:1.0, mechanic:'regen' },
      { grade:'정예', icon:'🕸️', name:'맹독 여왕거미', concept:'독거미들의 우두머리', element:'독', trait:'지속 피해가 강합니다.', hp:1.35, atk:1.25, mechanic:'strongPoison' }
    ]
  },
  cave: {
    label: '동굴 지역', cls: 'cave', reward: 'rune', hp: 1.2, atk: 1.1,
    desc: '대지, 어둠, 언데드 몬스터가 등장합니다. 방어형 적과 공포 효과가 많아 장기전이 됩니다.',
    tip: '관통형 공격과 흡수 스킬을 추천합니다.',
    pool: [
      { grade:'일반', icon:'🦇', name:'동굴 박쥐', concept:'어두운 동굴의 박쥐', element:'어둠', trait:'빠른 공격을 합니다.', hp:.78, atk:1.15, mechanic:'fast' },
      { grade:'일반', icon:'🐛', name:'암석 벌레', concept:'바위를 먹는 벌레', element:'대지', trait:'방어력이 높습니다.', hp:1.25, atk:.9, mechanic:'armor' },
      { grade:'일반', icon:'🕷️', name:'동굴 거미', concept:'동굴에 사는 거미', element:'독', trait:'중독 공격을 합니다.', hp:.95, atk:1.05, mechanic:'poison' },
      { grade:'일반', icon:'👺', name:'어둠 고블린', concept:'동굴에 사는 고블린', element:'어둠', trait:'치명타 확률이 높습니다.', hp:.9, atk:1.2, mechanic:'crit' },
      { grade:'정예', icon:'💎', name:'수정 골렘', concept:'수정으로 이루어진 골렘', element:'대지', trait:'보호막을 생성합니다.', hp:1.7, atk:1.0, mechanic:'shield' },
      { grade:'정예', icon:'👻', name:'광산 망령', concept:'폐광에 남은 유령', element:'언데드', trait:'공포 효과로 공격을 방해합니다.', hp:1.25, atk:1.25, mechanic:'fear' }
    ]
  },
  volcano: {
    label: '화산 지역', cls: 'volcano', reward: 'dust', hp: 1.25, atk: 1.3,
    desc: '화염 피해가 강한 지역입니다. 화상, 폭발, 광역 공격이 많아 체력과 보호막이 중요합니다.',
    tip: '자동 힐과 보호 장벽 분야를 강화한 뒤 도전하세요.',
    pool: [
      { grade:'일반', icon:'🦇', name:'불꽃 박쥐', concept:'불타는 날개를 가진 박쥐', element:'화염', trait:'화상을 부여합니다.', hp:.85, atk:1.2, mechanic:'burn' },
      { grade:'일반', icon:'🔴', name:'용암 슬라임', concept:'용암으로 된 슬라임', element:'화염', trait:'지속 화염 피해를 줍니다.', hp:1.05, atk:1.05, mechanic:'burn' },
      { grade:'일반', icon:'🦎', name:'화염 도마뱀', concept:'불을 뿜는 도마뱀', element:'화염', trait:'원거리 공격을 합니다.', hp:1.0, atk:1.15, mechanic:'ranged' },
      { grade:'일반', icon:'💀', name:'불타는 해골병', concept:'불길에 휩싸인 해골', element:'화염/언데드', trait:'죽을 때 폭발합니다.', hp:1.0, atk:1.1, mechanic:'deathBomb' },
      { grade:'정예', icon:'🗿', name:'재의 골렘', concept:'화산재로 이루어진 골렘', element:'화염/대지', trait:'방어력이 높습니다.', hp:1.65, atk:1.05, mechanic:'armor' },
      { grade:'정예', icon:'🔥', name:'화산 정령', concept:'화산의 힘을 가진 정령', element:'화염', trait:'광역 공격을 합니다.', hp:1.4, atk:1.35, mechanic:'aoe' }
    ]
  },
  snow: {
    label: '설원 지역', cls: 'snow', reward: 'manaCrystal', hp: 1.2, atk: 1.15,
    desc: '얼음과 둔화가 중심인 지역입니다. 공격 속도와 스킬 쿨타임을 방해하는 적이 많습니다.',
    tip: '마나 엔진과 자동 스킬 세팅을 점검하세요.',
    pool: [
      { grade:'일반', icon:'🐺', name:'얼음 늑대', concept:'얼음 털을 가진 늑대', element:'얼음', trait:'둔화 공격을 합니다.', hp:.95, atk:1.12, mechanic:'slow' },
      { grade:'일반', icon:'☃️', name:'눈사람 괴수', concept:'살아 움직이는 눈사람', element:'얼음', trait:'체력이 높습니다.', hp:1.55, atk:.9, mechanic:'armor' },
      { grade:'일반', icon:'👻', name:'설원 망령', concept:'눈보라 속 유령', element:'얼음/언데드', trait:'회피율이 높습니다.', hp:1.0, atk:1.1, mechanic:'evasion' },
      { grade:'일반', icon:'🦇', name:'서리 박쥐', concept:'냉기를 뿜는 박쥐', element:'얼음', trait:'공격 속도를 감소시킵니다.', hp:.85, atk:1.15, mechanic:'slow' },
      { grade:'정예', icon:'🧊', name:'서리 골렘', concept:'얼음으로 된 골렘', element:'얼음/대지', trait:'보호막을 사용합니다.', hp:1.65, atk:1.0, mechanic:'shield' },
      { grade:'정예', icon:'♞', name:'얼어붙은 기사', concept:'얼음 갑옷을 입은 기사', element:'얼음', trait:'방어력이 높습니다.', hp:1.45, atk:1.18, mechanic:'armor' }
    ]
  },
  desert: {
    label: '사막 지역', cls: 'desert', reward: 'gold', hp: 1.15, atk: 1.25,
    desc: '독, 대지, 치명타, 반격이 섞인 지역입니다. 명중률 감소와 기습 패턴에 대비하세요.',
    tip: '치명 본능과 흡수 장치 분야가 효율적입니다.',
    pool: [
      { grade:'일반', icon:'🦂', name:'모래 전갈', concept:'사막의 독전갈', element:'독/대지', trait:'중독 공격을 합니다.', hp:.95, atk:1.15, mechanic:'poison' },
      { grade:'일반', icon:'🥷', name:'사막 도적', concept:'사막을 떠도는 약탈자', element:'물리', trait:'치명타 공격을 합니다.', hp:.9, atk:1.25, mechanic:'crit' },
      { grade:'일반', icon:'🐛', name:'모래 벌레', concept:'땅속에서 튀어나오는 벌레', element:'대지', trait:'기습 공격을 합니다.', hp:1.1, atk:1.2, mechanic:'ambush' },
      { grade:'일반', icon:'🌵', name:'불타는 선인장', concept:'불꽃을 품은 선인장', element:'화염/자연', trait:'반격 피해를 줍니다.', hp:1.05, atk:1.05, mechanic:'reflect' },
      { grade:'정예', icon:'🗡️', name:'사막 암살자', concept:'빠른 공격을 하는 암살자', element:'물리', trait:'높은 치명타를 가집니다.', hp:1.2, atk:1.45, mechanic:'crit' },
      { grade:'정예', icon:'🗿', name:'모래 골렘', concept:'모래로 된 거대 골렘', element:'대지', trait:'피해를 감소시킵니다.', hp:1.75, atk:1.0, mechanic:'armor' }
    ]
  },
  sea: {
    label: '해저 지역', cls: 'sea', reward: 'manaCrystal', hp: 1.25, atk: 1.2,
    desc: '물, 번개 속성 몬스터가 등장합니다. 반사, 감전, 연속 공격이 특징입니다.',
    tip: '보호막과 힐을 준비하면 안정적으로 파밍할 수 있습니다.',
    pool: [
      { grade:'일반', icon:'💧', name:'물방울 슬라임', concept:'물로 된 슬라임', element:'물', trait:'약한 회복 능력이 있습니다.', hp:1.0, atk:.85, mechanic:'regen' },
      { grade:'일반', icon:'🐡', name:'가시 복어', concept:'몸에 가시가 있는 물고기', element:'물', trait:'반사 피해를 줍니다.', hp:.95, atk:1.0, mechanic:'reflect' },
      { grade:'일반', icon:'🎐', name:'심해 해파리', concept:'전기를 내는 해파리', element:'물/번개', trait:'감전 효과를 줍니다.', hp:.9, atk:1.2, mechanic:'shock' },
      { grade:'일반', icon:'👺', name:'바다 고블린', concept:'바다에 사는 고블린', element:'물', trait:'빠른 공격을 합니다.', hp:.9, atk:1.15, mechanic:'fast' },
      { grade:'정예', icon:'♞', name:'심해 기사', concept:'바다 갑옷을 입은 기사', element:'물', trait:'방어력이 높습니다.', hp:1.55, atk:1.1, mechanic:'armor' },
      { grade:'정예', icon:'⚡', name:'전기 장어 군주', concept:'번개를 품은 장어', element:'번개', trait:'연속 공격을 합니다.', hp:1.3, atk:1.35, mechanic:'multiHit' }
    ]
  },
  undead: {
    label: '언데드 지역', cls: 'undead', reward: 'soul', hp: 1.3, atk: 1.3,
    desc: '언데드와 암흑 몬스터가 등장합니다. 체력이 높고 회피, 저주, 회복 패턴이 많습니다.',
    tip: '디버프와 흡혈을 활용해 장기전에 대비하세요.',
    pool: [
      { grade:'일반', icon:'💀', name:'해골 병사', concept:'되살아난 해골 전사', element:'언데드', trait:'기본 근접 공격을 합니다.', hp:1.0, atk:1.0, mechanic:'none' },
      { grade:'일반', icon:'🧟', name:'좀비', concept:'느리지만 질긴 몬스터', element:'언데드', trait:'체력이 높습니다.', hp:1.55, atk:.9, mechanic:'armor' },
      { grade:'일반', icon:'👻', name:'유령', concept:'실체가 희미한 영혼', element:'언데드', trait:'회피율이 높습니다.', hp:.95, atk:1.1, mechanic:'evasion' },
      { grade:'일반', icon:'🐦‍⬛', name:'저주받은 까마귀', concept:'저주를 옮기는 새', element:'암흑', trait:'저주를 부여합니다.', hp:.9, atk:1.2, mechanic:'curse' },
      { grade:'정예', icon:'♞', name:'죽음의 기사', concept:'강력한 언데드 기사', element:'암흑/언데드', trait:'공격과 방어가 모두 강합니다.', hp:1.65, atk:1.35, mechanic:'armor' },
      { grade:'정예', icon:'🧙', name:'묘지의 사제', concept:'죽은 자를 부리는 사제', element:'암흑', trait:'자신을 회복합니다.', hp:1.35, atk:1.1, mechanic:'regen' }
    ]
  },
  abyss: {
    label: '심연 지역', cls: 'abyss', reward: 'rune', hp: 1.35, atk: 1.45,
    desc: '공허와 암흑이 중심인 고난도 지역입니다. 스킬 방해, 속박, 보호막이 등장합니다.',
    tip: '스킬 쿨타임과 마나 관리가 중요합니다.',
    pool: [
      { grade:'일반', icon:'🥷', name:'그림자 도적', concept:'어둠 속에서 공격하는 도적', element:'암흑', trait:'치명타 공격을 합니다.', hp:.95, atk:1.35, mechanic:'crit' },
      { grade:'일반', icon:'👁️', name:'공허의 눈', concept:'떠다니는 눈 형태 괴물', element:'공허', trait:'스킬 사용을 방해합니다.', hp:1.05, atk:1.15, mechanic:'skillDisrupt' },
      { grade:'일반', icon:'🦑', name:'심연 촉수', concept:'바닥에서 솟는 촉수', element:'공허', trait:'속박 효과를 겁니다.', hp:1.15, atk:1.2, mechanic:'bind' },
      { grade:'일반', icon:'🧙', name:'저주받은 사제', concept:'심연을 섬기는 사제', element:'암흑', trait:'저주를 부여합니다.', hp:1.0, atk:1.25, mechanic:'curse' },
      { grade:'정예', icon:'🛡️', name:'균열 감시자', concept:'차원 균열의 수호자', element:'공허', trait:'보호막을 생성합니다.', hp:1.6, atk:1.2, mechanic:'shield' },
      { grade:'정예', icon:'🪽', name:'타락한 천사', concept:'빛을 잃은 천사', element:'암흑/신성', trait:'강력한 마법 공격을 합니다.', hp:1.45, atk:1.55, mechanic:'magicBurst' }
    ]
  },
  time: {
    label: '시간 지역', cls: 'time', reward: 'soul', hp: 1.4, atk: 1.5,
    desc: '시간 속성의 최상위 지역입니다. 행동 속도 감소, 반격, 쿨타임 증가, 회복 패턴이 섞여 있습니다.',
    tip: '피해 배수 강화와 스킬 슬롯 구성이 충분히 준비된 뒤 도전하세요.',
    pool: [
      { grade:'일반', icon:'🐛', name:'시간 벌레', concept:'시간을 갉아먹는 벌레', element:'시간', trait:'행동 속도를 감소시킵니다.', hp:1.0, atk:1.2, mechanic:'slow' },
      { grade:'일반', icon:'🤖', name:'낡은 시계병', concept:'고장 난 시계 병사', element:'시간', trait:'일정 확률로 반격합니다.', hp:1.2, atk:1.25, mechanic:'counter' },
      { grade:'일반', icon:'🧩', name:'균열 조각', concept:'시간 균열에서 나온 파편', element:'시간/공허', trait:'불안정하게 폭발합니다.', hp:.9, atk:1.45, mechanic:'deathBomb' },
      { grade:'정예', icon:'⏳', name:'시간 감시자', concept:'시간의 흐름을 지키는 존재', element:'시간', trait:'스킬 쿨타임을 증가시킵니다.', hp:1.55, atk:1.35, mechanic:'cooldownUp' },
      { grade:'정예', icon:'♞', name:'역행 기사', concept:'시간을 거꾸로 걷는 기사', element:'시간', trait:'체력을 회복합니다.', hp:1.65, atk:1.3, mechanic:'regen' }
    ]
  }
};

const NORMAL_STAGE_WAVES = 10;
// The first ten stages are a rapid tutorial sprint; later regions regain depth.
function stageWaveCap(stage = state?.stage || 1) {
  return stage <= 5 ? 1 : stage <= 10 ? 2 : stage <= 20 ? 3 : stage <= 40 ? 5 : NORMAL_STAGE_WAVES;
}
const regionOrder = Object.keys(regionFields);
const allRegionMonsters = Object.entries(regionFields).flatMap(([regionKey, region], regionIndex) =>
  region.pool.map((monster, monsterIndex) => ({
    ...monster,
    regionKey,
    regionIndex,
    monsterIndex,
    region: region.label,
    stageScore: regionIndex * 10 + (monster.grade === '정예' ? 7 : 0) + Math.round((monster.hp + monster.atk) * 3)
  }))
);

function normalStageWave() {
  return Math.max(1, Math.min(NORMAL_STAGE_WAVES, state?.stageWave || 1));
}

function normalStageUnlockRegionCount() {
  // 스테이지가 올라갈수록 더 위험한 지역 몬스터가 일반 전장에 섞여 등장합니다.
  return Math.max(2, Math.min(regionOrder.length, 2 + Math.floor((Math.max(1, state?.stage || 1) - 1) / 2)));
}

function normalStageRankText() {
  const wave = normalStageWave();
  if (wave <= 3) return '초반';
  if (wave <= 7) return '중반';
  if (wave <= 9) return '후반';
  return '최종 웨이브';
}

function selectNormalStageMonster() {
  const wave = normalStageWave();
  const unlockedRegions = normalStageUnlockRegionCount();
  let candidates = allRegionMonsters.filter(monster => monster.regionIndex < unlockedRegions);
  if (wave <= 3) {
    candidates = candidates.filter(monster => monster.grade !== '정예' && monster.hp <= 1.1);
  } else if (wave <= 7) {
    candidates = candidates.filter(monster => monster.grade !== '정예' || monster.hp <= 1.45);
  } else if (wave <= 9) {
    candidates = candidates.filter(monster => monster.grade === '일반' || monster.grade === '정예');
  } else {
    candidates = candidates.filter(monster => monster.grade === '정예');
  }
  if (!candidates.length) candidates = allRegionMonsters.filter(monster => monster.regionIndex < unlockedRegions);
  const sorted = candidates.slice().sort((a, b) => a.stageScore - b.stageScore);
  const bandStart = Math.floor((wave - 1) / NORMAL_STAGE_WAVES * sorted.length);
  const bandSize = Math.max(1, Math.ceil(sorted.length / NORMAL_STAGE_WAVES * 2.2));
  const band = sorted.slice(bandStart, Math.min(sorted.length, bandStart + bandSize));
  const seed = (state.enemySpawnSeq || 0) + (state.kills || 0);
  const index = Math.abs(((state.stage || 1) * 37 + wave * 17 + seed * 11)) % band.length;
  let selected = band[index];
  if (selected && state.lastEnemyName && selected.name === state.lastEnemyName && band.length > 1) {
    selected = band[(index + 1) % band.length];
  }
  return selected;
}


const specialDungeonName = '저주받은 결계도시';
const barrierCityMonsters = [
  { grade:'일반', icon:'🫧', name:'원념 찌꺼기', concept:'약한 저주가 뭉친 괴물', element:'저주', trait:'가장 기본 결계도시 몬스터입니다. 일반 공격 저항이 조금 있습니다.', hp:.9, atk:.9, mechanic:'curseResidue' },
  { grade:'일반', icon:'👄', name:'기괴한 입술', concept:'끝없이 속삭이는 저주체', element:'저주/정신', trait:'공격력 감소 디버프를 겁니다.', hp:.95, atk:1.0, mechanic:'attackDown' },
  { grade:'일반', icon:'🖐️', name:'뒤틀린 팔무리', concept:'여러 팔이 엉킨 괴물', element:'저주', trait:'낮은 피해의 연속 공격을 사용합니다.', hp:1.0, atk:1.12, mechanic:'multiHit' },
  { grade:'일반', icon:'📜', name:'검은 부적령', concept:'찢어진 부적에서 태어난 몬스터', element:'봉인', trait:'낮은 확률로 스킬을 봉인합니다.', hp:.95, atk:1.02, mechanic:'minorSkillSeal' },
  { grade:'일반', icon:'🎭', name:'울음 가면', concept:'슬픔이 가면 형태로 굳은 저주', element:'정신', trait:'명중률을 낮춰 일부 공격을 빗나가게 합니다.', hp:1.05, atk:.98, mechanic:'accuracyDown' },
  { grade:'일반', icon:'🩸', name:'핏빛 손자국', concept:'벽에 남은 원한이 움직임', element:'저주', trait:'출혈 지속 피해를 겁니다.', hp:1.0, atk:1.06, mechanic:'bleed' },
  { grade:'일반', icon:'🪱', name:'결계 벌레', concept:'결계 틈에서 태어난 벌레', element:'공허/저주', trait:'방어력을 감소시켜 받는 피해를 늘립니다.', hp:.88, atk:1.08, mechanic:'defDown' },
  { grade:'일반', icon:'🐦‍⬛', name:'저주먹는 까마귀', concept:'저주 기운을 먹고 사는 새', element:'암흑', trait:'치명타 확률이 높습니다.', hp:.92, atk:1.18, mechanic:'crit' },
  { grade:'정예', icon:'🪢', name:'목매단 혼령', concept:'강한 미련을 가진 영체', element:'저주/정신', trait:'지속 피해와 공포를 겁니다.', hp:1.45, atk:1.2, mechanic:'fearDot' },
  { grade:'정예', icon:'🧵', name:'붉은 실 주술체', concept:'보이지 않는 실로 적을 묶음', element:'봉인', trait:'일정 확률로 행동 불가를 유발합니다.', hp:1.35, atk:1.25, mechanic:'bind' },
  { grade:'정예', icon:'🕳️', name:'균열의 식귀', concept:'결계 균열에서 소환된 괴물', element:'공허/저주', trait:'보호막을 생성합니다.', hp:1.55, atk:1.12, mechanic:'shield' },
  { grade:'정예', icon:'⚔️', name:'무언의 집행자', concept:'말없이 처형하는 인간형 저주체', element:'암흑', trait:'강한 단일 공격을 사용합니다.', hp:1.3, atk:1.45, mechanic:'execution' },
  { grade:'정예', icon:'🙃', name:'뒤집힌 얼굴', concept:'앞뒤가 뒤틀린 괴물', element:'정신', trait:'플레이어 버프를 제거합니다.', hp:1.38, atk:1.18, mechanic:'buffPurge' },
  { grade:'정예', icon:'🧙‍♂️', name:'봉인된 사제', concept:'실패한 의식의 주술사 잔재', element:'봉인/저주', trait:'스킬 쿨타임을 증가시킵니다.', hp:1.42, atk:1.22, mechanic:'cooldownUp' },
  { grade:'정예', icon:'🖤', name:'검은 태아', concept:'완전히 태어나지 못한 저주 생명체', element:'저주', trait:'시간이 지날수록 강해집니다.', hp:1.5, atk:1.25, mechanic:'timePressure' },
  { grade:'정예', icon:'🛡️', name:'원혼 갑주', concept:'원한이 갑옷에 깃든 몬스터', element:'저주/물리', trait:'방어력이 매우 높습니다.', hp:1.75, atk:1.05, mechanic:'armor' }
];

const fields = {
  normal: {
    label: '일반 전장', cls: 'meadow', reward: 'mixed', hp: 1.05, atk: 1.05, mechanic: 'regionMix', pool: allRegionMonsters,
    desc: '스테이지형 기본 전장입니다. 하나의 전장 안에서 여러 지역 몬스터가 등장하며, 1~5스테이지는 1웨이브, 6~10스테이지는 2웨이브, 이후 단계적으로 증가하여 41스테이지부터 10웨이브입니다. 같은 스테이지 안에서도 뒤로 갈수록 더 강한 몬스터가 배치됩니다.',
    tip: '초반 웨이브는 약한 일반 몬스터, 후반 웨이브는 정예급 몬스터가 등장합니다. 스테이지가 오를수록 몬스터 체력이 단계적으로 증가합니다.'
  },
  gold: { label: '황금 폐광', minStage: 5, cls: 'gold', reward: 'gold', hp: 1.8, atk: 0.75, mechanic: 'treasure', pool: [{ icon:'🪙', name:'황금 광석수', trait:'골드를 많이 주지만 체력이 높습니다.', hp:1, atk:1 }], desc:'골드 집중 파밍 전장입니다. 이곳에서 보스 도전 시 황금 폐광 전용 보스가 등장합니다.', tip:'피해 스킬과 버프 스킬을 추천합니다.' },
  mana: { label: '마나 균열', minStage: 5, cls: 'mana', reward: 'manaCrystal', hp: 1.25, atk: 0.9, mechanic: 'manaFlux', pool: [{ icon:'🔮', name:'균열 정령', trait:'마나수정을 품은 정령입니다.', hp:1, atk:1 }], desc:'마나수정 파밍 전장입니다.', tip:'스킬 레벨업 전후에 자주 방문하세요.' },
  soul: { label: '영혼 사원', minStage: 12, cls: 'soul', reward: 'soul', hp: 1.45, atk: 1.8, mechanic: 'spiritRisk', pool: [{ icon:'👻', name:'영혼 파수꾼', trait:'공격력이 매우 높지만 영혼석을 줍니다.', hp:1, atk:1 }], desc:'영혼석을 얻는 고위험 전장입니다.', tip:'회복, 방어, 흡수 스킬을 장착하세요.' },
  crystal: { label: '유물 결정고', minStage: 7, cls: 'crystal', reward: 'dust', hp: 1.35, atk: 1.05, mechanic: 'crystalArmor', pool: [{ icon:'💎', name:'결정 골렘', trait:'유물가루를 품은 골렘입니다.', hp:1, atk:1 }], desc:'유물가루 파밍 전장입니다.', tip:'체력 강화와 장비 강화에 필요합니다.' },
  rune: { label: '룬 서고', minStage: 9, cls: 'rune', reward: 'rune', hp: 1.2, atk: 1.25, mechanic: 'runeSurge', pool: [{ icon:'📕', name:'룬 문지기', trait:'룬조각을 지키는 수호자입니다.', hp:1, atk:1 }], desc:'룬조각 파밍 전장입니다.', tip:'스킬 성장에 가장 중요한 전장입니다.' },
  mirror: { label: '거울 미궁', minStage: 14, cls: 'mirror', reward: 'rune', hp: 1.35, atk: 1.15, mechanic: 'reflect', pool: [{ icon:'🪞', name:'반사 거울수', trait:'받은 피해의 일부를 반사합니다.', hp:1.05, atk:1 }], desc:'일정 간격으로 일부 피해가 플레이어에게 반사되는 던전입니다. 보호막으로 흡수할 수 있고, 짧은 쿨다운이 있어 빠른 자동 공격에 즉시 연속 반사되지는 않습니다.', tip:'보호막·흡혈 조합을 추천합니다.' },
  curse: { label: '저주받은 납골당', minStage: 16, cls: 'curse', reward: 'soul', hp: 1.25, atk: 1.55, mechanic: 'noAutoHeal', pool: [{ icon:'☠️', name:'저주 해골', trait:'자동 힐이 봉인됩니다.', hp:1, atk:1 }], desc:'자동 힐이 작동하지 않는 고위험 던전입니다.', tip:'수동 힐, 보호막, 흡혈 스킬을 장착하세요.' },
  clock: { label: '시간 가속로', minStage: 20, cls: 'clock', reward: 'manaCrystal', hp: 1.15, atk: 1.1, mechanic: 'timePressure', pool: [{ icon:'⏳', name:'시간 포식자', trait:'시간이 지날수록 공격력이 증가합니다.', hp:1, atk:1 }], desc:'전투가 길어질수록 몬스터의 공격 압박이 증가하지만, 플레이어 공격력은 증가하지 않는 던전입니다.', tip:'공격 스킬과 버프로 짧게 끝내세요.' },
  jackpot: { label: '도박꾼의 금고', minStage: 10, cls: 'jackpot', reward: 'gold', hp: 0.95, atk: 1.25, mechanic: 'jackpot', pool: [{ icon:'🎰', name:'금고 미믹', trait:'처치 보상이 크게 흔들립니다.', hp:1, atk:1 }], desc:'처치 보상이 1배부터 6배까지 무작위로 바뀌는 던전입니다.', tip:'탐사 보상 스킬과 황금 해머를 함께 쓰세요.' },
  gauntlet: { label: '연전 투기장', minStage: 15, cls: 'gauntlet', reward: 'mixed', hp: 1.25, atk: 1.25, mechanic: 'streak', pool: [{ icon:'🥊', name:'투기장 전사', trait:'연속 처치할수록 보상과 위험이 증가합니다.', hp:1, atk:1 }, { icon:'🐗', name:'돌진 멧돼지', trait:'연전 중 공격력이 높습니다.', hp:1.1, atk:1.15 }, { icon:'🧱', name:'투기장 파수병', trait:'체력이 높은 연전 적입니다.', hp:1.25, atk:.95 }], desc:'연속 처치 수에 따라 보상 배율이 오르지만 위험도 커지는 던전입니다.', tip:'자동 힐과 방어술을 강화하세요.' },
  alchemy: { label: '연금술 실험실', minStage: 12, cls: 'alchemy', reward: 'mixed', hp: 1.05, atk: 1.28, mechanic: 'unstableBrew', pool: [{ icon:'⚗️', name:'불안정 플라스크', trait:'공격할 때마다 무작위 폭발이나 회복 반응이 발생합니다.', hp:1, atk:1 }, { icon:'🧪', name:'변이 실험체', trait:'처치 보상이 흔들리는 실험체입니다.', hp:1.18, atk:1.12 }], desc:'무작위 약품 반응이 일어나는 특수 던전입니다. 공격 시 추가 피해, 자해, 마나 회복이 뒤섞입니다.', tip:'보호막과 흡혈을 챙기면 변수를 견딜 수 있습니다.' },
  storm: { label: '폭풍 첨탑', minStage: 17, cls: 'storm', reward: 'manaCrystal', hp: 1.12, atk: 1.42, mechanic: 'stormChain', pool: [{ icon:'🌩️', name:'폭풍 정령', trait:'번개가 연쇄적으로 튀어 추가 피해를 줍니다.', hp:1, atk:1.15 }, { icon:'🗼', name:'피뢰탑 수호자', trait:'마나수정을 많이 지킵니다.', hp:1.25, atk:1 }], desc:'연쇄 번개가 발생하는 마나수정 던전입니다. 공격은 강하지만 처치 속도도 빠릅니다.', tip:'마나 엔진과 보호 장벽을 함께 강화하세요.' },
  gravity: { label: '중력 붕괴지', minStage: 22, cls: 'gravity', reward: 'rune', hp: 1.45, atk: 1.18, mechanic: 'gravityWell', pool: [{ icon:'🕳️', name:'중력 핵', trait:'자동 공격 속도를 느리게 만듭니다.', hp:1.35, atk:1 }, { icon:'🪐', name:'궤도 파편', trait:'체력은 낮지만 폭발성이 높습니다.', hp:.85, atk:1.3 }], desc:'중력 때문에 자동 공격 효율이 낮아지는 던전입니다. 한 방 피해가 중요한 구조입니다.', tip:'기본 피해 배수 강화와 강한 액티브 스킬을 추천합니다.' },
  blood: { label: '피의 제단', minStage: 24, cls: 'blood', reward: 'soul', hp: 1.2, atk: 1.65, mechanic: 'bloodDebt', pool: [{ icon:'🩸', name:'피의 사도', trait:'플레이어 체력을 깎는 대신 영혼석 보상이 높습니다.', hp:1.05, atk:1.2 }, { icon:'🧛', name:'제단 흡혈귀', trait:'공격과 회복을 동시에 사용합니다.', hp:1.25, atk:1.15 }], desc:'전투 중 주기적으로 체력을 대가로 바치지만 영혼석 보상이 높은 던전입니다.', tip:'흡수 장치, 자동 힐, 체력 배수 강화가 중요합니다.' },
  eclipse: { label: '월식 성역', minStage: 26, cls: 'eclipse', reward: 'rune', hp: 1.3, atk: 1.38, mechanic: 'eclipseCycle', pool: [{ icon:'🌘', name:'월식 사제', trait:'주기적으로 피해 증가와 회복 감소가 전환됩니다.', hp:1.12, atk:1.15 }, { icon:'🌑', name:'검은 성역수', trait:'암흑 주기가 오면 강해집니다.', hp:1.28, atk:1 }], desc:'시간 주기에 따라 플레이어 피해와 회복 효율이 변하는 던전입니다.', tip:'딜 타이밍과 회복 타이밍을 분리해서 운영하세요.' },
  garden: { label: '생명의 온실', minStage: 18, cls: 'garden', reward: 'dust', hp: 1.65, atk: .95, mechanic: 'overgrowth', pool: [{ icon:'🌺', name:'증식 꽃괴물', trait:'전투가 길어질수록 체력을 회복합니다.', hp:1.3, atk:.9 }, { icon:'🌱', name:'덩굴 배양체', trait:'유물가루를 많이 제공합니다.', hp:1.15, atk:1 }], desc:'적이 꾸준히 재생하는 장기전 던전입니다. 단단하지만 보상 안정성이 좋습니다.', tip:'도트뎀과 디버프가 매우 유효합니다.' },
  voidForge: { label: '공허 제련소', minStage: 30, cls: 'voidforge', reward: 'rune', hp: 1.5, atk: 1.5, mechanic: 'voidForge', pool: [{ icon:'⚒️', name:'공허 대장장이', trait:'보호막을 깨야 큰 피해가 들어갑니다.', hp:1.2, atk:1.1 }, { icon:'⬛', name:'무광 합금체', trait:'피해를 일부 무효화합니다.', hp:1.45, atk:1 }], desc:'강한 방어와 공허 저항을 가진 고난도 던전입니다. 룬 보상이 높습니다.', tip:'분야 강화와 무기고 강화를 충분히 올린 뒤 도전하세요.' },
  dream: { label: '꿈의 회랑', minStage: 22, cls: 'dream', reward: 'manaCrystal', hp: 1.05, atk: 1.1, mechanic: 'dreamShift', pool: [{ icon:'💤', name:'몽환 나비', trait:'스킬 쿨타임과 마나가 랜덤하게 변합니다.', hp:.9, atk:1 }, { icon:'🌀', name:'꿈결 파수꾼', trait:'예측하기 어려운 패턴을 가집니다.', hp:1.2, atk:1.1 }], desc:'스킬 쿨타임과 마나 흐름이 흔들리는 변칙 던전입니다.', tip:'마나 회복 패시브와 자동 스킬을 함께 쓰면 안정적입니다.' }
,
  barrierCity: {
    label: specialDungeonName, minStage: 35, cls: 'barrier-city', reward: 'soul', hp: 1.62, atk: 1.42, mechanic: 'barrierCity', pool: barrierCityMonsters,
    desc: '오래전 강력한 주술 의식이 실패하면서 도시 전체가 결계에 갇힌 특수던전입니다. 원망, 공포, 미련이 몬스터가 되어 떠돌며 보호막, 봉인, 반격, 영역 전개형 패턴을 사용합니다.',
    tip: '입장 전 스킬 해금, 자동 힐, 보호막, 흡혈, 쿨타임 관리가 필요합니다. 일반 공격만으로는 효율이 낮습니다.'
  }
};


// 특별 전장 몬스터 확장: 전장별로 여러 몬스터가 순환 등장하도록 보강합니다.
function addSpecialFieldMonsters() {
  const additions = {
    gold: [
      { icon:'🪨', name:'순금 바위골렘', trait:'체력이 매우 높고 골드 보상이 큽니다.', hp:1.45, atk:.85, mechanic:'armor', grade:'정예' },
      { icon:'🦎', name:'금빛 도마뱀', trait:'빠르지만 처치 보상이 좋습니다.', hp:.9, atk:1.2, mechanic:'fast', grade:'일반' },
      { icon:'💰', name:'보물 상자 미믹', trait:'보상이 크게 흔들립니다.', hp:1.1, atk:1.05, mechanic:'jackpot', grade:'일반' }
    ],
    mana: [
      { icon:'🌀', name:'마나 소용돌이', trait:'스킬 쿨타임을 흔드는 정령입니다.', hp:1.05, atk:1.15, mechanic:'skillDisrupt', grade:'일반' },
      { icon:'🔷', name:'청색 수정정령', trait:'마나수정을 품은 방어형 몬스터입니다.', hp:1.35, atk:.95, mechanic:'shield', grade:'정예' },
      { icon:'✨', name:'비전 파편체', trait:'처치 시 마나 흐름이 크게 요동칩니다.', hp:.95, atk:1.25, mechanic:'dreamShift', grade:'일반' }
    ],
    soul: [
      { icon:'🕯️', name:'촛불 망령', trait:'영혼석을 품었지만 공격력이 높습니다.', hp:1.15, atk:1.35, mechanic:'curse', grade:'일반' },
      { icon:'⚰️', name:'사원 수문장', trait:'단단하고 영혼 피해를 가합니다.', hp:1.55, atk:1.25, mechanic:'armor', grade:'정예' },
      { icon:'💀', name:'심판 해골', trait:'스킬 사용을 방해합니다.', hp:1.25, atk:1.3, mechanic:'skillDisrupt', grade:'정예' }
    ],
    crystal: [
      { icon:'🔶', name:'황색 결정충', trait:'단단한 껍질을 가진 결정 생명체입니다.', hp:1.25, atk:1, mechanic:'armor', grade:'일반' },
      { icon:'💠', name:'결정 기사', trait:'보호막을 생성합니다.', hp:1.55, atk:1.18, mechanic:'shield', grade:'정예' },
      { icon:'🪬', name:'공명 결정핵', trait:'피해를 일부 무효화합니다.', hp:1.45, atk:1.05, mechanic:'voidForge', grade:'정예' }
    ],
    rune: [
      { icon:'📜', name:'살아있는 두루마리', trait:'룬 폭주로 추가 피해를 줍니다.', hp:.95, atk:1.2, mechanic:'runeSurge', grade:'일반' },
      { icon:'🖋️', name:'룬 필경사', trait:'스킬 쿨타임을 늘립니다.', hp:1.1, atk:1.15, mechanic:'skillDisrupt', grade:'일반' },
      { icon:'📚', name:'금서 파수꾼', trait:'높은 체력과 룬 보상을 지녔습니다.', hp:1.6, atk:1.22, mechanic:'shield', grade:'정예' }
    ],
    mirror: [
      { icon:'🪞', name:'비틀린 거울상', trait:'쿨다운형 반사 피해를 가합니다.', hp:1.2, atk:1.05, mechanic:'reflect', grade:'일반' },
      { icon:'🧍', name:'복제된 유물술사', trait:'치명타와 반격을 섞어 사용합니다.', hp:1.35, atk:1.3, mechanic:'crit', grade:'정예' }
    ],
    curse: [
      { icon:'🦴', name:'저주 골편', trait:'저주로 회복을 방해합니다.', hp:1.05, atk:1.25, mechanic:'curse', grade:'일반' },
      { icon:'🧟', name:'납골당 포식자', trait:'체력이 높고 끈질깁니다.', hp:1.6, atk:1.2, mechanic:'regen', grade:'정예' }
    ],
    clock: [
      { icon:'🕰️', name:'시계 태엽병', trait:'쿨타임 지연을 일으킵니다.', hp:1.15, atk:1.15, mechanic:'timeDelay', grade:'일반' },
      { icon:'⏱️', name:'가속 감시자', trait:'시간이 지날수록 위협이 커집니다.', hp:1.35, atk:1.35, mechanic:'timePressure', grade:'정예' }
    ],
    jackpot: [
      { icon:'🎲', name:'주사위 도적', trait:'피해와 보상이 요동칩니다.', hp:1.0, atk:1.3, mechanic:'jackpot', grade:'일반' },
      { icon:'🃏', name:'광대 미믹', trait:'예측하기 어려운 패턴을 가집니다.', hp:1.25, atk:1.25, mechanic:'dreamShift', grade:'정예' }
    ],
    gauntlet: [
      { icon:'🥊', name:'투기장 전사', trait:'연전 중 기본 전투원입니다.', hp:1.1, atk:1.15, mechanic:'streak', grade:'일반' },
      { icon:'🛡️', name:'투기장 방패병', trait:'높은 체력으로 시간을 끕니다.', hp:1.55, atk:1.0, mechanic:'armor', grade:'정예' },
      { icon:'🗡️', name:'투기장 처형자', trait:'강한 치명타를 사용합니다.', hp:1.25, atk:1.45, mechanic:'crit', grade:'정예' }
    ],
    alchemy: [
      { icon:'⚗️', name:'불안정 플라스크', trait:'무작위 약품 반응이 발생합니다.', hp:1.05, atk:1.1, mechanic:'unstableBrew', grade:'일반' },
      { icon:'🧬', name:'변이 키메라', trait:'회복과 폭발이 뒤섞인 변이체입니다.', hp:1.45, atk:1.3, mechanic:'regen', grade:'정예' }
    ],
    storm: [
      { icon:'🌩️', name:'폭풍 정령', trait:'연쇄 번개를 일으킵니다.', hp:1.05, atk:1.35, mechanic:'stormChain', grade:'일반' },
      { icon:'🦅', name:'천둥매', trait:'빠르고 강한 추가타를 사용합니다.', hp:.95, atk:1.55, mechanic:'multiHit', grade:'정예' }
    ],
    gravity: [
      { icon:'🕳️', name:'중력 핵', trait:'공격 속도와 스킬 흐름을 방해합니다.', hp:1.55, atk:1.1, mechanic:'gravityWell', grade:'정예' },
      { icon:'☄️', name:'낙하 운석체', trait:'높은 피해를 가하는 파편입니다.', hp:1.15, atk:1.45, mechanic:'ambush', grade:'일반' }
    ],
    blood: [
      { icon:'🩸', name:'피의 사도', trait:'피의 대가를 요구합니다.', hp:1.2, atk:1.45, mechanic:'bloodDebt', grade:'일반' },
      { icon:'🧛', name:'제단 흡혈귀', trait:'피해와 회복을 동시에 사용합니다.', hp:1.45, atk:1.35, mechanic:'regen', grade:'정예' }
    ],
    eclipse: [
      { icon:'🌘', name:'월식 사제', trait:'피해와 회복 주기를 뒤흔듭니다.', hp:1.2, atk:1.3, mechanic:'eclipseCycle', grade:'일반' },
      { icon:'🌑', name:'검은 성역수', trait:'주기가 바뀔 때 강해집니다.', hp:1.5, atk:1.25, mechanic:'curse', grade:'정예' }
    ],
    garden: [
      { icon:'🌺', name:'증식 꽃괴물', trait:'지속적으로 재생합니다.', hp:1.55, atk:.95, mechanic:'overgrowth', grade:'정예' },
      { icon:'🌿', name:'온실 덩굴수', trait:'체력이 높고 장기전을 유도합니다.', hp:1.35, atk:1.05, mechanic:'slow', grade:'일반' }
    ],
    voidForge: [
      { icon:'⚒️', name:'공허 대장장이', trait:'공허 장갑을 두른 장인입니다.', hp:1.45, atk:1.35, mechanic:'voidForge', grade:'정예' },
      { icon:'⬛', name:'무광 합금체', trait:'피해를 일부 무효화합니다.', hp:1.65, atk:1.15, mechanic:'armor', grade:'정예' }
    ],
    dream: [
      { icon:'💤', name:'몽환 나비', trait:'마나와 쿨타임 흐름을 흔듭니다.', hp:1.0, atk:1.1, mechanic:'dreamShift', grade:'일반' },
      { icon:'🌀', name:'꿈결 파수꾼', trait:'예측하기 어려운 변칙 패턴을 가집니다.', hp:1.35, atk:1.25, mechanic:'skillDisrupt', grade:'정예' }
    ]
  };
  for (const [fieldKey, monsters] of Object.entries(additions)) {
    if (fields[fieldKey] && Array.isArray(fields[fieldKey].pool)) fields[fieldKey].pool.push(...monsters);
  }
}
addSpecialFieldMonsters();

function diversifyDungeonMonsterNamesAndIcons() {
  // 전장명 접두어로 길게 구분하지 않고, 중복되는 몬스터명만 짧은 별칭으로 바꿉니다.
  const shortRename = {
    '보물 상자 미믹': ['황금 미믹','탐욕 미믹','금고 미믹','보석 미믹'],
    '꿈결 파수꾼': ['꿈 파수꾼','몽환 감시자','잠결 수문장','환영 파수꾼'],
    '공허 대장장이': ['공허 장인','무광 대장장이','검은 제련사','공허 제련공'],
    '마력 드론': ['마나 드론','비전 드론','청동 드론','부유 정찰기'],
    '그림자 수련생': ['그림자 견습','암영 수련생','밤그림 제자','무음 수련생'],
    '전사 망령': ['망령 전사','잊힌 검혼','묘지 전사','잔영 병사'],
    '해골 선원': ['갑판 해골','유령 선원','녹슨 선원','침몰 선원'],
    '실패한 합성수': ['불량 합성수','뒤섞인 실험체','변이 합성체','부서진 키메라'],
    '시험용 인형': ['목각 시험체','훈련 인형','검정 인형','채점 인형']
  };
  const nameCounts = new Map();
  for (const field of Object.values(fields)) {
    if (!field || !Array.isArray(field.pool)) continue;
    field.pool.forEach((monster, idx) => {
      const raw = String(monster.name || `몬스터${idx + 1}`).replace(/^[^·]{1,8}·/, '');
      const count = nameCounts.get(raw) || 0;
      nameCounts.set(raw, count + 1);
      const variants = shortRename[raw];
      monster.name = variants ? variants[count % variants.length] : raw;
      // 아이콘은 장황하게 늘리지 않고 등급 분위기만 살짝 다르게 합니다.
      const grade = monster.grade || '일반';
      if (grade === '정예' && monster.icon && !String(monster.icon).includes('◆')) monster.icon = `${monster.icon}◆`;
      if (grade === '보스' && monster.icon && !String(monster.icon).includes('★')) monster.icon = `${monster.icon}★`;
      monster.trait = String(monster.trait || '특수 전장 몬스터입니다.').replace(/\s?[^\s]+ 전용 개체입니다\.?/g, '').trim();
    });
  }
  // 저주받은 결계도시는 짧은 이름을 유지하되 중복 없는 이름으로 정리합니다.
  if (fields.barrierCity?.pool) {
    const barrierNames = ['원념 찌꺼기','기괴한 입술','뒤틀린 팔무리','검은 부적령','울음 가면','핏빛 손자국','결계 벌레','저주까마귀','목매단 혼령','붉은 실 주술체','균열 식귀','무언의 집행자','뒤집힌 얼굴','봉인 사제','검은 태아','원혼 갑주'];
    fields.barrierCity.pool.forEach((m, i) => {
      m.name = barrierNames[i % barrierNames.length];
      m.icon = (m.icon || '👾').replace(/^[⛩️👁️🧵📿🕳️🩸🪬🌑⚫🔒🧿⚔️🎭☯️🖤🛡️]+/u, '');
    });
  }
}
diversifyDungeonMonsterNamesAndIcons();


const bossArenas = {
  meadowBoss: { label:'초원 지배자의 들판', cls:'meadow', reward:{gold:700,dust:20}, hp:1.0, atk:1.0, desc:'돌진 공격이 강화되는 초원 보스 전장입니다.' },
  forestBoss: { label:'오염된 숲 중심부', cls:'forest', reward:{dust:55,rune:12}, hp:1.08, atk:1.05, desc:'독 장판과 회복 방해가 강화되는 숲 보스 전장입니다.' },
  caveBoss: { label:'무너진 심층 동굴', cls:'cave', reward:{rune:35,dust:25}, hp:1.18, atk:1.0, desc:'체력 재생형 보스에게 유리한 장기전 전장입니다.' },
  volcanoBoss: { label:'화산 핵실', cls:'volcano', reward:{gold:950,dust:75}, hp:1.1, atk:1.22, desc:'시간이 지날수록 화염 피해가 증가하는 전장입니다.' },
  snowBoss: { label:'빙결 왕좌', cls:'snow', reward:{manaCrystal:90,rune:20}, hp:1.05, atk:1.15, desc:'빙결과 둔화가 강화되는 설원 보스 전장입니다.' },
  desertBoss: { label:'모래폭풍 제단', cls:'desert', reward:{gold:1300,rune:30}, hp:1.0, atk:1.25, desc:'명중률 감소와 기습 피해가 발생하는 사막 보스 전장입니다.' },
  seaBoss: { label:'심해 왕궁', cls:'sea', reward:{manaCrystal:120,dust:35}, hp:1.12, atk:1.1, desc:'주기적인 파도 공격이 추가되는 해저 보스 전장입니다.' },
  undeadBoss: { label:'망자의 왕릉', cls:'undead', reward:{soul:6,rune:40}, hp:1.15, atk:1.18, desc:'언데드 소환과 회복 패턴이 강화되는 전장입니다.' },
  abyssBoss: { label:'심연 관측소', cls:'abyss', reward:{soul:9,rune:60}, hp:1.05, atk:1.45, desc:'스킬 봉인과 공허 피해가 강한 고난도 전장입니다.' },
  timeBoss: { label:'시간의 끝', cls:'time', reward:{soul:12,manaCrystal:160}, hp:1.25, atk:1.35, desc:'행동 지연과 쿨타임 증가가 누적되는 최종급 전장입니다.' },
  goldFieldBoss: { label:'황금 폐광 심층부', cls:'gold', reward:{gold:2200,dust:45}, hp:1.35, atk:0.95, desc:'황금 폐광 전용 보스 전장입니다. 체력은 높지만 골드 보상이 큽니다.' },
  manaFieldBoss: { label:'마나 균열 중심핵', cls:'mana', reward:{manaCrystal:180,rune:25}, hp:1.12, atk:1.15, desc:'마나 균열 전용 보스 전장입니다. 마나수정 보상이 높습니다.' },
  soulFieldBoss: { label:'영혼 사원 제단', cls:'soul', reward:{soul:16,rune:45}, hp:1.22, atk:1.65, desc:'영혼 사원 전용 보스 전장입니다. 위험하지만 영혼석 보상이 큽니다.' },
  crystalFieldBoss: { label:'유물 결정고 심장부', cls:'crystal', reward:{dust:180,gold:900}, hp:1.5, atk:1.05, desc:'유물 결정고 전용 보스 전장입니다. 단단한 보스를 상대합니다.' },
  runeFieldBoss: { label:'룬 서고 금서실', cls:'rune', reward:{rune:160,manaCrystal:60}, hp:1.18, atk:1.35, desc:'룬 서고 전용 보스 전장입니다. 스킬 성장 재료를 많이 줍니다.' },
  mirrorFieldBoss: { label:'거울 미궁 중심방', cls:'mirror', reward:{rune:120,dust:80}, hp:1.25, atk:1.25, desc:'거울 미궁 전용 보스 전장입니다. 반사 기믹이 강합니다.' },
  curseFieldBoss: { label:'납골당 저주 제단', cls:'curse', reward:{soul:12,dust:90}, hp:1.15, atk:1.7, desc:'저주받은 납골당 전용 보스 전장입니다. 자동 힐 봉인이 유지됩니다.' },
  clockFieldBoss: { label:'시간 가속로 핵실', cls:'clock', reward:{manaCrystal:150,soul:8}, hp:1.1, atk:1.45, desc:'시간 가속로 전용 보스 전장입니다. 시간이 길어질수록 위험해집니다.' },
  jackpotFieldBoss: { label:'도박꾼의 금고 왕실', cls:'jackpot', reward:{gold:3500,rune:35}, hp:0.95, atk:1.4, desc:'도박꾼의 금고 전용 보스 전장입니다. 보상 변동폭이 큽니다.' },
  gauntletFieldBoss: { label:'연전 투기장 결승장', cls:'gauntlet', reward:{gold:1600,dust:90,rune:60}, hp:1.3, atk:1.55, desc:'연전 투기장 전용 보스 전장입니다. 연전 누적 위험을 감수해야 합니다.' },
  alchemyFieldBoss: { label:'연금술 실험실 금지구역', cls:'alchemy', reward:{gold:900,manaCrystal:90,rune:40}, hp:1.12, atk:1.45, desc:'무작위 약품 반응이 보스전 전체에 적용됩니다.' },
  stormFieldBoss: { label:'폭풍 첨탑 정상', cls:'storm', reward:{manaCrystal:210,rune:55}, hp:1.08, atk:1.72, desc:'연쇄 번개가 강하게 발생하는 보스 전장입니다.' },
  gravityFieldBoss: { label:'중력 붕괴핵', cls:'gravity', reward:{rune:140,dust:100}, hp:1.45, atk:1.28, desc:'공격 속도 압박이 심한 보스 전장입니다.' },
  bloodFieldBoss: { label:'피의 제단 심장부', cls:'blood', reward:{soul:18,dust:80}, hp:1.18, atk:1.9, desc:'체력을 대가로 강한 보상을 얻는 보스 전장입니다.' },
  eclipseFieldBoss: { label:'월식 성역 중심부', cls:'eclipse', reward:{rune:150,soul:9}, hp:1.25, atk:1.62, desc:'피해와 회복 효율이 주기적으로 변하는 보스 전장입니다.' },
  gardenFieldBoss: { label:'생명의 온실 왕좌', cls:'garden', reward:{dust:230,manaCrystal:65}, hp:1.75, atk:1.05, desc:'보스가 지속적으로 회복하는 장기전 전장입니다.' },
  voidForgeFieldBoss: { label:'공허 제련소 용광로', cls:'voidforge', reward:{rune:210,soul:10}, hp:1.55, atk:1.7, desc:'공허 방어와 보호막이 강한 최상위 특수 보스 전장입니다.' },
  dreamFieldBoss: { label:'꿈의 회랑 심층부', cls:'dream', reward:{manaCrystal:220,gold:1000}, hp:1.05, atk:1.35, desc:'스킬 쿨타임과 마나 흐름이 랜덤하게 흔들리는 보스 전장입니다.' }
,
  barrierCityBoss: { label:'저주받은 결계도시 중심 결계', cls:'barrier-city', reward:{soul:28,rune:260,bossMedal:6}, hp:1.55, atk:1.45, desc:'봉인, 보호막, 반격, 영역 전개 패턴이 섞인 결계도시 보스 전장입니다.' }
};

const bosses = [
  { icon:'🐗', name:'초원의 거대멧돼지', element:'자연', trait:'초원을 지배하는 거대 야수입니다. 주기적으로 돌진 공격을 사용합니다.', hp:4.7, atk:1.55, minStage:1, rewardMult:1.0, mechanic:'charge', defaultArena:'meadowBoss' },
  { icon:'🫀', name:'타락한 숲의 심장', element:'자연/독', trait:'오염된 숲의 중심 괴물입니다. 회복 방해와 독 장판을 사용합니다.', hp:5.4, atk:1.55, minStage:2, rewardMult:1.15, mechanic:'poisonField', defaultArena:'forestBoss' },
  { icon:'🧌', name:'동굴 트롤 브루칸', element:'대지', trait:'동굴을 장악한 거대 트롤입니다. 체력을 자동 재생합니다.', hp:6.3, atk:1.45, minStage:3, rewardMult:1.25, mechanic:'bossRegen', defaultArena:'caveBoss' },
  { icon:'🔥', name:'화산의 심장 이그나르', element:'화염', trait:'화산 내부의 거대 정령입니다. 전장이 점점 뜨거워집니다.', hp:5.8, atk:1.85, minStage:4, rewardMult:1.35, mechanic:'heatUp', defaultArena:'volcanoBoss' },
  { icon:'👸', name:'빙결여왕 셀레니아', element:'얼음', trait:'설원의 지배자입니다. 빙결과 둔화를 사용합니다.', hp:5.9, atk:1.75, minStage:5, rewardMult:1.45, mechanic:'freezeSlow', defaultArena:'snowBoss' },
  { icon:'🌪️', name:'모래폭풍의 왕 자하르', element:'대지/바람', trait:'사막 폭풍을 다루는 보스입니다. 명중률을 감소시킵니다.', hp:5.7, atk:1.9, minStage:6, rewardMult:1.55, mechanic:'accuracyDown', defaultArena:'desertBoss' },
  { icon:'🐋', name:'심해의 포식자 레비아탄', element:'물', trait:'거대한 바다 괴수입니다. 광역 파도 공격을 사용합니다.', hp:6.8, atk:1.82, minStage:7, rewardMult:1.7, mechanic:'wave', defaultArena:'seaBoss' },
  { icon:'👑', name:'망자의 군주 모르칸', element:'암흑/언데드', trait:'언데드 군단의 지배자입니다. 부하를 소환합니다.', hp:6.5, atk:1.95, minStage:8, rewardMult:1.85, mechanic:'summonUndead', defaultArena:'undeadBoss' },
  { icon:'👁️', name:'심연의 눈 아자르', element:'공허', trait:'심연을 바라보는 거대 괴물입니다. 스킬을 봉인합니다.', hp:6.2, atk:2.18, minStage:9, rewardMult:2.0, mechanic:'skillSeal', defaultArena:'abyssBoss' },
  { icon:'⏰', name:'시간 포식자 크로노스', element:'시간', trait:'시간을 먹는 최종급 괴물입니다. 플레이어 행동을 지연합니다.', hp:7.8, atk:2.25, minStage:10, rewardMult:2.35, mechanic:'timeDelay', defaultArena:'timeBoss' },
  { icon:'🪙', name:'황금 광산왕 오르덴', element:'금속/대지', trait:'황금 폐광 전용 보스입니다. 체력이 높고 처치 시 골드 보상이 큽니다.', hp:5.2, atk:1.28, minStage:1, rewardMult:1.8, mechanic:'treasureGuard', defaultArena:'goldFieldBoss', fieldKey:'gold' },
  { icon:'🔮', name:'균열 대정령 마나리스', element:'마나', trait:'마나 균열 전용 보스입니다. 마나를 교란하고 스킬 사용을 압박합니다.', hp:4.9, atk:1.5, minStage:1, rewardMult:1.7, mechanic:'manaDrain', defaultArena:'manaFieldBoss', fieldKey:'mana' },
  { icon:'👻', name:'영혼 심판자 네크라', element:'영혼/암흑', trait:'영혼 사원 전용 보스입니다. 공격력이 높고 실패 위험이 큽니다.', hp:5.6, atk:2.05, minStage:1, rewardMult:2.0, mechanic:'spiritRisk', defaultArena:'soulFieldBoss', fieldKey:'soul' },
  { icon:'💎', name:'결정 파수왕 아르곤', element:'수정/대지', trait:'유물 결정고 전용 보스입니다. 두꺼운 방어막과 높은 체력을 가집니다.', hp:6.4, atk:1.25, minStage:1, rewardMult:1.7, mechanic:'crystalArmor', defaultArena:'crystalFieldBoss', fieldKey:'crystal' },
  { icon:'📕', name:'금서의 룬 마스터', element:'룬', trait:'룬 서고 전용 보스입니다. 룬 폭주와 스킬 방해를 사용합니다.', hp:5.0, atk:1.7, minStage:1, rewardMult:1.85, mechanic:'runeSurge', defaultArena:'runeFieldBoss', fieldKey:'rune' },
  { icon:'🪞', name:'거울 군주 리플렉스', element:'거울/공허', trait:'거울 미궁 전용 보스입니다. 주기적으로 피해를 반사하지만 보호막으로 흡수할 수 있습니다.', hp:5.3, atk:1.45, minStage:1, rewardMult:1.75, mechanic:'reflect', defaultArena:'mirrorFieldBoss', fieldKey:'mirror' },
  { icon:'☠️', name:'저주받은 왕 카르딘', element:'저주/언데드', trait:'저주받은 납골당 전용 보스입니다. 자동 힐을 봉인합니다.', hp:5.1, atk:1.95, minStage:1, rewardMult:1.9, mechanic:'noAutoHeal', defaultArena:'curseFieldBoss', fieldKey:'curse' },
  { icon:'⏳', name:'가속로 관리자 티크', element:'시간/기계', trait:'시간 가속로 전용 보스입니다. 시간이 지날수록 공격력이 상승합니다.', hp:4.8, atk:1.65, minStage:1, rewardMult:1.75, mechanic:'timePressure', defaultArena:'clockFieldBoss', fieldKey:'clock' },
  { icon:'🎰', name:'금고 미믹 잭팟', element:'황금/도박', trait:'도박꾼의 금고 전용 보스입니다. 보상이 크게 흔들립니다.', hp:4.6, atk:1.55, minStage:1, rewardMult:2.2, mechanic:'jackpot', defaultArena:'jackpotFieldBoss', fieldKey:'jackpot' },
  { icon:'🏆', name:'투기장 챔피언 브락스', element:'물리', trait:'연전 투기장 전용 보스입니다. 연전 수가 높을수록 더 위험합니다.', hp:5.8, atk:1.85, minStage:1, rewardMult:1.9, mechanic:'streak', defaultArena:'gauntletFieldBoss', fieldKey:'gauntlet' },
  { icon:'⚗️', name:'금지된 연금술사 엘릭', element:'연금/혼돈', trait:'연금술 실험실 전용 보스입니다. 무작위 약품 반응으로 전장을 뒤흔듭니다.', hp:5.1, atk:1.65, minStage:1, rewardMult:1.85, mechanic:'unstableBrew', defaultArena:'alchemyFieldBoss', fieldKey:'alchemy' },
  { icon:'🌩️', name:'폭풍 군주 볼타르', element:'번개/바람', trait:'폭풍 첨탑 전용 보스입니다. 연쇄 번개와 강한 추가타를 사용합니다.', hp:5.0, atk:2.0, minStage:1, rewardMult:1.9, mechanic:'stormChain', defaultArena:'stormFieldBoss', fieldKey:'storm' },
  { icon:'🕳️', name:'중력 포식체 그라비온', element:'중력/공허', trait:'중력 붕괴지 전용 보스입니다. 공격 속도를 압박하고 체력이 높습니다.', hp:6.7, atk:1.55, minStage:1, rewardMult:1.9, mechanic:'gravityWell', defaultArena:'gravityFieldBoss', fieldKey:'gravity' },
  { icon:'🩸', name:'피의 대사제 바르모스', element:'피/영혼', trait:'피의 제단 전용 보스입니다. 플레이어 체력을 지속적으로 압박합니다.', hp:5.4, atk:2.1, minStage:1, rewardMult:2.05, mechanic:'bloodDebt', defaultArena:'bloodFieldBoss', fieldKey:'blood' },
  { icon:'🌘', name:'월식의 사도 루나크', element:'암흑/달', trait:'월식 성역 전용 보스입니다. 전장 주기에 따라 피해와 회복을 뒤집습니다.', hp:5.6, atk:1.82, minStage:1, rewardMult:1.95, mechanic:'eclipseCycle', defaultArena:'eclipseFieldBoss', fieldKey:'eclipse' },
  { icon:'🌺', name:'온실의 여왕 플로리아', element:'생명/자연', trait:'생명의 온실 전용 보스입니다. 강한 재생력을 가진 장기전 보스입니다.', hp:7.2, atk:1.25, minStage:1, rewardMult:1.8, mechanic:'overgrowth', defaultArena:'gardenFieldBoss', fieldKey:'garden' },
  { icon:'⬛', name:'공허 제련왕 눌포지', element:'공허/금속', trait:'공허 제련소 전용 보스입니다. 높은 방어와 보호막을 가집니다.', hp:7.0, atk:1.9, minStage:1, rewardMult:2.15, mechanic:'voidForge', defaultArena:'voidForgeFieldBoss', fieldKey:'voidForge' },
  { icon:'💤', name:'몽환 관리자 솜니아', element:'꿈/마나', trait:'꿈의 회랑 전용 보스입니다. 스킬 쿨타임과 마나 흐름을 뒤흔듭니다.', hp:4.9, atk:1.55, minStage:1, rewardMult:1.8, mechanic:'dreamShift', defaultArena:'dreamFieldBoss', fieldKey:'dream' }
,
  { icon:'👁️', name:'백안의 저주왕', element:'저주/정신', trait:'수많은 눈을 가진 저주의 왕입니다. 일정 주기마다 플레이어 스킬을 봉인합니다.', hp:6.2, atk:1.85, minStage:35, rewardMult:2.25, mechanic:'skillSeal', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'📿', name:'결계주 아라문', element:'봉인/공허', trait:'결계를 만든 실패한 주술사의 잔재입니다. 보호막을 파괴해야 피해가 제대로 들어갑니다.', hp:7.0, atk:1.65, minStage:36, rewardMult:2.35, mechanic:'barrierShield', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🦉', name:'식귀군주 누에라', element:'저주/암흑', trait:'식귀들을 지배하는 괴물입니다. 부하 몬스터를 소환합니다.', hp:6.4, atk:1.95, minStage:37, rewardMult:2.45, mechanic:'summonUndead', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🫥', name:'무량한 원념체', element:'저주', trait:'수많은 원한이 합쳐진 괴물입니다. 체력이 낮을수록 공격 속도가 증가합니다.', hp:7.4, atk:1.75, minStage:38, rewardMult:2.55, mechanic:'enrage', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🖤', name:'검은 제단의 태아', element:'저주/공허', trait:'제단에서 깨어나는 미완성 재앙입니다. 전투 시간이 길수록 진화합니다.', hp:7.8, atk:1.78, minStage:39, rewardMult:2.7, mechanic:'evolve', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🧵', name:'붉은 결속의 마녀', element:'봉인/정신', trait:'저주 실로 대상을 묶는 마녀입니다. 행동 제한과 회복 방해를 사용합니다.', hp:6.6, atk:1.9, minStage:40, rewardMult:2.8, mechanic:'bindingWitch', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🪞', name:'거울 속의 심판자', element:'정신/공허', trait:'플레이어의 힘을 복사하는 존재입니다. 일정 확률로 플레이어 공격을 반사합니다.', hp:6.8, atk:1.82, minStage:41, rewardMult:2.9, mechanic:'reflect', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' },
  { icon:'🕳️', name:'영역포식자 카르반', element:'공허/저주', trait:'결계를 먹어치우는 최상급 괴물입니다. 전장 효과를 바꾸는 패턴을 사용합니다.', hp:8.6, atk:2.05, minStage:42, rewardMult:3.15, mechanic:'domainDevour', defaultArena:'barrierCityBoss', fieldKey:'barrierCity' }

];


function addThemedSpecialDungeons() {
  const specs = [
    {
      key:'giantCitadel', label:'거인의 붕괴성채', cls:'giant', minStage:45, reward:'dust', hp:1.72, atk:1.34, mechanic:'armor',
      desc:'거대한 생명체들이 성벽을 부수며 침공하는 전장입니다. 부위 파괴, 돌진 회피, 방어선 유지가 핵심 콘셉트입니다. 체력이 높은 적이 많아 도트뎀과 방어 저하가 유효합니다.',
      tip:'체력이 높은 거인형 몬스터가 많습니다. 지속피해술, 약화술, 보호 장벽을 함께 준비하세요.',
      monsters:[
        ['일반','🧱💥','성벽 파괴자','거대한 공성추를 든 파괴자','물리','방어력 감소 공격','defDown',1.12,1.05],
        ['일반','🦣🪖','기형 거인병','비정상적으로 성장한 거인 병사','대지/물리','체력이 높음','armor',1.45,0.95],
        ['정예','📣🦍','포효하는 거구','포효로 전장을 압박하는 거구','정신/물리','전체 공포','fearDot',1.65,1.18],
        ['정예','🛡️🦣','철피 거인','철 같은 피부를 가진 거인','물리/대지','물리 피해 감소','armor',1.85,1.08]
      ],
      bosses:[
        ['🏰🦣','붕괴의 거인 바르둔','대지/물리','성벽 게이지를 깎아 전장을 무너뜨리는 거인 보스입니다.',6.5,1.65,'charge'],
        ['🫀🗿','심장 없는 초거체','대지/공허','부위 파괴 후 본체를 공격해야 하는 최종 보스입니다.',8.2,1.75,'barrierShield']
      ]
    },
    {
      key:'bloodMoonMountain', label:'귀살의 혈월산', cls:'bloodmoon', minStage:48, reward:'rune', hp:1.38, atk:1.62, mechanic:'bleed',
      desc:'붉은 달이 뜰 때만 열리는 산속 던전입니다. 밤 시간 강화, 출혈, 흡혈이 핵심이며 체력 관리가 중요합니다.',
      tip:'흡혈과 힐을 함께 쓰지 않으면 출혈 누적으로 위험해집니다.',
      monsters:[
        ['일반','🧛‍♂️🌙','혈귀 하수인','붉은 달 아래 움직이는 혈귀','암흑','흡혈','manaDrain',1.0,1.18],
        ['일반','🩸🦷','붉은 송곳니','날카로운 송곳니를 가진 혈귀','물리/저주','출혈','bleed',0.95,1.28],
        ['정예','🌘🥷','달그림자 귀인','달빛 속에 사라지는 귀인','암흑','회피율 높음','evasion',1.25,1.42],
        ['정예','🌫️⚔️','피안개 검사','피안개 속에서 연속 베기 사용','저주/물리','연속 베기','multiHit',1.35,1.5]
      ],
      bosses:[
        ['💃🩸','혈월의 무희 라이나','정신/저주','분신을 만들어 공격 기회를 흐트러뜨리는 보스입니다.',5.8,1.85,'evasion'],
        ['👑🌕','붉은 달의 왕 오르칸','암흑/저주','밤이 깊어질수록 강해지는 최종 보스입니다.',7.8,2.0,'timePressure']
      ]
    },
    {
      key:'forbiddenLab', label:'연금술사의 금지연구소', cls:'alchemy', minStage:50, reward:'manaCrystal', hp:1.42, atk:1.42, mechanic:'unstableBrew',
      desc:'생명 창조 실험이 실패한 지하 연구소입니다. 합성 몬스터, 폭주, 속성 변환이 자주 발생합니다.',
      tip:'무작위성이 강합니다. 보호막과 흡혈을 챙겨 변수에 대응하세요.',
      monsters:[
        ['일반','🧬🐾','실패한 합성수','여러 생물의 일부가 섞인 실험체','무작위','무작위 속성','unstableBrew',1.05,1.12],
        ['일반','🧪👶','유리병 태아','유리병 속에서 깨어난 미완성 생명','연금','죽을 때 폭발','deathBomb',0.9,1.18],
        ['정예','☿️🗿','수은 골렘','흐르는 금속으로 된 골렘','금속','물리 피해 반사','reflect',1.55,1.05],
        ['정예','🪽🤖','금속 날개 키메라','금속 날개를 단 빠른 합성수','금속/바람','빠른 연속 공격','multiHit',1.25,1.55]
      ],
      bosses:[
        ['⚗️🧙','금기의 연금술사 엘바론','연금/혼돈','몬스터를 합성해 전장 변수를 만드는 보스입니다.',6.2,1.72,'unstableBrew'],
        ['🧬⚫','완성체 호문크라스 제로','무속성/변환','페이즈마다 속성이 변화하는 최종 보스입니다.',8.0,1.88,'evolve']
      ]
    },
    {
      key:'blackGarden', label:'사신의 검은 정원', cls:'undead', minStage:52, reward:'soul', hp:1.55, atk:1.5, mechanic:'spiritRisk',
      desc:'죽은 영혼들이 심판을 기다리는 검은 정원입니다. 즉사 카운트, 영혼 수확, 부활 방해가 핵심입니다.',
      tip:'체력과 보호막을 충분히 올리고, 장기전은 피하세요.',
      monsters:[
        ['일반','🕯️🔥','떠도는 혼불','심판을 기다리는 작은 영혼불','영혼','마법 피해','magicBurst',0.95,1.2],
        ['일반','💀🪓','검은 낫의 망자','검은 낫을 든 망자','언데드','치명타','crit',1.05,1.3],
        ['정예','🪦⏱️','영혼 수확자','영혼을 거두는 정예 사신','암흑','즉사 카운트 부여','timeDelay',1.45,1.42],
        ['정예','🪦♞','묘비 기사','묘비를 방패로 삼는 기사','언데드/대지','방어력 높음','armor',1.75,1.08]
      ],
      bosses:[
        ['🪓👤','사신대행 모르딘','암흑/언데드','죽은 몬스터의 힘을 흡수하는 보스입니다.',6.4,1.75,'summonUndead'],
        ['🌑👑','검은 정원의 주인 네브라','암흑/영혼','영혼 게이지가 차면 즉사급 패턴을 쓰는 최종 보스입니다.',8.4,1.92,'timePressure']
      ]
    },
    {
      key:'forbiddenLibrary', label:'마법학원의 금지서고', cls:'rune', minStage:54, reward:'rune', hp:1.34, atk:1.48, mechanic:'runeSurge',
      desc:'봉인된 마법책들이 폭주한 지하 서고입니다. 주문 반사, 마나 소모 증가, 속성 퍼즐이 등장합니다.',
      tip:'마나 엔진을 강화하고 반사 피해에 대비하세요.',
      monsters:[
        ['일반','📘🪽','날아다니는 마도서','날아다니며 주문을 쏘는 책','마법','마법 공격','magicBurst',0.95,1.2],
        ['일반','🖋️🟣','잉크 슬라임','마법 잉크가 뭉친 슬라임','마법/정신','명중률 감소','accuracyDown',1.0,1.05],
        ['정예','📕🛡️','금서의 파수꾼','금서를 지키는 정예 수호자','룬','주문 반사','reflect',1.45,1.25],
        ['정예','📚🌪️','살아있는 책장','책장이 괴물이 된 존재','마법','광역 공격','aoe',1.65,1.22]
      ],
      bosses:[
        ['🎓📕','금서관장 아르펜','룬/마법','금서를 계속 소환하는 보스입니다.',6.0,1.72,'summonUndead'],
        ['📖🌌','최초의 금서 에클리프','룬/공허','플레이어 스킬을 복사하는 최종 보스입니다.',7.7,1.9,'skillDisrupt']
      ]
    },
    {
      key:'sunkenFleet', label:'해적왕의 침몰함대', cls:'sea', minStage:56, reward:'gold', hp:1.42, atk:1.5, mechanic:'wave',
      desc:'저주받은 해적선들이 모인 유령 함대입니다. 포격, 침수 게이지, 보물 상자 함정이 핵심입니다.',
      tip:'파도 공격과 속박에 대비해 체력과 힐을 준비하세요.',
      monsters:[
        ['일반','☠️⚓','해골 선원','침몰선에서 되살아난 선원','언데드/물','기본 근접','none',1.0,1.0],
        ['일반','🩸🏴‍☠️','저주받은 갑판수','갑판을 떠도는 저주 선원','저주/물','출혈','bleed',1.05,1.18],
        ['정예','👻💣','유령 포수','먼 거리에서 포격하는 유령','언데드/화약','원거리 포격','ranged',1.3,1.45],
        ['정예','🐙🌊','심해 문어귀','심해에서 올라온 문어 괴물','물','속박','bind',1.55,1.25]
      ],
      bosses:[
        ['🏴‍☠️💣','침몰선장 드레이칸','물/언데드','포격 패턴을 사용하는 보스입니다.',6.2,1.78,'wave'],
        ['🛳️🐋','심해함대의 제독 바르모스','물/암흑','배 전체를 전장으로 사용하는 최종 보스입니다.',8.1,1.95,'aoe']
      ]
    },
    {
      key:'shadowVillage', label:'닌자 그림자마을', cls:'abyss', minStage:58, reward:'rune', hp:1.22, atk:1.72, mechanic:'evasion',
      desc:'그림자 인술을 쓰는 은둔 마을입니다. 분신, 은신, 함정이 계속 전투 흐름을 방해합니다.',
      tip:'명중률 저하와 회피가 많으므로 치명타와 광역기를 함께 쓰세요.',
      monsters:[
        ['일반','🥷💨','그림자 수련생','그림자처럼 빠른 수련생','암흑/물리','빠른 공격','fast',0.92,1.32],
        ['일반','☠️🪡','독침 닌자','독침을 던지는 닌자','독/물리','중독','poison',0.95,1.28],
        ['정예','🌫️🥷','연막술사','연막으로 모습을 감추는 술사','암흑','회피율 증가','evasion',1.25,1.45],
        ['정예','👥⚔️','분신 검사','분신을 불러 검격을 나누는 검사','암흑/물리','분신 소환','multiHit',1.35,1.55]
      ],
      bosses:[
        ['👴🌑','그림자 장로 카이젠','암흑/정신','은신 후 강공격을 사용하는 보스입니다.',5.8,2.05,'ambush'],
        ['🖤🥷','무영의 군주 렌마','암흑/공허','진짜와 가짜를 구분해야 하는 최종 보스입니다.',7.4,2.12,'evasion']
      ]
    },
    {
      key:'hunterExam', label:'헌터 시험장', cls:'gauntlet', minStage:60, reward:'mixed', hp:1.32, atk:1.44, mechanic:'streak',
      desc:'플레이어를 시험하는 특수 전투장입니다. 제한 조건, 랜덤 미션, 점수제가 적용되는 생존형 던전입니다.',
      tip:'균형 잡힌 빌드가 유리합니다. 특정 능력만 높이면 시험 패턴에 막힐 수 있습니다.',
      monsters:[
        ['일반','🎯🤖','시험용 인형','훈련용 기본 인형','무속성','기본형','none',0.9,0.95],
        ['일반','🪤👷','함정 설치병','전장에 함정을 설치하는 병사','물리','함정 생성','ambush',1.0,1.18],
        ['정예','🏃‍♂️⏱️','속도 시험관','속도 테스트를 담당하는 정예','물리','빠른 이동','fast',1.18,1.52],
        ['정예','💪🧪','힘의 시험관','강한 일격을 시험하는 정예','물리','강한 한 방','execution',1.45,1.42]
      ],
      bosses:[
        ['🧑‍🏫📋','시험감독 루카스','전술/물리','조건 달성 실패 시 강화되는 보스입니다.',6.0,1.68,'timePressure'],
        ['🏅👁️','최종 심사관 베른','전술/정신','플레이어 전투 방식을 분석하는 최종 보스입니다.',7.6,1.85,'skillDisrupt']
      ]
    },
    {
      key:'digitalAbyss', label:'디지털 버그 심연', cls:'voidforge', minStage:62, reward:'manaCrystal', hp:1.38, atk:1.48, mechanic:'dreamShift',
      desc:'게임 시스템 내부에 생긴 오류 공간입니다. 스탯 오류, 화면 왜곡, 버그 디버프가 발생합니다.',
      tip:'마나 흐름이 흔들리므로 자동 스킬과 마나 회복을 과신하지 마세요.',
      monsters:[
        ['일반','🟩🧫','데이터 슬라임','데이터 덩어리로 된 슬라임','디지털','무작위 능력치','unstableBrew',1.0,1.1],
        ['일반','🐞⚠️','글리치 벌레','오류를 일으키는 작은 벌레','버그','명중률 오류','accuracyDown',0.92,1.25],
        ['정예','🛡️🦠','바이러스 기사','악성코드를 두른 기사','디지털/독','지속 피해','poison',1.42,1.3],
        ['정예','🧱🔥','방화벽 골렘','거대한 방화벽으로 된 골렘','디지털/화염','보호막','shield',1.65,1.15]
      ],
      bosses:[
        ['💻❌','오류 관리자 코드-X','디지털/공허','플레이어 스탯 일부를 잠그는 보스입니다.',6.4,1.75,'skillDisrupt'],
        ['NULL🕳️','시스템 붕괴체 NULL','디지털/공허','전투 UI를 방해하는 최종 보스입니다.',8.3,1.88,'dreamShift']
      ]
    },
    {
      key:'demonCourt', label:'악마 계약의 법정', cls:'blood', minStage:64, reward:'soul', hp:1.45, atk:1.55, mechanic:'curse',
      desc:'영혼 계약을 재판하는 지옥 법정입니다. 계약 디버프, 선택지, 죄업 게이지가 핵심입니다.',
      tip:'버프 삭제와 디버프가 많아 패시브와 기본 성장의 비중이 중요합니다.',
      monsters:[
        ['일반','📜😈','계약서 악마','계약서에서 튀어나온 악마','악마/저주','디버프 부여','curse',1.0,1.2],
        ['일반','🖋️🔥','지옥 서기','판결문을 기록하는 서기','악마','플레이어 버프 삭제','buffPurge',1.05,1.16],
        ['정예','📢⚖️','죄목 낭독자','죄를 선포하는 정예 악마','정신/저주','받는 피해 증가','defDown',1.35,1.35],
        ['정예','🔨👹','붉은 망치 집행관','판결을 집행하는 악마','화염/물리','강한 단일 공격','execution',1.5,1.45]
      ],
      bosses:[
        ['⚖️😈','악마판사 벨리온','악마/저주','유죄 선고 후 즉시 강화되는 보스입니다.',6.5,1.82,'evolve'],
        ['🩸📜','대계약자 루시온','악마/영혼','플레이어와 강제 계약을 체결하는 최종 보스입니다.',8.4,1.98,'bloodDebt']
      ]
    },
    {
      key:'skyMachineTemple', label:'하늘섬의 기계신전', cls:'storm', minStage:66, reward:'rune', hp:1.5, atk:1.46, mechanic:'stormChain',
      desc:'하늘에 떠 있는 고대 기계 신전입니다. 레이저, 전력 충전, 기계 부품 파괴가 핵심입니다.',
      tip:'기계형 적은 보호막과 방어가 많아 강한 단일 공격이 필요합니다.',
      monsters:[
        ['일반','🚁🥉','청동 드론','청동으로 만든 공중 드론','기계','원거리 공격','ranged',0.95,1.25],
        ['일반','⚙️🛡️','톱니 파수병','톱니장치로 움직이는 파수병','기계/금속','방어력 높음','armor',1.25,1.0],
        ['정예','⚡🤖','전류 사제기계','전류를 다루는 기계 사제','기계/번개','감전','shock',1.35,1.35],
        ['정예','🕰️🦾','태엽 거신','느리지만 강한 태엽 거신','기계/대지','느리지만 강함','execution',1.75,1.18]
      ],
      bosses:[
        ['🧙‍♂️🤖','기계사제 오르비스','기계/번개','드론을 소환하는 보스입니다.',6.8,1.68,'summonUndead'],
        ['🌌🤖','천공기신 아스트라온','기계/신성','충전 완료 시 광역 레이저를 발사합니다.',8.8,1.9,'stormChain']
      ]
    },
    {
      key:'kaijuZone', label:'괴수 격리구역', cls:'volcano', minStage:68, reward:'dust', hp:1.68, atk:1.48, mechanic:'timePressure',
      desc:'거대 괴수들이 탈출한 비밀 격리구역입니다. 시설 파괴, 방사능, 괴수 포효가 핵심입니다.',
      tip:'체력과 보호막이 부족하면 포효와 지속 피해에 무너질 수 있습니다.',
      monsters:[
        ['일반','🦎☢️','변이 도마뱀','방사능에 변이된 도마뱀','독/괴수','독 피해','poison',1.1,1.2],
        ['일반','🐛☢️','방사능 벌레','방사능을 품은 벌레','독','지속 피해','strongPoison',1.0,1.18],
        ['정예','🧪13','실험체 13호','폭주한 실험체','괴수','폭주','enrage',1.55,1.42],
        ['정예','🦖🛡️','철갑 괴수','철갑 외피를 가진 괴수','괴수/대지','방어력 매우 높음','armor',1.9,1.18]
      ],
      bosses:[
        ['🏚️🦖','격리파괴자 라곤','괴수/대지','시설 파괴 시 강화되는 보스입니다.',7.1,1.8,'evolve'],
        ['☢️🐲','재앙괴수 제노라','괴수/방사능','포효로 전체 행동을 지연하는 최종 보스입니다.',9.0,2.0,'timeDelay']
      ]
    },
    {
      key:'nightmareTheater', label:'꿈먹는 악몽극장', cls:'dream', minStage:70, reward:'manaCrystal', hp:1.28, atk:1.5, mechanic:'dreamShift',
      desc:'플레이어의 기억과 공포를 연극처럼 보여주는 극장입니다. 환각, 조작 반전, 가짜 보상이 등장합니다.',
      tip:'랜덤성이 강하므로 자동 스킬보다 안정적인 패시브와 기본 체력이 중요합니다.',
      monsters:[
        ['일반','🤡🧸','웃는 인형','기괴하게 웃는 인형','정신','정신 피해','magicBurst',0.95,1.22],
        ['일반','🎭👥','가짜 관객','실체가 없는 관객들','정신','명중률 감소','accuracyDown',1.0,1.05],
        ['정예','🤡🌙','악몽 광대','혼란을 거는 악몽 광대','정신/암흑','혼란','skillDisrupt',1.3,1.42],
        ['정예','🖐️🎬','커튼 뒤의 손','커튼 뒤에서 붙잡는 손','정신','속박','bind',1.45,1.28]
      ],
      bosses:[
        ['🎩🎭','극장주 모르페인','정신/꿈','가짜 분신을 생성하는 보스입니다.',6.4,1.7,'evasion'],
        ['🌙🎬','꿈먹는 배우 노크티스','정신/공허','플레이어 기억을 복사하는 최종 보스입니다.',8.2,1.9,'dreamShift']
      ]
    },
    {
      key:'heroTomb', label:'영웅무덤의 망령전장', cls:'undead', minStage:72, reward:'soul', hp:1.58, atk:1.45, mechanic:'streak',
      desc:'죽은 영웅들이 잠들지 못하고 싸우는 전장입니다. 명예 게이지, 결투, 영웅의 축복/저주가 핵심입니다.',
      tip:'방어형 적이 많아 긴 전투를 대비하세요.',
      monsters:[
        ['일반','⚔️👻','전사 망령','전쟁터에 남은 전사 영혼','언데드/물리','물리 공격','none',1.1,1.1],
        ['일반','🔱💔','부러진 창병','부러진 창을 든 망령','언데드/물리','방어력 감소','defDown',1.0,1.18],
        ['일반','🏹👻','망령 궁수','원거리에서 공격하는 망령','언데드','원거리 공격','ranged',0.95,1.2],
        ['정예','♞🛡️','고대 기사장','방어 태세를 갖춘 기사장','언데드/물리','방어 태세','armor',1.75,1.22]
      ],
      bosses:[
        ['🚩⚔️','붉은 깃발의 장군','언데드/전쟁','병사를 소환하는 보스입니다.',6.8,1.75,'summonUndead'],
        ['👑⚔️','무덤의 영웅왕 레오마르','언데드/신성','정정당당한 결투 패턴의 최종 보스입니다.',8.6,1.95,'execution']
      ]
    },
    {
      key:'demonFactory', label:'마왕군 비밀병기공장', cls:'voidforge', minStage:74, reward:'dust', hp:1.55, atk:1.5, mechanic:'voidForge',
      desc:'마왕군이 몬스터와 병기를 제작하는 공장입니다. 생산 라인 차단, 폭탄 해체, 기계 몬스터가 핵심입니다.',
      tip:'폭발형 몬스터와 포탑이 많아 보호막이 유용합니다.',
      monsters:[
        ['일반','👿⚙️','공장 임프','공장 라인을 돌보는 임프','악마/기계','빠른 공격','fast',0.95,1.25],
        ['일반','💣🏃','폭탄 운반병','폭탄을 운반하는 병사','화약','죽을 때 폭발','deathBomb',0.9,1.15],
        ['정예','🛡️🐗','철갑 오크병','철갑으로 무장한 오크','물리/금속','방어력 높음','armor',1.65,1.25],
        ['정예','🔫🏭','마력포탑','고정 원거리 포탑','기계/마력','고정 원거리 공격','ranged',1.35,1.5]
      ],
      bosses:[
        ['👹🏭','공장장 그룸','악마/기계','생산 라인을 가동하는 보스입니다.',6.7,1.78,'summonUndead'],
        ['🤖🔥','마도병기 베르칸트','기계/마력','부품 파괴형 최종 보스입니다.',8.8,1.95,'barrierShield']
      ]
    },
    {
      key:'dragonTrial', label:'용의 시험장', cls:'volcano', minStage:76, reward:'rune', hp:1.5, atk:1.66, mechanic:'heatUp',
      desc:'용족이 강자를 시험하는 신성한 전장입니다. 속성 시험, 브레스 회피, 용의 낙인이 핵심입니다.',
      tip:'원소 패턴이 다양하므로 힐, 보호막, 강한 공격을 균형 있게 장착하세요.',
      monsters:[
        ['일반','🐉💨','새끼 비룡','빠르게 날아드는 새끼 용','용/바람','빠른 공격','fast',0.95,1.3],
        ['일반','🔥🐲','화염 비늘병','화염 비늘을 지닌 용족 병사','화염','화상','burn',1.1,1.2],
        ['정예','⚡🐲','번개 발톱룡','번개 발톱을 지닌 용','번개','감전','shock',1.35,1.45],
        ['정예','❄️🪽','서리 날개룡','서리 날개를 펼치는 용','얼음','둔화','slow',1.45,1.35]
      ],
      bosses:[
        ['🐲🔄','시험관 드라켄','용/원소','속성을 바꾸며 시험하는 보스입니다.',6.9,1.85,'eclipseCycle'],
        ['🐉🌌','고대용 아르카디온','용/원소','모든 원소 브레스를 사용하는 최종 보스입니다.',9.2,2.05,'aoe']
      ]
    },
    {
      key:'fallenStar', label:'별의 추락지', cls:'abyss', minStage:78, reward:'manaCrystal', hp:1.48, atk:1.52, mechanic:'gravityWell',
      desc:'떨어진 별의 파편이 생명체를 변이시킨 지역입니다. 중력 변화, 별빛 폭발, 변이가 핵심입니다.',
      tip:'중력으로 공격 흐름이 느려지니 강한 액티브 스킬을 준비하세요.',
      monsters:[
        ['일반','✨🟣','별가루 슬라임','별가루가 뭉친 슬라임','별빛','마법 피해','magicBurst',1.0,1.15],
        ['일반','🦌🌠','변이 사슴','별빛에 변이된 사슴','변이','빠른 돌진','charge',0.95,1.28],
        ['정예','🐛🪐','중력 벌레','중력을 비트는 벌레','중력','이동속도 감소','slow',1.35,1.35],
        ['정예','☄️🗿','운석 골렘','운석 파편으로 된 골렘','대지/별빛','방어력 높음','armor',1.75,1.2]
      ],
      bosses:[
        ['🌟🛡️','별핵 수호자 루미온','별빛/중력','중력장을 생성하는 보스입니다.',6.8,1.75,'gravityWell'],
        ['☄️👁️','추락한 별의 의지 아스테르','별빛/공허','전장 중력을 바꾸는 최종 보스입니다.',8.9,1.95,'domainDevour']
      ]
    },
    {
      key:'yokaiMarket', label:'요괴시장 철귀습격', cls:'curse', minStage:80, reward:'gold', hp:1.36, atk:1.58, mechanic:'jackpot',
      desc:'자정에만 열리는 요괴들의 시장입니다. 거래, 속임수, 랜덤 상점이 핵심입니다.',
      tip:'보상은 좋지만 가짜 보상과 침묵이 많습니다. 탐사 보상 스킬이 유용합니다.',
      monsters:[
        ['일반','☂️👻','종이우산 요괴','종이우산에 깃든 요괴','요괴','회피율 높음','evasion',0.95,1.16],
        ['일반','🏺👹','항아리 도깨비','항아리에 숨어 물건을 훔치는 도깨비','요괴','랜덤 아이템 훔침','jackpot',1.0,1.2],
        ['정예','🦊🎭','여우가면 상인','가짜 보상을 제시하는 상인','요괴/정신','가짜 보상 제시','dreamShift',1.25,1.35],
        ['정예','👅🔴','붉은 혀 요괴','말을 봉인하는 요괴','저주','침묵','minorSkillSeal',1.35,1.42]
      ],
      bosses:[
        ['🏮🦊','야시장 주인 하쿠렌','요괴/황금','돈을 빼앗아 강화되는 보스입니다.',6.3,1.78,'treasureGuard'],
        ['👹⚔️','철귀 오니마루','요괴/물리','요괴 무리를 소환하는 최종 보스입니다.',8.5,2.0,'summonUndead']
      ]
    },
    {
      key:'ruinedGods', label:'신들의 폐허', cls:'eclipse', minStage:85, reward:'soul', hp:1.72, atk:1.62, mechanic:'eclipseCycle',
      desc:'신들이 버린 신전에서 타락한 신성이 깨어나는 최상위 던전입니다. 신성/타락 선택, 제단 활성화, 심판이 핵심입니다.',
      tip:'최상위 성장과 환생 영구 특성이 충분할 때 도전하세요.',
      monsters:[
        ['일반','🗿🪽','부서진 천사상','부서진 천사상이 움직이는 존재','신성','신성 공격','magicBurst',1.25,1.25],
        ['일반','🧎‍♂️🖤','타락한 사제','타락한 신을 섬기는 사제','암흑/신성','회복 방해','curse',1.15,1.32],
        ['정예','🛡️⛩️','제단 수호자','제단을 지키는 정예 수호자','신성/대지','보호막','shield',1.75,1.35],
        ['정예','👁️‍🗨️📜','눈먼 예언자','미래를 읽는 예언자','정신/신성','플레이어 행동 예측','skillDisrupt',1.45,1.55]
      ],
      bosses:[
        ['⛩️🧙','버려진 신관 엘리오스','신성/타락','제단 기믹을 사용하는 보스입니다.',7.4,1.9,'eclipseCycle'],
        ['🌗👑','이름 잃은 신 노바르','신성/암흑','신성/암흑 페이즈를 전환하는 최종 보스입니다.',10.5,2.18,'domainDevour']
      ]
    }
  ];

  specs.forEach((spec, specIndex) => {
    const pool = spec.monsters.map(([grade, icon, name, concept, element, feature, mechanic, hp, atk]) => ({
      grade, icon, name, concept, element,
      trait: `${concept}. ${feature}.`,
      hp, atk, mechanic
    }));
    fields[spec.key] = {
      label: spec.label,
      minStage: spec.minStage,
      cls: spec.cls,
      reward: spec.reward,
      hp: spec.hp,
      atk: spec.atk,
      mechanic: spec.mechanic,
      pool,
      desc: spec.desc,
      tip: spec.tip,
      specialTier: 6 + Math.floor(specIndex / 3)
    };
    const arenaKey = `${spec.key}Boss`;
    bossArenas[arenaKey] = {
      label: `${spec.label} 심층 보스전`,
      cls: spec.cls,
      reward: { gold: 1800 + specIndex * 260, rune: 80 + specIndex * 12, dust: 70 + specIndex * 10, soul: Math.max(2, Math.floor(spec.minStage / 10)), bossMedal: 3 + Math.floor(specIndex / 2) },
      hp: 1.25 + specIndex * 0.025,
      atk: 1.18 + specIndex * 0.018,
      desc: `${spec.label} 전용 보스전입니다. ${spec.desc}`
    };
    spec.bosses.forEach(([icon, name, element, trait, hp, atk, mechanic], bossIndex) => {
      bosses.push({
        icon, name, element, trait,
        hp, atk,
        minStage: spec.minStage + bossIndex,
        rewardMult: 2.1 + specIndex * 0.08 + bossIndex * 0.5,
        mechanic,
        defaultArena: arenaKey,
        fieldKey: spec.key,
        isFinalBoss: bossIndex === 1
      });
    });
  });
}

addThemedSpecialDungeons();


function expandSpecialDungeonMonsterPools() {
  const mechanicFallback = {
    treasure: ['armor','fast','jackpot','treasureGuard','crit'],
    manaFlux: ['manaDrain','skillDisrupt','shield','magicBurst','cooldownUp'],
    spiritRisk: ['fear','drain','spiritRisk','curse','execution'],
    crystalArmor: ['armor','shield','reflect','defDown','voidForge'],
    runeSurge: ['runeSurge','cooldownUp','magicBurst','skillDisrupt','shield'],
    reflect: ['reflect','counter','armor','evasion','mirrorCopy'],
    noAutoHeal: ['curse','bleed','fearDot','minorSkillSeal','execution'],
    timePressure: ['timePressure','timeDelay','slow','cooldownUp','evolve'],
    jackpot: ['jackpot','ambush','crit','fast','treasureGuard'],
    streak: ['fast','charge','armor','crit','multiHit'],
    unstableBrew: ['unstableBrew','deathBomb','regen','poison','magicBurst'],
    stormChain: ['stormChain','shock','fast','magicBurst','multiHit'],
    gravityWell: ['gravityWell','slow','armor','bind','voidForge'],
    bloodDebt: ['bloodDebt','bleed','drain','crit','execution'],
    eclipseCycle: ['eclipseCycle','accuracyDown','buffPurge','magicBurst','curse'],
    overgrowth: ['overgrowth','regen','poison','armor','bind'],
    voidForge: ['voidForge','armor','shield','defDown','reflect'],
    dreamShift: ['dreamShift','evasion','skillDisrupt','accuracyDown','buffPurge'],
    barrierCity: ['curseResidue','minorSkillSeal','bleed','fearDot','barrierShield'],
    heatUp: ['burn','charge','heatUp','aoe','deathBomb'],
    wave: ['wave','bind','slow','multiHit','regen'],
    curse: ['curse','buffPurge','attackDown','minorSkillSeal','fearDot']
  };
  const iconSets = {
    treasure: ['🪙🦎','🏆🪨','💰👁️','⛏️🧌','👑🪙'], manaFlux: ['🔮🦋','💠🧙','🌌🪲','🧿⚡','🔷👻'],
    spiritRisk: ['👻🔥','🕯️💀','⚰️🪽','🪦🧙','🖤👑'], crystalArmor: ['💎🛡️','🔷🗿','🧊⚙️','💠🐢','🪨💎'],
    runeSurge: ['📕🔥','🔤👁️','🪄📜','📚🦉','🧿📘'], reflect: ['🪞🦊','💠🪞','👥🪞','🛡️✨','🪞👑'],
    noAutoHeal: ['☠️🕯️','🪦🦴','🧟📿','🖤💀','⚰️👑'], timePressure: ['⏳🪲','⏱️🤖','🕰️👁️','⌛♞','⏰🌀'],
    jackpot: ['🎰🦷','🎲👺','💰🪤','🃏🧌','🏦👑'], streak: ['🥊🐺','⚔️🛡️','🏟️👹','🔥🥷','🏆🦁'],
    unstableBrew: ['⚗️🧪','🧬🐀','🧫👁️','💉🧟','🧪🐉'], stormChain: ['🌩️🦅','⚡🧿','⛈️🗼','🔌👻','🌪️⚡'],
    gravityWell: ['🕳️🪐','🌌🪨','🧲👁️','⬛🐛','🪐🛡️'], bloodDebt: ['🩸🦇','🧛🕯️','🔴🗡️','🫀👁️','🩸👑'],
    eclipseCycle: ['🌘🧙','🌑🐺','🌗🎭','🌓🪽','🌒👑'], overgrowth: ['🌿🦎','🌺👁️','🌱🧌','🍄🛡️','🌳👑'],
    voidForge: ['⬛⚒️','⚙️🕳️','🛡️⬛','🔥⚙️','👑⚒️'], dreamShift: ['💤🦋','🎭🌀','🧸👁️','🌙🎪','👑💤'],
    barrierCity: ['⛩️👁️','📿🩸','🧵🎭','🕳️📜','👑⛩️']
  };
  const roles = [
    ['잔영', '일반', 0.92, 0.88], ['파수꾼', '일반', 1.05, 0.96], ['추적자', '일반', 0.98, 1.04],
    ['감시자', '정예', 1.32, 1.08], ['집행자', '정예', 1.45, 1.12]
  ];
  for (const [key, field] of Object.entries(fields)) {
    if (key === 'normal' || !Array.isArray(field.pool)) continue;
    const mechanics = mechanicFallback[field.mechanic] || mechanicFallback.curse;
    const icons = iconSets[field.mechanic] || ['👾','👹','🧿','🛡️','👑'];
    const additions = roles.map(([suffix, grade, hp, atk], i) => ({
      grade,
      icon: icons[i % icons.length],
      name: `${field.label} ${suffix}`,
      concept: `${field.label}의 특수 기운이 형체를 얻은 몬스터`,
      element: dungeonMechanicName(field.mechanic),
      trait: `${field.label} 전용 추가 몬스터입니다. ${dungeonMechanicName(mechanics[i % mechanics.length])} 패턴을 사용합니다.`,
      hp,
      atk,
      mechanic: mechanics[i % mechanics.length],
      generated: true
    }));
    const existing = new Set(field.pool.map(m => m.name));
    for (const monster of additions) {
      if (!existing.has(monster.name)) field.pool.push(monster);
    }
  }
}
expandSpecialDungeonMonsterPools();

function normalizeSpecialAttackScales() {
  for (const [key, field] of Object.entries(fields)) {
    if (key === 'normal') continue;
    field.atk = Math.min(Number(field.atk) || 1, field.mechanic === 'timePressure' || field.mechanic === 'bloodDebt' || field.mechanic === 'barrierCity' ? 1.20 : 1.28);
    if (Array.isArray(field.pool)) {
      field.pool.forEach(monster => {
        const cap = monster.grade === '정예' ? 1.22 : 1.15;
        monster.atk = Math.min(Number(monster.atk) || 1, cap);
      });
    }
  }
  for (const arena of Object.values(bossArenas)) {
    arena.atk = Math.min(Number(arena.atk) || 1, 1.45);
  }
}
normalizeSpecialAttackScales();


const bossDifficulties = {
  normal: { label:'일반', hp:0.88, atk:0.88, reward:1, medal:1, stage:0, desc:'기본 보스전입니다. 이전보다 조금 낮아진 입문 난이도입니다.' },
  elite: { label:'정예', hp:1.48, atk:1.18, reward:1.8, medal:3, stage:1, desc:'체력과 공격력이 오르지만 보상이 좋아집니다.' },
  nightmare: { label:'악몽', hp:2.65, atk:1.72, reward:3.4, medal:7, stage:2, desc:'위험하지만 보스 메달과 재화 보상이 크게 증가합니다.' },
  mythic: { label:'신화', hp:4.45, atk:2.45, reward:6, medal:15, stage:3, desc:'최상위 도전 난이도입니다. 각성·초월·한계돌파 성장이 필요합니다.' }
};
function currentBossDifficulty() { return bossDifficulties[state.bossDifficulty] || bossDifficulties.normal; }

function isBarrierCityBattle() {
  const boss = state?.boss ? (bosses[state.bossIndex] || {}) : null;
  return state?.field === 'barrierCity' || boss?.fieldKey === 'barrierCity' || boss?.defaultArena === 'barrierCityBoss';
}

function barrierCityDamageRatioCap(defaultRatio) {
  if (!isBarrierCityBattle()) return defaultRatio;
  // 결계도시의 봉인/출혈/연속타/영역 계열 피해는 체감상 폭증하기 쉬워 별도 상한을 둡니다.
  return state?.boss ? Math.min(defaultRatio, 0.060) : Math.min(defaultRatio, 0.018);
}


const bossTimeLimits = {
  short: { label:'60초', seconds:60, reward:1.45, medal:2, desc:'짧은 타임어택입니다. 강한 화력이 필요하지만 보상이 높습니다.' },
  normal: { label:'120초', seconds:120, reward:1.0, medal:1, desc:'기본 제한 시간입니다. 보스 패턴을 안정적으로 확인할 수 있습니다.' },
  long: { label:'180초', seconds:180, reward:0.75, medal:1, desc:'긴 제한 시간입니다. 보상은 낮지만 도전 안정성이 높습니다.' },
  extreme: { label:'30초', seconds:30, reward:2.25, medal:4, desc:'극한 타임어택입니다. 실패 위험이 매우 크지만 보상 배율이 큽니다.' }
};
function currentBossTimeLimit() { return bossTimeLimits[state.bossTimeLimit] || bossTimeLimits.normal; }

const skillCategories = [
  { key: 'impact', name: '파괴 코어', type: 'damage', role: '즉시 피해', resource: 'gold', names: ['코어 탄환', '압축 충격', '강화 포격', '관통 섬광', '폭열 광선', '연쇄 격파', '고압 포격', '섬멸 레이저', '붕괴 일격', '절대 파괴'] },
  { key: 'vital', name: '생명 회로', type: 'heal', role: '체력 회복', resource: 'dust', names: ['응급 처치', '생명 회복', '재생 파동', '치유 회로', '대회복', '정화 회복', '생명 증폭', '완전 회복', '불멸 회복', '신성 재생'] },
  { key: 'erosion', name: '침식 입자', type: 'dot', role: '지속 피해', resource: 'rune', names: ['열기 잔상', '독성 입자', '전류 잔류', '출혈 표식', '부식 안개', '서리 침식', '암흑 오염', '마력 연소', '영혼 침식', '종말 침식'] },
  { key: 'overdrive', name: '전술 증폭', type: 'buff', role: '공격 강화', resource: 'manaCrystal', names: ['집중 태세', '전투 가속', '마력 증폭', '치명 조준', '전투 본능', '코어 과열', '속도 돌파', '초집중', '전장 지배', '한계 돌파'] },
  { key: 'control', name: '제어 프로토콜', type: 'debuff', role: '적 약화', resource: 'rune', names: ['출력 저하', '둔화 신호', '방어 균열', '공격 저하', '마력 교란', '취약 표식', '무력화', '정신 붕괴', '저항 붕괴', '완전 약화'] },
  { key: 'barrier', name: '보호 장벽', type: 'shield', role: '피해 흡수', resource: 'dust', names: ['작은 실드', '마나 장벽', '방어막', '반응형 실드', '강화 장벽', '철벽 보호', '흡수 보호막', '절대 방어장', '수호 성역', '불멸 장벽'] },
  { key: 'drain', name: '흡수 장치', type: 'drain', role: '피해+회복', resource: 'soul', names: ['생명 흡수', '마력 흡수', '피의 계약', '영혼 흡입', '흡수 파동', '코어 드레인', '생체 변환', '심장 강탈', '어둠 포식', '생명 약탈'] },
  { key: 'mana', name: '마나 엔진', type: 'mana', role: '마나 회복', resource: 'manaCrystal', names: ['마나 회복', '마나 순환', '마력 충전', '정신 집중', '마나 샘', '마력 회로', '비전 충전', '마나 폭주', '무한 회로', '초월 마나'] },
  { key: 'blast', name: '범위 폭격', type: 'aoe', role: '광역 피해', resource: 'gold', names: ['작은 폭발', '충격파', '불꽃 범위', '냉기 폭풍', '번개 폭풍', '지진파', '에너지 소용돌이', '전장 폭격', '차원 붕괴', '대재앙'] },
  { key: 'scout', name: '탐사 보상', type: 'resource', role: '보상 증가', resource: 'gold', names: ['골드 보너스', '수정 탐색', '룬 수집', '가루 추출', '전리품 증가', '희귀 보상', '보물 감지', '행운 증폭', '재화 폭발', '황금 축복'] },
];

const skills = skillCategories.flatMap((cat, categoryIndex) => cat.names.map((name, tierIndex) => ({
  id: categoryIndex * 10 + tierIndex,
  categoryIndex,
  tierIndex,
  name,
  type: cat.type,
  categoryName: cat.name,
  role: cat.role,
  tier: tierIndex + 1,
  baseMana: Math.floor(12 + (tierIndex + 1) * 5 + categoryIndex * 2),
  basePower: (1.4 + (tierIndex + 1) * 0.38 + categoryIndex * 0.08) * (1 + (categoryIndex * 10 + tierIndex) / 70),
  description: describeSkill(cat.type, cat.role),
})));

const passiveSkills = [
  { name: '전투 감각', type: 'atk', desc: '모든 피해가 증가합니다.', cost: 'gold' },
  { name: '강인한 육체', type: 'hp', desc: '최대 체력이 증가합니다.', cost: 'dust' },
  { name: '마나 친화', type: 'mp', desc: '최대 마나가 증가합니다.', cost: 'manaCrystal' },
  { name: '행운의 손길', type: 'reward', desc: '모든 재화 획득량이 증가합니다.', cost: 'gold' },
  { name: '치명 본능', type: 'crit', desc: '치명타 확률이 증가합니다.', cost: 'rune' },
  { name: '재생 체질', type: 'regen', desc: '몬스터 처치 시 회복량이 증가합니다.', cost: 'dust' },
  { name: '마력 순환', type: 'mpRegen', desc: '자동 공격 시 마나 회복량이 증가합니다.', cost: 'manaCrystal' },
  { name: '영혼 공명', type: 'soulAtk', desc: '영혼석 보유량이 아니라 패시브 레벨 기준으로 피해 보너스가 증가합니다.', cost: 'soul' },
];

const rebirthTraits = [
  { name: '윤회의 힘', type: 'damage', desc: '모든 전투 피해가 영구 증가합니다. 초반 스테이지를 빠르게 밀고, 특수던전의 두꺼운 체력바를 안정적으로 깎는 핵심 특성입니다.' },
  { name: '영원한 생명', type: 'hp', desc: '최대 체력이 영구 증가합니다. 반사, 출혈, 즉사 카운트, 보스 광역기처럼 회피하기 어려운 기믹을 버티는 데 중요합니다.' },
  { name: '마력의 기억', type: 'mp', desc: '최대 마나가 영구 증가합니다. 고레벨 액티브 스킬, 자동 스킬, 자동 힐을 함께 운용할 때 마나 고갈을 완화합니다.' },
  { name: '축적된 전리품', type: 'reward', desc: '모든 전장의 재화 획득량이 영구 증가합니다. 골드, 마나수정, 룬조각, 유물가루, 영혼석 파밍 속도를 고르게 높입니다.' },
  { name: '전장의 기억', type: 'start', desc: '환생 후 시작 스테이지가 상승합니다. 반복 플레이에서 초반 구간을 건너뛰고 빠르게 중후반 성장 구간에 진입할 수 있습니다.' },
  { name: '숙련 계승', type: 'skill', desc: '스킬 레벨업 비용이 감소합니다. 다음 스킬 해금 조건인 고레벨 구간까지 도달하는 부담을 줄여주는 장기 성장 특성입니다.' },
  { name: '무기 각인', type: 'weapon', desc: '장착 무기의 공격 보정이 증가합니다. 무기고 강화와 곱해져 후반 피해 성장에 큰 영향을 줍니다.' },
  { name: '보스 사냥꾼', type: 'boss', desc: '보스에게 주는 피해가 영구 증가합니다. 제한 시간 보스전, 최종 보스, 특수던전 보스 공략에 특화된 특성입니다.' },
];

const REBIRTH_POINT_NAME = '윤회석';


const weapons = [
  { name: '훈련용 지팡이', icon: '🪄', cost: { gold: 0 }, atk: 0.04, crit: 0, speed: 0, hp: 0, mp: 0, reward: 0, desc: '기본 지급 장비입니다.' },
  { name: '청동 단검', icon: '🗡️', cost: { gold: 120 }, atk: 0.10, crit: 2, speed: 0, hp: 0, mp: 0, reward: 0, desc: '초반 공격력과 치명타를 보완합니다.' },
  { name: '마나 완드', icon: '🪄', cost: { gold: 260, manaCrystal: 25 }, atk: 0.08, crit: 0, speed: 0, hp: 0, mp: 35, reward: 0, desc: '최대 마나를 늘립니다.' },
  { name: '수호 방패검', icon: '🛡️', cost: { gold: 420, dust: 40 }, atk: 0.07, crit: 0, speed: 0, hp: 70, mp: 0, reward: 0, desc: '체력을 크게 올립니다.' },
  { name: '룬 블레이드', icon: '⚔️', cost: { gold: 850, rune: 35 }, atk: 0.18, crit: 5, speed: 0, hp: 0, mp: 0, reward: 0, desc: '치명 공격형 무기입니다.' },
  { name: '황금 해머', icon: '🔨', cost: { gold: 1200, dust: 80 }, atk: 0.12, crit: 0, speed: 0, hp: 40, mp: 0, reward: 0.18, desc: '전리품 획득량을 높입니다.' },
  { name: '기계식 석궁', icon: '🏹', cost: { gold: 1800, manaCrystal: 80 }, atk: 0.16, crit: 3, speed: 1, hp: 0, mp: 0, reward: 0, desc: '자동 전투 효율을 올립니다.' },
  { name: '흡혈 낫', icon: '🪓', cost: { gold: 2400, soul: 8 }, atk: 0.22, crit: 4, speed: 0, hp: 60, mp: 0, reward: 0, desc: '고위험 전장 대응 무기입니다.' },
  { name: '별빛 총검', icon: '🔫', cost: { gold: 4200, rune: 90, manaCrystal: 100 }, atk: 0.32, crit: 8, speed: 1, hp: 0, mp: 40, reward: 0, desc: '후반 공격형 장비입니다.' },
  { name: '천년 유물검', icon: '🗡️', cost: { gold: 9000, soul: 25, dust: 160, rune: 120 }, atk: 0.55, crit: 12, speed: 2, hp: 120, mp: 80, reward: 0.15, desc: '최상위 무기입니다.' },
];

let state;
let attackTimer;
let enemyTimer;
let skillCooldownTimer;
let autoOn = true;
let skillMode = 'loadout';
let currentSkillCategory = 0;
let weaponFilter = 'all';
const SKILL_NEXT_UNLOCK_LEVEL = 50;
const BULK_LEVEL_BUTTONS = [1, 10, 50, 100];

function defaultState() {
  return {
    gold: 0,
    manaCrystal: 20,
    soul: 0,
    dust: 20,
    rune: 20,
    bossMedal: 0,
    testRewardUsed: false,
    stage: 1,
    stageWave: 1,
    field: 'normal',
    coreLv: 1,
    power: 9,
    speed: 1,
    crit: 8,
    defense: 14,
    defenseLv: 1,
    defenseMultLv: 0,
    grade: 0,
    maxHp: 250,
    hp: 250,
    maxMp: 80,
    mp: 80,
    hpLv: 1,
    mpLv: 1,
    powerMultLv: 0,
    hpMultLv: 0,
    awakeningLv: 0,
    transcendLv: 0,
    limitBreakLv: 0,
    rebirthCount: 0,
    rebirthPoints: 0,
    rebirthTraitLevels: Array(rebirthTraits.length).fill(0),
    bestStage: 1,
    highestRebirthGain: 0,
    enemyHp: 100,
    enemyMaxHp: 100,
    enemyBarHp: 100,
    enemyBarCount: 1,
    enemyRawMaxHp: 100,
    enemyAtk: 8,
    enemyDefeatedPending: false,
    resolvingEnemyDefeat: false,
    enemySpawnSeq: 0,
    lastEnemyName: '',
    boss: false,
    bossArena: 'meadowBoss',
    bossIndex: 0,
    bossDifficulty: 'normal',
    bossTimeLimit: 'normal',
    bossTimeLeft: 0,
    bossPhase: 1,
    bossAttempts: 0,
    bossWins: 0,
    bossFails: 0,
    dungeonStreak: 0,
    dungeonTimer: 0,
    fieldMissionProgress: {},
    fieldMissionCompletions: {},
    summonPressure: 0,
    specialAtkRamp: 0,
    skillSealTicks: 0,
    kills: 0,
    debuff: 0,
    dotTicks: 0,
    dotDamage: 0,
    buffTicks: 0,
    buffPower: 1,
    shield: 0,
    rewardBoost: 1,
    reflectLockUntil: 0,
    skillLevels: Array(100).fill(0),
    categoryLevels: Array(skillCategories.length).fill(0),
    skillSlots: [0, 10, 70],
    skillCooldowns: [0, 0, 0],
    autoSkillEnabled: false,
    autoSkillCursor: 0,
    passiveLevels: Array(passiveSkills.length).fill(0),
    autoHealLevel: 0,
    autoHealEnabled: true,
    autoHealCooldown: 0,
    weaponOwned: Array(weapons.length).fill(false).map((_, i) => i === 0),
    weaponLevels: Array(weapons.length).fill(1),
    equippedWeapon: 0,
  };
}

function loadGame() {
  try {
    state = JSON.parse(localStorage.getItem('artifactCoreRpgFullRemake') || localStorage.getItem('artifactCoreRpgFull') || '');
  } catch {
    state = null;
  }
  if (!state) state = defaultState();
  const base = defaultState();
  for (const key in base) if (state[key] === undefined) state[key] = base[key];
  normalizeArrays(base);
  migrateOldSkillData();
  if (!state.boss) syncBossSelectionForCurrentField();
  state.hp = Math.min(state.hp || state.maxHp, getMaxHp());
  state.mp = Math.min(state.mp || state.maxMp, getMaxMp());
  spawnEnemy();
  renderAll();
  startLoops();
  log('환생 리메이크 버전을 시작했습니다. 윤회석과 영구 특성이 추가되었습니다.', 'good');
}

function normalizeArrays(base) {
  if (!Array.isArray(state.skillLevels) || state.skillLevels.length !== 100) state.skillLevels = base.skillLevels;
  if (!Array.isArray(state.categoryLevels) || state.categoryLevels.length !== skillCategories.length) state.categoryLevels = base.categoryLevels;
  if (!Array.isArray(state.skillSlots) || state.skillSlots.length !== 3) state.skillSlots = base.skillSlots;
  if (!Array.isArray(state.skillCooldowns) || state.skillCooldowns.length !== 3) state.skillCooldowns = base.skillCooldowns;
  if (!Array.isArray(state.passiveLevels) || state.passiveLevels.length !== passiveSkills.length) state.passiveLevels = base.passiveLevels;
  if (!Array.isArray(state.rebirthTraitLevels) || state.rebirthTraitLevels.length !== rebirthTraits.length) state.rebirthTraitLevels = base.rebirthTraitLevels;
  state.rebirthPoints = Number.isFinite(Number(state.rebirthPoints)) ? Math.max(0, Number(state.rebirthPoints)) : 0;
  state.rebirthCount = Number.isFinite(Number(state.rebirthCount)) ? Math.max(0, Number(state.rebirthCount)) : 0;
  state.bestStage = Math.max(Number(state.bestStage) || 1, Number(state.stage) || 1);
  state.highestRebirthGain = Number.isFinite(Number(state.highestRebirthGain)) ? Math.max(0, Number(state.highestRebirthGain)) : 0;
  if (!Array.isArray(state.weaponOwned) || state.weaponOwned.length !== weapons.length) state.weaponOwned = base.weaponOwned;
  if (!Array.isArray(state.weaponLevels) || state.weaponLevels.length !== weapons.length) state.weaponLevels = base.weaponLevels;
  state.weaponOwned[0] = true;
  if (!bossArenas[state.bossArena]) state.bossArena = 'meadowBoss';
  if (!bossDifficulties[state.bossDifficulty]) state.bossDifficulty = 'normal';
  if (!bossTimeLimits[state.bossTimeLimit]) state.bossTimeLimit = 'normal';
  if (!Number.isFinite(state.bossTimeLeft)) state.bossTimeLeft = 0;
  if (!fields[state.field]) state.field = 'normal';
  if (!state.fieldMissionProgress || typeof state.fieldMissionProgress !== 'object') state.fieldMissionProgress = {};
  if (!state.fieldMissionCompletions || typeof state.fieldMissionCompletions !== 'object') state.fieldMissionCompletions = {};
  state.awakeningLv = Number.isFinite(Number(state.awakeningLv)) ? Math.max(0, Number(state.awakeningLv)) : 0;
  state.transcendLv = Number.isFinite(Number(state.transcendLv)) ? Math.max(0, Number(state.transcendLv)) : 0;
  state.limitBreakLv = Number.isFinite(Number(state.limitBreakLv)) ? Math.max(0, Number(state.limitBreakLv)) : 0;
}


function migrateOldSkillData() {
  // 이전 버전의 선형 해금 구조가 있더라도 각 분야 첫 스킬은 바로 사용할 수 있게 보정합니다.
  for (let i = 0; i < skillCategories.length; i++) {
    const firstSkillId = i * 10;
    if (!state.skillLevels[firstSkillId]) state.skillLevels[firstSkillId] = 1;
  }
  repairSkillState();
}

function repairSkillState() {
  // 스킬 관련 저장 데이터가 꼬여도 스킬 버튼이 멈추지 않도록 복구합니다.
  state.skillLevels = Array.from({ length: 100 }, (_, i) => Number.isFinite(Number(state.skillLevels[i])) ? Math.max(0, Number(state.skillLevels[i])) : 0);
  state.categoryLevels = Array.from({ length: skillCategories.length }, (_, i) => Number.isFinite(Number(state.categoryLevels[i])) ? Math.max(0, Number(state.categoryLevels[i])) : 0);
  state.skillCooldowns = Array.from({ length: 3 }, (_, i) => Number.isFinite(Number(state.skillCooldowns[i])) ? Math.max(0, Number(state.skillCooldowns[i])) : 0);

  for (let i = 0; i < skillCategories.length; i++) {
    const firstSkillId = i * 10;
    if (state.skillLevels[firstSkillId] < 1) state.skillLevels[firstSkillId] = 1;
  }
  for (const skill of skills) {
    if (isSkillUnlockedByLevel(skill.id) && state.skillLevels[skill.id] < 1) state.skillLevels[skill.id] = 1;
  }

  const fallbackSlots = [0, 10, 70];
  state.skillSlots = Array.from({ length: 3 }, (_, i) => {
    const id = Number(state.skillSlots[i]);
    return skills[id] && isSkillUnlockedByLevel(id) ? id : fallbackSlots[i];
  });
}

function isSkillUnlockedByLevel(skillId) {
  const skill = skills[skillId];
  if (!skill) return false;
  if (skill.tierIndex === 0) return true;
  const prevId = skillId - 1;
  return skillLevel(prevId) >= SKILL_NEXT_UNLOCK_LEVEL;
}

function saveGame() {
  localStorage.setItem('artifactCoreRpgFullRemake', JSON.stringify(state));
}

function fmt(n) {
  n = Number(n || 0);
  if (!Number.isFinite(n)) return '무한';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs < 10000) return sign + Math.floor(abs).toLocaleString('ko-KR');

  // 10,000 단위 한국식 숫자 표기: 만 → 억 → 조 → 경 → 해 → 자 → 양 → 구 → 간 → 정 → 재 → 극
  const units = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항하사', '아승기', '나유타', '불가사의', '무량대수'];
  let group = Math.floor(Math.log(abs) / Math.log(10000));
  group = Math.max(1, Math.min(group, units.length - 1));
  const scaled = abs / Math.pow(10000, group);
  const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return sign + scaled.toFixed(decimals).replace(/\.0+$|(?<=\.\d)0+$/g, '') + units[group];
}

function resourceName(key) {
  return { gold: '골드', manaCrystal: '마나수정', soul: '영혼석', dust: '유물가루', rune: '룬조각', bossMedal: '보스메달' }[key] || key;
}

function grade() { return grades[state.grade] || grades[0]; }
function equippedWeapon() { return weapons[state.equippedWeapon] || weapons[0]; }
function weaponLevel(i = state.equippedWeapon) { return state.weaponLevels[i] || 1; }
function weaponScale(i = state.equippedWeapon) { return 1 + (weaponLevel(i) - 1) * 0.12; }
function weaponAtkBonus() { return equippedWeapon().atk * weaponScale() * (1 + rebirthWeaponBonus()); }
function weaponCritBonus() { return Math.floor(equippedWeapon().crit * weaponScale()); }
function weaponSpeedBonus() { return Math.floor(equippedWeapon().speed * weaponScale()); }
function weaponRewardBonus() { return equippedWeapon().reward * weaponScale(); }
function weaponDefenseBonus() { return Math.floor((equippedWeapon().def || 0) * weaponScale()); }
function defenseMultiplier() { return 1 + (state.defenseMultLv || 0) * 0.07 + awakeningLv() * 0.015 + limitBreakLv() * 0.02; }
function getDefense() {
  const flat = Math.max(0, (state.defense || 0) + weaponDefenseBonus());
  return Math.floor(flat * defenseMultiplier());
}
function defenseReductionRate() {
  const defense = getDefense();
  return Math.min(0.78, defense / (defense + 420));
}
function reduceIncomingDamageByDefense(rawDamage) {
  let damage = Math.max(1, Math.floor(rawDamage || 0));
  const defense = getDefense();
  if (defense <= 0) return damage;
  const reduced = Math.floor(damage * (1 - defenseReductionRate()) - defense * 0.18);
  return Math.max(1, reduced);
}
function passiveLevel(type) { return passiveSkills.reduce((sum, p, i) => sum + (p.type === type ? (state.passiveLevels[i] || 0) : 0), 0); }
function passiveAtkBonus() {
  // 피해량은 보유 재화량으로 오르지 않습니다.
  // 영혼 공명도 '보유 영혼석 수'가 아니라 사용자가 올린 패시브 레벨만 반영합니다.
  return passiveLevel('atk') * 0.03 + passiveLevel('soulAtk') * 0.04;
}
function passiveRewardBonus() { return passiveLevel('reward') * 0.025 + awakeningLv() * 0.012 + transcendLv() * 0.018; }
function passiveCritBonus() { return passiveLevel('crit') + limitBreakLv() * 1.5; }
function passiveRegenBonus() { return passiveLevel('regen') * 0.01; }
function passiveMpRegenBonus() { return passiveLevel('mpRegen') + Math.floor(transcendLv() / 3); }
function rebirthTraitLevel(type) { return rebirthTraits.reduce((sum, trait, i) => sum + (trait.type === type ? (state.rebirthTraitLevels[i] || 0) : 0), 0); }
function rebirthDamageBonus() { return 1 + rebirthTraitLevel('damage') * 0.06; }
function rebirthHpBonus() { return 1 + rebirthTraitLevel('hp') * 0.07; }
function rebirthMpBonus() { return 1 + rebirthTraitLevel('mp') * 0.05; }
function rebirthRewardBonus() { return rebirthTraitLevel('reward') * 0.05; }
function rebirthStartStageBonus() { return rebirthTraitLevel('start'); }
function rebirthSkillDiscount() { return Math.min(0.45, rebirthTraitLevel('skill') * 0.04); }
function rebirthWeaponBonus() { return rebirthTraitLevel('weapon') * 0.04; }
function rebirthBossDamageBonus() { return state.boss ? 1 + rebirthTraitLevel('boss') * 0.08 : 1; }
function awakeningLv() { return Math.max(0, state.awakeningLv || 0); }
function transcendLv() { return Math.max(0, state.transcendLv || 0); }
function limitBreakLv() { return Math.max(0, state.limitBreakLv || 0); }
function awakeningBonus() { return 1 + awakeningLv() * 0.045 + Math.floor(awakeningLv() / 10) * 0.04; }
function transcendBonus() { return 1 + transcendLv() * 0.055 + Math.floor(transcendLv() / 10) * 0.05; }
function limitBreakBonus() { return 1 + limitBreakLv() * 0.075 + Math.floor(limitBreakLv() / 5) * 0.06; }
function transcendSkillBonus() { return 1 + transcendLv() * 0.045 + Math.floor(transcendLv() / 10) * 0.04; }
function limitBossBonus() { return state.boss ? 1 + limitBreakLv() * 0.10 + Math.floor(limitBreakLv() / 5) * 0.08 : 1; }
function powerMultiplier() { return (1 + (state.powerMultLv || 0) * 0.08) * awakeningBonus() * transcendBonus() * limitBreakBonus(); }
function hpMultiplier() { return (1 + (state.hpMultLv || 0) * 0.08) * (1 + awakeningLv() * 0.04) * (1 + transcendLv() * 0.055) * (1 + limitBreakLv() * 0.08); }
function categoryPowerBonus(categoryIndex) { return 1 + (state.categoryLevels[categoryIndex] || 0) * 0.06; }
function getMaxHp() {
  const flat = state.maxHp + Math.floor(equippedWeapon().hp * weaponScale()) + passiveLevel('hp') * 20;
  return Math.floor(flat * hpMultiplier() * rebirthHpBonus());
}
function getMaxMp() { return Math.floor((state.maxMp + Math.floor(equippedWeapon().mp * weaponScale()) + passiveLevel('mp') * 14) * (1 + transcendLv() * 0.07) * rebirthMpBonus()); }
function baseDamage() {
  const flat = state.power + state.coreLv * 3 + state.soul * 2;
  return Math.floor(flat * powerMultiplier() * grade().mult * (1 + weaponAtkBonus() + passiveAtkBonus()) * rebirthDamageBonus() * rebirthBossDamageBonus() * limitBossBonus());
}
function attackInterval() { return Math.max(160, 920 - (state.speed + weaponSpeedBonus()) * 55); }
function dps() { return Math.floor(baseDamage() * 1000 / attackInterval()); }
function skillLevel(id) { return state.skillLevels[id] || 0; }

function skillManaCost(skill, level) {
  // 고레벨 스킬이 최대 마나를 초과해 사실상 사용 불가능해지는 문제를 방지합니다.
  // 기본 비용은 유지하되, 현재 최대 마나의 82%를 넘지 않도록 완만하게 제한합니다.
  const raw = Math.floor(skill.baseMana * (1 + level * 0.028));
  if (!state || !state.maxMp) return raw;
  const cap = Math.max(18, Math.floor(getMaxMp() * 0.82));
  return Math.max(8, Math.min(raw, cap));
}
function skillPower(skill, level) { return skill.basePower * (1 + level * 0.18 + Math.pow(level, 1.1) * 0.03) * categoryPowerBonus(skill.categoryIndex) * transcendSkillBonus(); }

function currentField() { return fields[state.field] || fields.normal; }
function currentBossArena() {
  const boss = currentBoss();
  return bossArenas[boss.defaultArena] || bossArenas.meadowBoss;
}
function currentBoss() { return bosses[state.bossIndex] || bosses[0]; }
function bossIndexForField(fieldKey) { return bosses.findIndex(boss => boss.fieldKey === fieldKey); }
function isSpecialField(fieldKey = state.field) { return fieldKey !== 'normal' && !!fields[fieldKey]; }
function availableBossEntriesForCurrentField() {
  return bosses
    .map((boss, index) => ({ boss, index }))
    .filter(({ boss }) => state.field === 'normal' ? !boss.fieldKey : boss.fieldKey === state.field);
}
function ensureBossMatchesCurrentField() {
  const available = availableBossEntriesForCurrentField();
  if (!available.length) {
    state.bossIndex = normalBossIndexForStage();
    return;
  }
  const current = bosses[state.bossIndex];
  const valid = current && (state.field === 'normal' ? !current.fieldKey : current.fieldKey === state.field);
  if (!valid) state.bossIndex = available[0].index;
  const boss = bosses[state.bossIndex] || available[0].boss;
  if (boss.defaultArena && bossArenas[boss.defaultArena]) state.bossArena = boss.defaultArena;
}
function normalBossIndexForStage() {
  const regionalBossCount = 10;
  return Math.max(0, Math.min(regionalBossCount - 1, Math.floor((state.stage - 1) / 5)));
}
function syncBossSelectionForCurrentField() {
  // 보스 목록은 현재 전장에 맞춰 완전히 분리합니다.
  // 일반 전장에서는 지역 보스만, 특별 전장에서는 해당 특별 전장 전용 보스만 선택/도전할 수 있습니다.
  ensureBossMatchesCurrentField();
}


function stableHashText(text) {
  let hash = 0;
  const source = String(text || '');
  for (let i = 0; i < source.length; i++) hash = ((hash << 5) - hash + source.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function selectSpecialFieldMonster(field) {
  const pool = Array.isArray(field?.pool) ? field.pool : [];
  if (!pool.length) return { icon:'❔', name:'알 수 없는 몬스터', trait:'전장 데이터가 비어 있습니다.', hp:1, atk:1, grade:'일반' };
  if (pool.length === 1) return pool[0];

  // 기존에는 (kills + stage + enemySpawnSeq) % pool.length 방식이라
  // pool 길이가 4인 신규 던전에서 0→2→0→2처럼 일부 몬스터만 반복되는 문제가 있었습니다.
  // 이제는 전장별 독립 로테이션을 사용하고, 직전/최근 몬스터를 피해서 더 다양한 몬스터가 등장합니다.
  const fieldKey = state.field || 'normal';
  if (!state.fieldSpawnSeq) state.fieldSpawnSeq = {};
  if (!state.fieldRecentEnemies) state.fieldRecentEnemies = {};

  const seq = state.fieldSpawnSeq[fieldKey] || 0;
  const cycle = Math.floor(seq / pool.length);
  const offset = stableHashText(`${fieldKey}:${state.stage || 1}:${cycle}`) % pool.length;
  const recent = state.fieldRecentEnemies[fieldKey] || [];

  let index = (seq + offset) % pool.length;
  for (let tries = 0; tries < pool.length; tries++) {
    const candidate = pool[index];
    const repeatedLast = candidate?.name === state.lastEnemyName;
    const repeatedRecent = pool.length >= 4 && recent.includes(candidate?.name);
    if (!repeatedLast && !repeatedRecent) break;
    index = (index + 1) % pool.length;
  }

  const selected = pool[index];
  state.fieldSpawnSeq[fieldKey] = seq + 1;
  const nextRecent = [selected?.name, ...recent.filter(name => name !== selected?.name)].filter(Boolean);
  state.fieldRecentEnemies[fieldKey] = nextRecent.slice(0, Math.min(3, Math.max(1, pool.length - 1)));
  return selected;
}

function resetFieldRotation(fieldKey) {
  if (!state.fieldRecentEnemies) state.fieldRecentEnemies = {};
  state.fieldRecentEnemies[fieldKey] = [];
}

function dungeonAtkBonus() {
  // 플레이어 공격력 증가 효과 삭제: 어떤 전장 기믹도 공격력 배율을 누적시키지 않습니다.
  return 1;
}
function dungeonRewardBonus() {
  const mechanic = currentField().mechanic;
  if (mechanic === 'streak') return 1 + (state.dungeonStreak || 0) * 0.12;
  if (mechanic === 'jackpot') return 1 + Math.floor(Math.random() * 6);
  return 1;
}
function isAutoHealBlocked() { return (!state.boss && currentField().mechanic === 'noAutoHeal') || (state.boss && currentBoss().mechanic === 'noAutoHeal'); }

function isSkillUnlocked(skillId) {
  return isSkillUnlockedByLevel(skillId);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function enemyBarTargetHits(enemy, isBoss) {
  // 한 줄 체력은 현재 평균 피해량을 기준으로 잡습니다.
  // 초반 몬스터가 죽지 않는 문제를 막기 위해 일반 전장 1~3웨이브는 매우 낮게 시작합니다.
  if (isBoss) {
    const diff = state.bossDifficulty || 'normal';
    if (diff === 'mythic') return 68;
    if (diff === 'nightmare') return 52;
    if (diff === 'elite') return 38;
    return 30;
  }
  if (state.field === 'normal') {
    const wave = normalStageWave();
    const stage = Math.max(1, state.stage || 1);
    const elite = enemy?.grade === '정예';
    const baseHits = elite ? 5.5 : 3.2;
    const waveGrowth = (wave - 1) * 0.34;
    const stageGrowth = Math.max(0, stage - 1) * 0.18;
    return Math.max(2, Math.ceil(baseHits + waveGrowth + stageGrowth));
  }
  if (enemy?.grade === '정예') return 10;
  if (enemy?.mechanic === 'armor' || enemy?.mechanic === 'regen' || enemy?.mechanic === 'shield') return 9;
  return 7;
}

function enemyBarLimits(enemy, isBoss) {
  if (isBoss) {
    const diff = state.bossDifficulty || 'normal';
    if (diff === 'mythic') return { min: 170, max: 900 };
    if (diff === 'nightmare') return { min: 118, max: 680 };
    if (diff === 'elite') return { min: 76, max: 450 };
    return { min: 48, max: 320 };
  }
  if (state.field === 'normal') {
    const wave = normalStageWave();
    const stage = Math.max(1, state.stage || 1);
    const elite = enemy?.grade === '정예';
    const min = elite ? 2 : 1;
    const max = Math.floor(6 + wave * 1.2 + Math.max(0, stage - 1) * 1.4 + (elite ? 6 : 0));
    return { min, max: Math.max(min, max) };
  }
  if (enemy?.grade === '정예') return { min: 4, max: 75 };
  return { min: 2, max: 46 };
}

function expectedPlayerBurstDamage() {
  // 현재 피해량 기준 밸런스: 기본 공격뿐 아니라 장착 스킬 3개 중 가장 강한 피해 잠재력도 고려합니다.
  let estimate = Math.max(10, baseDamage());
  if (Array.isArray(state.skillSlots)) {
    for (const skillId of state.skillSlots) {
      const skill = skills[skillId];
      if (!skill) continue;
      const level = Math.max(1, state.skillLevels?.[skillId] || 1);
      const power = skillPower(skill, level);
      if (['damage', 'aoe', 'drain'].includes(skill.type)) estimate = Math.max(estimate, baseDamage() * power * 0.65);
    }
  }
  return Math.max(10, Math.floor(estimate));
}

function applyScaledEnemyHp(rawMaxHp, enemy, isBoss) {
  const stage = Math.max(1, state.stage || 1);
  const wave = normalStageWave ? normalStageWave() : 1;
  const rawHp = Math.max(1, Math.floor(rawMaxHp));
  let barHp;
  let barCount;

  if (isBoss) {
    // 보스는 여전히 큰 체력바 여러 줄을 사용하지만, 실제 체력은 보스 공식으로만 결정합니다.
    // 플레이어 피해량이 올라갔다고 보스 체력이 즉시 같이 커지는 구조는 제거했습니다.
    const diff = state.bossDifficulty || 'normal';
    const divisor = diff === 'mythic' ? 95 : diff === 'nightmare' ? 72 : diff === 'elite' ? 54 : 38;
    barCount = clamp(Math.ceil(rawHp / Math.max(1, divisor * stage)), 12, diff === 'mythic' ? 260 : diff === 'nightmare' ? 190 : diff === 'elite' ? 130 : 90);
    barHp = Math.max(1, Math.ceil(rawHp / barCount));
  } else if (state.field === 'normal') {
    // 기본 스테이지 몬스터 체력은 피해량과 무관하게 스테이지/웨이브/등급으로만 증가합니다.
    // 한 스테이지 안에서는 뒤 웨이브일수록, 스테이지가 높을수록 체력바가 촘촘히 늘어납니다.
    const eliteBonus = enemy?.grade === '정예' ? 1.45 : 1;
    barHp = Math.max(18, Math.floor((26 + stage * 9 + wave * 4) * eliteBonus));
    barCount = Math.max(1, Math.ceil(rawHp / barHp));
  } else {
    // 특별 전장 일반 몬스터도 플레이어 피해량에 비례하지 않고 전장/스테이지 공식으로만 체력이 정해집니다.
    const eliteBonus = enemy?.grade === '정예' ? 1.35 : 1;
    barHp = Math.max(60, Math.floor((95 + stage * 22) * eliteBonus));
    barCount = Math.max(1, Math.ceil(rawHp / barHp));
  }

  state.enemyRawMaxHp = rawHp;
  state.enemyBarHp = barHp;
  state.enemyBarCount = barCount;
  state.enemyMaxHp = rawHp;
  state.enemyHp = rawHp;
  state.enemyDefeatedPending = false;
  state.resolvingEnemyDefeat = false;
}

function ensureEnemyHpNumber() {
  if (!Number.isFinite(state.enemyHp) || state.enemyHp < 0) state.enemyHp = Math.max(0, Number(state.enemyHp) || 0);
  if (!Number.isFinite(state.enemyMaxHp) || state.enemyMaxHp <= 0) state.enemyMaxHp = Math.max(1, state.enemyBarHp || 1);
  if (!Number.isFinite(state.enemyBarHp) || state.enemyBarHp <= 0) state.enemyBarHp = Math.max(1, Math.floor(state.enemyMaxHp / Math.max(1, state.enemyBarCount || 1)));
  if (!Number.isFinite(state.enemyBarCount) || state.enemyBarCount <= 0) state.enemyBarCount = Math.max(1, Math.ceil(state.enemyMaxHp / state.enemyBarHp));
}


function shouldTriggerEnemyInvincible() {
  if (!state || state.enemyHp <= 0 || state.enemyDefeatedPending) return false;
  if ((state.enemyInvincibleCooldown || 0) > 0) {
    state.enemyInvincibleCooldown--;
    return false;
  }
  const enemy = state.enemy || {};
  const mechanic = state.boss ? currentBoss().mechanic : (enemy.mechanic || currentField().mechanic);
  const specialBonus = state.field !== 'normal' ? 0.012 : 0;
  const eliteBonus = enemy.grade === '정예' ? 0.01 : 0;
  const mechanicBonus = ['shield','barrierShield','voidForge','mirror','reflect','evasion','armor'].includes(mechanic) ? 0.018 : 0;
  const bossBonus = state.boss ? 0.018 : 0;
  const chance = Math.min(0.075, 0.018 + specialBonus + eliteBonus + mechanicBonus + bossBonus);
  if (Math.random() < chance) {
    const elite = enemy.grade === '정예';
    state.enemyInvincibleHits = state.boss ? 18 : (elite ? 11 : 8);
    state.enemyInvincibleCooldown = state.boss ? 22 : (elite ? 16 : 12);
    createSkillFx('shield');
    createFloat(`무적 발동 x${state.enemyInvincibleHits}`, 'mtext');
    return true;
  }
  return false;
}

function dealEnemyDamage(amount, label = '') {
  ensureEnemyHpNumber();
  const safeDamage = Math.max(0, Math.floor(Number(amount) || 0));
  if (safeDamage <= 0 || state.resolvingEnemyDefeat) return 0;
  if ((state.enemyInvincibleHits || 0) > 0) {
    state.enemyInvincibleHits--;
    createFloat('무적', 'mtext');
    return 0;
  }
  if (shouldTriggerEnemyInvincible()) return 0;
  state.enemyHp = Math.max(0, state.enemyHp - safeDamage);
  if (state.enemyHp <= 0) state.enemyDefeatedPending = true;
  return safeDamage;
}

function resolveEnemyDefeat() {
  ensureEnemyHpNumber();
  if (state.resolvingEnemyDefeat) return false;
  if (!state.enemyDefeatedPending && state.enemyHp > 0) return false;
  state.enemyHp = 0;
  state.enemyDefeatedPending = false;
  killEnemy();
  return true;
}

function currentEnemyBar() {
  if (!state.enemyBarHp || !state.enemyBarCount || state.enemyHp <= 0) return 0;
  return clamp(Math.ceil(state.enemyHp / state.enemyBarHp), 0, state.enemyBarCount);
}

function currentEnemyBarHp() {
  if (!state.enemyBarHp || state.enemyHp <= 0) return 0;
  const bar = currentEnemyBar();
  if (bar <= 0) return 0;
  const prevBarsHp = (bar - 1) * state.enemyBarHp;
  return clamp(state.enemyHp - prevBarsHp, 0, state.enemyBarHp);
}

function normalStageHpMultiplier(enemy) {
  if (state.field !== 'normal' || state.boss) return 1;
  const wave = normalStageWave();
  const stage = Math.max(1, state.stage || 1);
  // 같은 스테이지 안에서는 뒤로 갈수록 강해지고, 스테이지가 오르면 체력이 증가합니다.
  // 단, 1스테이지 초반은 빠르게 처치되도록 낮은 배율에서 시작합니다.
  const waveScale = (stage <= 10 ? 0.14 : stage <= 20 ? 0.29 : 0.38) + (wave - 1) * 0.045;
  const stageScale = 1 + Math.max(0, stage - 1) * 0.10;
  const eliteScale = enemy?.grade === '정예' ? 1.18 : 1;
  return waveScale * stageScale * eliteScale;
}

function normalStageAtkMultiplier() {
  if (state.field !== 'normal' || state.boss) return 1;
  const wave = normalStageWave();
  return 0.78 + (wave - 1) * 0.028;
}

function advanceNormalStage() {
  if (state.field !== 'normal') return;
  state.stageWave = normalStageWave() + 1;
  if (state.stageWave > stageWaveCap()) {
    state.stageWave = 1;
    state.stage += 1;
    log(`스테이지 ${state.stage} 진입! 몬스터 체력과 등장 지역이 강화됩니다.`, 'good');
  }
}


function fieldUnlockStage(field) { return Math.max(1, field.minStage || 1); }
function specialFieldTier(fieldKey = state.field) {
  if (fieldKey === 'normal') return 0;
  const field = fields[fieldKey] || fields.normal;
  return Math.max(1, Math.ceil(fieldUnlockStage(field) / 4));
}
function specialFieldProgressScale(fieldKey = state.field) {
  if (fieldKey === 'normal') return 1;
  const field = fields[fieldKey] || fields.normal;
  const overStage = Math.max(0, (state.stage || 1) - fieldUnlockStage(field));
  const dungeonTier = specialFieldTier(fieldKey);
  // 특수 전장은 일반 스테이지와 달리 "입장 기준 + 던전 등급 + 현재 진행도"로 체력이 오른다.
  // 플레이어 피해량에 비례하지 않기 때문에 강해져도 체력 공식이 갑자기 튀지 않는다.
  return 1 + dungeonTier * 0.16 + Math.floor(overStage / 5) * 0.18;
}
function specialMonsterGradeScale(enemy) {
  const grade = enemy?.grade || '일반';
  if (grade === '보스') return 3.4;
  if (grade === '정예') return 1.9;
  return 1;
}
function specialMechanicHpScale(mechanic) {
  return {
    treasure: 1.25, manaFlux: 1.05, spiritRisk: 1.12, crystalArmor: 1.35, runeSurge: 1.10,
    reflect: 1.18, noAutoHeal: 1.05, timePressure: 0.95, jackpot: 0.85, streak: 1.08,
    unstableBrew: 0.95, stormChain: 0.90, gravityWell: 1.30, bloodDebt: 1.02, eclipseCycle: 1.08,
    overgrowth: 1.42, voidForge: 1.50, dreamShift: 0.92, barrierCity: 1.55
  }[mechanic] || 1;
}
function specialFieldMonsterHpBase(field, enemy, stage) {
  const unlock = fieldUnlockStage(field);
  const tier = specialFieldTier(state.field);
  const localStage = Math.max(1, stage - unlock + 1);
  const base = 90 + tier * 55 + Math.pow(localStage, 1.28) * 34 + stage * 10;
  return Math.floor(base * specialFieldProgressScale(state.field) * specialMonsterGradeScale(enemy) * specialMechanicHpScale(field.mechanic));
}


function specialFieldAtkCap(field, enemy) {
  if (!field || state.field === 'normal') return 99;
  const tier = specialFieldTier(state.field);
  const elite = (enemy?.grade || '일반') === '정예';
  // 특수전장 공격력 안전 상한: 일부 던전/몬스터 배율이 곱해져 공격력이 폭증하지 않도록 최종값을 제한합니다.
  // 저주받은 결계도시는 봉인/출혈/연속타/공포가 한꺼번에 붙기 때문에 별도 저상한을 둡니다.
  if (state.field === 'barrierCity') {
    const over = Math.max(0, (state.stage || 1) - fieldUnlockStage(field));
    return Math.floor(12 + Math.sqrt(Math.max(1, state.stage || 1)) * 1.45 + over * 0.18 + (elite ? 7 : 0));
  }
  return Math.floor(18 + tier * 7 + Math.max(0, (state.stage || 1) - fieldUnlockStage(field)) * 0.55 + (elite ? tier * 5 : 0));
}

function specialFieldEnemyAtk(field, enemy, stage) {
  if (!field || state.field === 'normal') return null;
  const unlock = fieldUnlockStage(field);
  const localStage = Math.max(1, stage - unlock + 1);

  if (state.field === 'barrierCity') {
    // 결계도시는 몬스터 개별 기믹이 많아 기본 공격력을 낮게 잡고, 기믹 피해도 별도 상한으로 제한합니다.
    const elite = (enemy?.grade || '일반') === '정예';
    const fieldAtk = clamp(Number(field.atk) || 1, 0.70, 0.92);
    const enemyAtk = clamp(Number(enemy?.atk) || 1, 0.60, elite ? 1.04 : 0.98);
    const base = 5.2 + Math.pow(localStage, 0.55) * 0.72 + Math.sqrt(Math.max(1, stage)) * 0.22 + (elite ? 3.2 : 0);
    const raw = Math.floor(base * fieldAtk * enemyAtk);
    return Math.max(2, Math.min(raw, specialFieldAtkCap(field, enemy)));
  }

  const tier = specialFieldTier(state.field);
  const fieldAtk = clamp(Number(field.atk) || 1, 0.75, 1.22);
  const enemyAtk = clamp(Number(enemy?.atk) || 1, 0.65, (enemy?.grade === '정예') ? 1.22 : 1.15);
  const streak = currentField().mechanic === 'streak' ? Math.min(1.12, dungeonAtkBonus()) : 1;
  const mechanicSoftener = {
    timePressure: 0.86, heatUp: 0.88, evolve: 0.86, domainDevour: 0.84,
    bloodDebt: 0.86, execution: 0.88, stormChain: 0.90, curse: 0.92,
    barrierCity: 0.86, voidForge: 0.88, spiritRisk: 0.90
  }[field.mechanic] || 1;
  const base = 4.5 + tier * 1.35 + Math.pow(localStage, 0.72) * 1.05 + Math.sqrt(Math.max(1, stage)) * 0.55;
  const raw = Math.floor(base * fieldAtk * enemyAtk * streak * mechanicSoftener);
  return Math.max(2, Math.min(raw, specialFieldAtkCap(field, enemy)));
}

function spawnEnemyBase() {
  const field = fields[state.field] || fields.normal;
  const arena = bossArenas[state.bossArena] || bossArenas.seal;
  const bossData = bosses[state.bossIndex] || bosses[0];
  const enemy = state.boss ? bossData : (state.field === 'normal' ? selectNormalStageMonster() : selectSpecialFieldMonster(field));
  const stage = Math.max(1, state.stage || 1);
  const base = state.boss
    ? 120 + stage * 58 + Math.pow(stage, 1.42) * 24
    : (state.field === 'normal'
        ? 28 + stage * 13 + Math.pow(stage, 1.22) * 4
        : 105 + stage * 48 + Math.pow(stage, 1.38) * 20);
  if (state.boss) {
    const difficulty = currentBossDifficulty();
    const rawMaxHp = Math.floor(base * bossData.hp * arena.hp * difficulty.hp * 4.35);
    applyScaledEnemyHp(rawMaxHp, bossData, true);
    state.enemyAtk = Math.floor((7 + stage * 1.02) * bossData.atk * arena.atk * difficulty.atk * 0.84);
    state.bossBaseAtk = state.enemyAtk;
    state.bossPhase = 1;
    state.dungeonTimer = 0;
    state.summonPressure = 0;
    state.specialAtkRamp = 0;
  } else {
    let rawMaxHp;
    if (state.field === 'normal') {
      // 기본 전장은 스테이지/웨이브 진행에 따라 빠르게 밀 수 있는 체력 곡선을 유지한다.
      rawMaxHp = Math.floor(base * field.hp * enemy.hp * 0.42 * normalStageHpMultiplier(enemy));
    } else {
      // 특수 전장은 별도 체력 시스템 사용: 던전 등급, 입장 기준, 몬스터 등급, 기믹으로 계산한다.
      rawMaxHp = Math.floor(specialFieldMonsterHpBase(field, enemy, stage) * field.hp * enemy.hp);
    }
    applyScaledEnemyHp(rawMaxHp, enemy, false);
    const specialAtkScale = state.field === 'normal' ? normalStageAtkMultiplier() : (0.82 + specialFieldTier(state.field) * 0.035);
    state.enemyAtk = state.field === 'normal' ? Math.floor((5 + stage * 0.62) * field.atk * enemy.atk * dungeonAtkBonus() * 0.68 * specialAtkScale) : specialFieldEnemyAtk(field, enemy, stage);
    state.enemyBaseAtk = state.enemyAtk;
    state.summonPressure = 0;
    state.tempAtkPressure = 0;
    state.summonPressure = 0;
    state.specialAtkRamp = 0;
    state.enemyInvincibleHits = 0;
    state.enemyInvincibleCooldown = 0;
    if (state.field === 'barrierCity') {
      // 결계도시 전용 봉인/결속/공포 계열 상태가 몬스터 교체 후 누적되지 않도록 정리합니다.
      state.summonPressure = 0;
      state.tempAtkPressure = 0;
      state.skillSealTicks = 0;
    }
    if (currentField().mechanic !== 'streak') state.dungeonTimer = 0;
  }
  state.enemy = enemy;
  saveGame();
}

function startLoops() {
  clearInterval(attackTimer);
  clearInterval(enemyTimer);
  clearInterval(skillCooldownTimer);
  if (autoOn) attackTimer = setInterval(() => hit(1, false), attackInterval());
  enemyTimer = setInterval(enemyAttack, 520);
  skillCooldownTimer = setInterval(tickSkillCooldowns, 1000);
}

function tickSkillCooldowns() {
  state.skillCooldowns = state.skillCooldowns.map(v => Math.max(0, (v || 0) - 1));
  if (state.autoHealCooldown > 0) state.autoHealCooldown--;
  if (state.skillSealTicks > 0) state.skillSealTicks--;
  if (state.boss) {
    state.bossTimeLeft = Math.max(0, (state.bossTimeLeft || 0) - 1);
    if (state.bossTimeLeft <= 0) {
      bossFailed('시간 초과');
      return;
    }
  }
  tryAutoSkill();
  tryAutoHeal();
  renderBattle();
  renderSkillSlots();
  renderAutoHeal();
  renderAutoSkillPanel();
  saveGame();
}

function hit(mult = 1, fromSkill = false) {
  if (state.hp <= 0) return;
  const enemyMechanic = state.enemy?.mechanic || 'none';
  const bossMechanic = state.boss ? currentBoss().mechanic : '';
  const missChance = (enemyMechanic === 'evasion' ? 0.18 : 0) + (bossMechanic === 'accuracyDown' ? 0.18 : 0);
  if (missChance > 0 && Math.random() < missChance) {
    createFloat('회피', 'mtext');
    renderBattle();
    return;
  }
  let damage = Math.floor(baseDamage() * mult * (state.buffTicks > 0 ? state.buffPower : 1));
  if (enemyMechanic === 'armor' || bossMechanic === 'crystalArmor') damage = Math.floor(damage * (bossMechanic === 'crystalArmor' ? 0.72 : 0.84));
  const critical = Math.random() * 100 < state.crit + weaponCritBonus() + passiveCritBonus();
  if (critical) damage = Math.floor(damage * 2.25);
  dealEnemyDamage(damage);
  createShot(critical);
  createFloat(critical ? '치명 ' + fmt(damage) : fmt(damage));
  restoreMp(2 + Math.floor(state.mpLv / 2) + passiveMpRegenBonus());
  if (resolveEnemyDefeat()) { renderBattle(); saveGame(); return; }
  const reflectField = !state.boss && currentField().mechanic === 'reflect';
  const reflectEnemy = !state.boss && enemyMechanic === 'reflect';
  const counterEnemy = !state.boss && enemyMechanic === 'counter' && Math.random() < 0.18;
  const reflectBoss = state.boss && bossMechanic === 'reflect';
  applyReflectDamage(damage, { reflectField, reflectEnemy, counterEnemy, reflectBoss });
  applyDungeonHitMechanic(damage, critical);
  if (resolveEnemyDefeat()) { renderBattle(); saveGame(); return; }
  applyDotDamage();
  if (forceResolveEnemyDefeat('hit-final')) { renderBattle(); saveGame(); return; }
  if (state.buffTicks > 0 && !fromSkill) state.buffTicks--;
  resolveEnemyDefeat();
  renderBattle();
  saveGame();
}


function applyReflectDamage(damage, flags = {}) {
  const { reflectField, reflectEnemy, counterEnemy, reflectBoss } = flags;
  if (!reflectField && !reflectEnemy && !counterEnemy && !reflectBoss) return false;

  // 피해 반사는 자동 공격이 빠를수록 과도하게 누적되는 문제가 있어 내부 쿨다운을 둡니다.
  const now = Date.now();
  if ((state.reflectLockUntil || 0) > now) return false;

  let source = '반사';
  let rate = 0.012;
  let hpCap = 0.025;
  let cooldown = 1800;

  if (reflectEnemy) { rate = 0.016; hpCap = 0.03; cooldown = 1700; }
  if (reflectField) { rate = Math.max(rate, 0.014); hpCap = Math.max(hpCap, 0.028); cooldown = Math.max(cooldown, 1900); }
  if (counterEnemy) { source = '반격'; rate = 0.022; hpCap = 0.035; cooldown = 2200; }
  if (reflectBoss) { rate = 0.026; hpCap = 0.045; cooldown = 2400; }

  const raw = Math.floor(damage * rate);
  const cap = Math.max(1, Math.floor(getMaxHp() * hpCap));
  let reflected = Math.max(1, Math.min(raw, cap));

  // 보호막이 있으면 반사 피해도 먼저 보호막이 흡수합니다.
  let blocked = 0;
  if (state.shield > 0) {
    blocked = Math.min(state.shield, reflected);
    state.shield -= blocked;
    reflected -= blocked;
  }

  state.reflectLockUntil = now + cooldown;
  if (blocked > 0) createFloat(source + ' 보호막 -' + fmt(blocked), 'mtext');
  if (reflected > 0) {
    state.hp = Math.max(0, state.hp - reflected);
    createFloat(source + ' -' + fmt(reflected), 'bad');
    if (state.hp <= 0) handlePlayerDefeat();
  } else {
    createFloat(source + ' 흡수', 'mtext');
  }
  return true;
}

function applyDungeonHitMechanic(damage, critical) {
  if (state.boss) return;
  if (state.enemyHp <= 0 || state.enemyDefeatedPending) return;
  const mechanic = currentField().mechanic;
  if (mechanic === 'unstableBrew' && Math.random() < 0.22) {
    const roll = Math.random();
    if (roll < 0.34) { const extra = Math.floor(damage * 0.35); dealEnemyDamage(extra); createFloat('연금 폭발 ' + fmt(extra)); }
    else if (roll < 0.67) { const heal = Math.floor(getMaxHp() * 0.025); state.hp = Math.min(getMaxHp(), state.hp + heal); createFloat('약품 회복 ' + fmt(heal), 'heal'); }
    else { const self = Math.floor(getMaxHp() * 0.018); state.hp = Math.max(0, state.hp - self); createFloat('실험 반동 -' + fmt(self), 'bad'); }
  }
  if (mechanic === 'stormChain' && Math.random() < 0.28) {
    const extra = Math.floor(damage * 0.28); dealEnemyDamage(extra); createFloat('연쇄 번개 ' + fmt(extra));
  }
  if (mechanic === 'gravityWell' && !critical && Math.random() < 0.16) {
    state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + 1); createFloat('중력 지연', 'mtext');
  }
  if (mechanic === 'eclipseCycle' && ((state.dungeonTimer || 0) % 6) < 3) {
    const extra = Math.floor(damage * 0.18); dealEnemyDamage(extra); createFloat('월식 증폭 ' + fmt(extra));
  }
}

function applyDotDamage() {
  if (state.dotTicks > 0 && state.dotDamage > 0) {
    dealEnemyDamage(state.dotDamage);
    state.dotTicks--;
    createFloat('지속 ' + fmt(state.dotDamage), 'heal');
    if (state.dotTicks <= 0) state.dotDamage = 0;
  }
}



function cappedSpecialPlayerDamage(value, ratio = 0.035) {
  const raw = Math.max(1, Math.floor(Number(value) || 0));
  const safeRatio = barrierCityDamageRatioCap(ratio);
  if (!state.boss && state.field !== 'normal') return Math.min(raw, Math.max(2, Math.floor(getMaxHp() * safeRatio)));
  if (state.boss && isBarrierCityBattle()) return Math.min(raw, Math.max(4, Math.floor(getMaxHp() * safeRatio)));
  return raw;
}

function applyEnemyMechanicAfterAttack(mechanic) {
  if (state.enemyHp <= 0 || state.enemyDefeatedPending || state.resolvingEnemyDefeat) return;
  if (!mechanic || mechanic === 'none') return;
  if (state.field === 'barrierCity' && !state.boss) {
    // 결계도시 일반 전투에서는 공격량 증가/추가 피해형 기믹을 제거하고,
    // 봉인·지연·버프 제거 같은 제어형 기믹만 낮은 확률로 허용합니다.
    const controlOnly = ['minorSkillSeal','skillSeal','cooldownUp','bind','buffPurge','attackDown','defDown','accuracyDown','shield','barrierShield','armor'];
    if (!controlOnly.includes(mechanic)) return;
    const elite = (state.enemy?.grade || '일반') === '정예';
    if (Math.random() > (elite ? 0.28 : 0.16)) return;
  }
  if (['poison','strongPoison','burn','poisonField'].includes(mechanic)) {
    const extra = cappedSpecialPlayerDamage(Math.floor(getMaxHp() * (mechanic === 'strongPoison' || mechanic === 'poisonField' ? 0.025 : 0.014)), 0.025);
    state.hp = Math.max(0, state.hp - extra);
    createFloat((mechanic.includes('poison') ? '독 ' : '화상 ') + '-' + fmt(extra), 'bad');
  }
  if (['slow','cooldownUp','bind','fear','skillDisrupt','freezeSlow','timeDelay'].includes(mechanic)) {
    const chance = mechanic === 'cooldownUp' || mechanic === 'skillDisrupt' ? 0.32 : 0.24;
    if (Math.random() < chance) {
      state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + (mechanic === 'timeDelay' ? 2 : 1));
      createFloat('행동 지연', 'mtext');
    }
  }
  if (mechanic === 'shock' || mechanic === 'multiHit') {
    const extra = cappedSpecialPlayerDamage(Math.floor(state.enemyAtk * 0.28), 0.025);
    state.hp = Math.max(0, state.hp - extra);
    createFloat('추가타 -' + fmt(extra), 'bad');
  }
  if (mechanic === 'regen' || mechanic === 'bossRegen') {
    const heal = Math.max(1, Math.floor(state.enemyMaxHp * (mechanic === 'bossRegen' ? 0.018 : 0.01)));
    state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + heal);
    createFloat('재생 ' + fmt(heal), 'heal');
  }
  if (mechanic === 'shield') {
    const heal = Math.max(1, Math.floor(state.enemyMaxHp * 0.008));
    state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + heal);
    createFloat('보호막', 'mtext');
  }
  if (mechanic === 'charge' && (state.dungeonTimer || 0) % 4 === 0) {
    const charge = cappedSpecialPlayerDamage(Math.floor(state.enemyAtk * 0.55), 0.04);
    state.hp = Math.max(0, state.hp - charge);
    createFloat('돌진 -' + fmt(charge), 'bad');
  }
  if (mechanic === 'summonUndead') {
    // 보스전에서는 압박 수치로 처리하되, 특수 전장 일반 몬스터는 공격력 누적을 만들지 않습니다.
    if (state.boss) state.summonPressure = Math.min(0.18, (state.summonPressure || 0) + 0.015);
    else state.summonPressure = 0;
    createFloat('부하 소환', 'bad');
  }
  if (mechanic === 'skillSeal' && Math.random() < 0.18) {
    state.skillSealTicks = Math.max(state.skillSealTicks || 0, state.boss ? 2 : 1);
    createFloat('스킬 봉인', 'bad');
  }
  if (mechanic === 'minorSkillSeal' && Math.random() < 0.08) {
    state.skillSealTicks = Math.max(state.skillSealTicks || 0, 1);
    createFloat('부적 봉인', 'bad');
  }
  if (mechanic === 'fearDot' && Math.random() < 0.22) {
    const extra = cappedSpecialPlayerDamage(Math.floor(getMaxHp() * 0.014), 0.02);
    state.hp = Math.max(0, state.hp - extra);
    state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + 1);
    createFloat('공포 원념', 'bad');
  }
  if (mechanic === 'bleed' && Math.random() < 0.25) {
    const extra = cappedSpecialPlayerDamage(Math.floor(getMaxHp() * 0.010), 0.018);
    state.hp = Math.max(0, state.hp - extra);
    createFloat('출혈', 'bad');
  }
  if (mechanic === 'buffPurge' && Math.random() < 0.18) {
    state.buffTicks = 0;
    state.buffPower = 1;
    createFloat('버프 제거', 'bad');
  }
  if (mechanic === 'manaDrain') {
    const drain = Math.max(3, Math.floor(getMaxMp() * 0.035));
    state.mp = Math.max(0, state.mp - drain);
    createFloat('마나 흡수 -' + fmt(drain), 'mtext');
  }
  if (mechanic === 'treasureGuard') {
    const guard = Math.max(1, Math.floor(state.enemyMaxHp * 0.006));
    state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + guard);
    createFloat('황금 장갑', 'mtext');
  }
  if (mechanic === 'spiritRisk') {
    const spirit = cappedSpecialPlayerDamage(Math.floor(getMaxHp() * 0.014), 0.022);
    state.hp = Math.max(0, state.hp - spirit);
    createFloat('영혼 압박 -' + fmt(spirit), 'bad');
  }
  if (mechanic === 'runeSurge' && Math.random() < 0.28) {
    state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + 1);
    createFloat('룬 폭주', 'bad');
  }
  // deathBomb은 낮은 체력에서 반복 폭발하지 않고, 처치 순간 killEnemy()에서 1회만 처리됩니다.
  if (mechanic === 'bloodDebt') {
    const debt = cappedSpecialPlayerDamage(Math.floor(getMaxHp() * 0.014), 0.022);
    state.hp = Math.max(0, state.hp - debt);
    createFloat('피의 대가 -' + fmt(debt), 'bad');
  }
  if (mechanic === 'overgrowth') {
    const heal = Math.max(1, Math.floor(state.enemyMaxHp * 0.018));
    state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + heal);
    createFloat('증식 회복 ' + fmt(heal), 'heal');
  }
  if (mechanic === 'dreamShift' && Math.random() < 0.25) {
    if (Math.random() < 0.5) restoreMp(Math.floor(getMaxMp() * 0.04));
    else state.skillCooldowns = state.skillCooldowns.map(v => Math.max(0, (v || 0) - 1));
    createFloat('꿈결 변동', 'mtext');
  }
  if (mechanic === 'voidForge') {
    const guard = Math.max(1, Math.floor(state.enemyMaxHp * 0.008));
    state.enemyHp = Math.min(state.enemyMaxHp, state.enemyHp + guard);
    createFloat('공허 장갑', 'mtext');
  }
}

function updateBossPhase() {
  if (!state.boss || !state.enemyMaxHp) return;
  const ratio = state.enemyHp / state.enemyMaxHp;
  const nextPhase = ratio <= 0.33 ? 3 : ratio <= 0.66 ? 2 : 1;
  if (nextPhase > (state.bossPhase || 1)) {
    state.bossPhase = nextPhase;
    state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + nextPhase);
    createFloat('보스 ' + nextPhase + '페이즈', 'bad');
    log(`${currentBoss().name} ${nextPhase}페이즈 돌입. 공격력이 상승하고 패턴이 강화됩니다.`, 'bad');
  }
}

function getEnemyAttackCount(mechanic) {
  const enemy = state.enemy || {};
  // 공격 빈도를 대폭 상향합니다. 특수 전장/탑은 한 번의 공격 턴 안에서도 여러 번 타격합니다.
  let hits = 5;
  if (enemy.grade === '정예') hits += 4;
  if (mechanic === 'fast') hits += 4;
  if (mechanic === 'multiHit') hits += 6;
  if (mechanic === 'shock' || mechanic === 'comboSlash' || mechanic === 'stormChain') hits += 4;
  if (mechanic === 'aoe' || mechanic === 'wave') hits += 3;
  if (mechanic === 'charge' || mechanic === 'ambush') hits += 3;
  if (mechanic === 'crit' || mechanic === 'execution' || mechanic === 'magicBurst') hits += 2;
  if (!state.boss && state.field !== 'normal') hits += 3;
  if (state.towerMode) hits += Math.min(8, Math.floor((state.towerFloor || 1) / 5));
  if (state.boss) hits += Math.max(6, (state.bossPhase || 1) * 3);
  return Math.max(1, Math.min(state.boss ? 24 : 18, hits));
}

function applyPlayerDamageMultiHit(totalDamage, hitCount, label = '') {
  let remaining = Math.max(0, Math.floor(totalDamage));
  let actualTotal = 0;
  const hits = Math.max(1, Math.floor(hitCount || 1));
  for (let i = 1; i <= hits && remaining > 0; i++) {
    let hitDamage = i === hits ? remaining : Math.max(1, Math.ceil(remaining / (hits - i + 1)));
    remaining -= hitDamage;
    if (state.shield > 0) {
      const blocked = Math.min(state.shield, hitDamage);
      state.shield -= blocked;
      hitDamage -= blocked;
      if (blocked > 0) createFloat(`보호막 -${blocked}`, 'mtext');
    }
    if (hitDamage > 0) {
      const beforeDefense = hitDamage;
      hitDamage = reduceIncomingDamageByDefense(hitDamage);
      if (beforeDefense > hitDamage && i === 1) createFloat(`방어 -${beforeDefense - hitDamage}`, 'mtext');
      state.hp -= hitDamage;
      actualTotal += hitDamage;
      const prefix = hits > 1 ? `${i}/${hits} ` : '';
      createFloat(`${prefix}-${hitDamage}`, 'bad');
    }
    if (state.hp <= 0) break;
  }
  if (hits > 1 && actualTotal > 0) log(`${state.enemy?.name || '몬스터'} 연속 공격 ${hits}회: 총 ${fmt(actualTotal)} 피해`, 'bad');
  return actualTotal;
}

function enemyAttack() {
  if (state.hp <= 0) return;
  let atk = state.enemyAtk;
  if (state.debuff > 0) {
    atk = Math.floor(atk * 0.58);
    state.debuff--;
  }
  const mechanic = state.boss ? currentBoss().mechanic : (state.enemy?.mechanic || currentField().mechanic);
  if (state.boss) state.dungeonTimer = (state.dungeonTimer || 0) + 1;
  if (state.boss) updateBossPhase();
  if (mechanic === 'timeDelay' || mechanic === 'heatUp' || mechanic === 'timePressure' || currentField().mechanic === 'timePressure') {
    const rampCap = isBarrierCityBattle() ? (state.boss ? 0.10 : 0.035) : (state.boss ? 0.22 : 0.08);
    atk = Math.floor(atk * (1 + Math.min(rampCap, (state.dungeonTimer || 0) * 0.006)));
  }
  if (state.summonPressure > 0) atk = Math.floor(atk * (1 + Math.min(0.08, state.summonPressure)));
  if (mechanic === 'fast') atk = Math.floor(atk * 1.08);
  if (mechanic === 'crit' && Math.random() < 0.16) { atk = Math.floor(atk * 1.45); createFloat('치명 공격', 'bad'); }
  if (mechanic === 'ambush' && Math.random() < 0.14) { atk = Math.floor(atk * 1.45); createFloat('기습', 'bad'); }
  if (mechanic === 'magicBurst' && Math.random() < 0.14) { atk = Math.floor(atk * 1.42); createFloat('마법 폭발', 'bad'); }
  if (mechanic === 'aoe' || mechanic === 'wave') atk = Math.floor(atk * 1.10);
  if (state.boss) atk = Math.floor(atk * (1 + ((state.bossPhase || 1) - 1) * 0.16));
  if (mechanic === 'bloodDebt') atk = Math.floor(atk * 1.12);
  if (mechanic === 'voidForge') atk = Math.floor(atk * 1.08);
  if (mechanic === 'attackDown' && Math.random() < 0.16) { state.debuff = Math.max(state.debuff || 0, 2); createFloat('공격 약화', 'bad'); }
  if (mechanic === 'execution' && Math.random() < 0.12) { atk = Math.floor(atk * 1.28); createFloat('처형', 'bad'); }
  if (mechanic === 'evolve' || mechanic === 'domainDevour') {
    const cap = isBarrierCityBattle() ? (state.boss ? 0.10 : 0.035) : (state.boss ? 0.22 : 0.08);
    atk = Math.floor(atk * (1 + Math.min(cap, (state.dungeonTimer || 0) * 0.005)));
  }
  if (mechanic === 'bindingWitch' && Math.random() < 0.18) { state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + 1); state.autoHealCooldown = Math.max(state.autoHealCooldown || 0, 2); createFloat('붉은 결속', 'bad'); }
  if (!state.boss && state.field !== 'normal') {
    // 모든 특수 전장 일반 전투에서는 공격력 증가 효과를 삭제합니다.
    // 시간 압박, 진화, 영역 포식, 치명, 기습, 처형, 공허 장갑 등은 공격력 자체를 올리지 못하고
    // 상태이상/공격 횟수/보상/방해 기믹으로만 표현됩니다.
    const baseSpecialAtk = Math.max(1, Number(state.enemyBaseAtk || state.enemyAtk || atk));
    atk = baseSpecialAtk;
    state.dungeonTimer = 0;
    state.summonPressure = 0;
    state.specialAtkRamp = 0;
  }
  let damage = Math.max(1, Math.floor(atk * 1.22) + Math.floor(Math.random() * 8) - Math.floor(state.dust / 34));
  if ((state.enemyInvincibleHits || 0) > 0) {
    damage = Math.floor(damage * 2);
    createFloat('무적 반격 2배', 'bad');
  }
  if (!state.boss && state.field !== 'normal') {
    const capRatio = state.field === 'barrierCity' ? 0.028 : 0.075;
    const specialCap = Math.max(4, Math.floor(getMaxHp() * capRatio));
    damage = Math.min(damage, specialCap);
  }
  if (state.boss && isBarrierCityBattle()) {
    const bossCap = Math.max(8, Math.floor(getMaxHp() * 0.085));
    damage = Math.min(damage, bossCap);
  }
  const hitCount = getEnemyAttackCount(mechanic);
  const boostedDamage = Math.floor(damage * (1 + Math.max(0, hitCount - 1) * 0.18));
  applyPlayerDamageMultiHit(boostedDamage, hitCount);
  applyEnemyMechanicAfterAttack(mechanic);
  tryAutoHeal();
  if (state.hp <= 0) handlePlayerDefeat();
  renderBattle();
  saveGame();
}

function handlePlayerDefeatBase() {
  state.hp = 0;
  if (state.boss) {
    bossFailed();
    return;
  }
  autoOn = false;
  startLoops();
  log('플레이어가 쓰러졌습니다. 3초 후 체력 50%로 부활합니다.', 'bad');
  setTimeout(() => {
    state.hp = Math.floor(getMaxHp() * 0.5);
    autoOn = true;
    startLoops();
    renderAll();
    log('부활했습니다. 스킬 슬롯과 자동 힐 세팅을 확인하세요.', 'good');
  }, 3000);
}

function bossFailed(reason = '체력 0') {
  const failedBoss = state.enemy?.name || currentBoss().name;
  state.boss = false;
  state.bossFails = (state.bossFails || 0) + 1;
  state.shield = 0;
  state.debuff = 0;
  state.dotTicks = 0;
  state.dotDamage = 0;
  state.buffTicks = 0;
  state.skillSealTicks = 0;
  state.reflectLockUntil = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.bossPhase = 1;
  state.hp = Math.floor(getMaxHp() * 0.35);
  state.mp = Math.floor(getMaxMp() * 0.35);
  log(`보스 실패: ${failedBoss} (${reason}). 체력과 마나가 일부 회복된 상태로 일반 전장에 복귀합니다.`, 'bad');
  spawnEnemy();
  startLoops();
  renderAll();
  saveGame();
}

function restoreMp(value) { state.mp = Math.min(getMaxMp(), state.mp + value); }

function killEnemyBase() {
  if (state.resolvingEnemyDefeat) return;
  state.resolvingEnemyDefeat = true;
  state.enemyDefeatedPending = false;
  const field = fields[state.field];
  const defeatedMechanic = state.boss ? currentBoss().mechanic : (state.enemy?.mechanic || 'none');
  if (defeatedMechanic === 'deathBomb') {
    const bomb = Math.max(1, Math.floor(state.enemyAtk * 0.75));
    state.hp = Math.max(0, state.hp - bomb);
    createFloat('처치 폭발 -' + fmt(bomb), 'bad');
    if (state.hp <= 0) { state.resolvingEnemyDefeat = false; return handlePlayerDefeat(); }
  }
  let reward = Math.floor((18 + state.stage * 8 + state.enemyMaxHp * 0.035) * state.rewardBoost * (1 + weaponRewardBonus() + passiveRewardBonus() + rebirthRewardBonus()) * (state.boss ? currentBoss().rewardMult : dungeonRewardBonus()));
  const type = field.reward;
  if (type === 'gold') state.gold += reward * 4;
  else if (type === 'manaCrystal') state.manaCrystal += Math.max(1, Math.floor(reward / 4));
  else if (type === 'soul') state.soul += Math.max(1, Math.floor(reward / 25));
  else if (type === 'dust') state.dust += Math.max(1, Math.floor(reward / 3));
  else if (type === 'rune') state.rune += Math.max(1, Math.floor(reward / 5));
  else {
    state.gold += reward;
    state.manaCrystal += 1;
    if (state.kills % 6 === 0) state.dust += 2;
    if (state.kills % 7 === 0) state.rune += 1;
  }
  state.rewardBoost = 1;
  state.hp = Math.min(getMaxHp(), state.hp + Math.floor(getMaxHp() * (0.05 + passiveRegenBonus())));
  state.kills++;
  if (state.boss) {
    const difficulty = currentBossDifficulty();
    const arenaReward = currentBossArena().reward || {};
    const timeBonus = currentBossTimeLimit();
    for (const [key, value] of Object.entries(arenaReward)) state[key] = (state[key] || 0) + Math.floor(value * currentBoss().rewardMult * difficulty.reward * timeBonus.reward);
    state.bossMedal = (state.bossMedal || 0) + difficulty.medal + timeBonus.medal;
    state.boss = false;
    state.bossPhase = 1;
    state.bossTimeLeft = 0;
    state.bossWins = (state.bossWins || 0) + 1;
    state.stage += 1 + difficulty.stage;
    createBossDefeatFx();
    log(`보스 격파! ${state.enemy.name} ${difficulty.label} 난이도 처치 성공. 보스 메달 +${difficulty.medal + currentBossTimeLimit().medal}`, 'good');
  } else {
    if (currentField().mechanic === 'streak') state.dungeonStreak = (state.dungeonStreak || 0) + 1;
    else state.dungeonStreak = 0;
    if (state.field === 'normal') {
      advanceNormalStage();
    }
    createSparkBurst('resource', 14);
    log(state.enemy.name + ' 처치. 보상을 획득했습니다.', 'good');
    recordSpecialMissionKill();
  }
  state.lastEnemyName = state.enemy?.name || '';
  state.enemySpawnSeq = (state.enemySpawnSeq || 0) + 1;
  spawnEnemy();
  state.enemyDefeatedPending = false;
  state.resolvingEnemyDefeat = false;
  renderBattle();
  saveGame();
}

function useSkillSlot(slotIndex) {
  repairSkillState();
  if (state.skillSealTicks > 0) return log('스킬이 봉인되어 사용할 수 없습니다: ' + state.skillSealTicks + '초', 'warn');
  const skillId = state.skillSlots[slotIndex];
  if (skillId === null || skillId === undefined) return log('빈 스킬 슬롯입니다.', 'warn');
  const skill = skills[skillId];
  if (!skill || !isSkillUnlocked(skillId)) return log('장착된 스킬이 잠겨 있습니다.', 'warn');
  if ((state.skillCooldowns[slotIndex] || 0) > 0) return log(`스킬 ${slotIndex + 1} 재사용 대기 중입니다.`, 'warn');
  if (isSkillUnlocked(skillId) && skillLevel(skillId) < 1) state.skillLevels[skillId] = 1;
  const level = Math.max(1, skillLevel(skillId));
  const manaCost = skillManaCost(skill, level);
  if (state.mp < manaCost) return log(`${skill.name} 사용 실패: 마나가 부족합니다.`, 'warn');
  state.mp -= manaCost;
  state.skillCooldowns[slotIndex] = skillCooldown(skill, level);
  applySkillEffect(skill, level);
  log(`슬롯 ${slotIndex + 1}: ${skill.name} 사용`, 'good');
  renderAll();
  saveGame();
}

function applySkillEffect(skill, level) {
  const power = skillPower(skill, level);
  createSkillFx(skill.type);
  if (skill.type === 'damage') hit(power, true);
  if (skill.type === 'heal') {
    const heal = Math.floor(getMaxHp() * (0.16 + skill.tier * 0.018 + level * 0.014) * categoryPowerBonus(skill.categoryIndex));
    state.hp = Math.min(getMaxHp(), state.hp + heal);
    createFloat('회복 ' + fmt(heal), 'heal');
  }
  if (skill.type === 'dot') {
    state.dotTicks = 4 + Math.floor(level / 2);
    state.dotDamage = Math.floor(baseDamage() * (0.42 + skill.tier * 0.08 + level * 0.045) * categoryPowerBonus(skill.categoryIndex));
    hit(0.55 + level * 0.015, true);
  }
  if (skill.type === 'buff') {
    state.buffTicks = 5 + Math.floor(level / 3);
    state.buffPower = 1.18 + skill.tier * 0.035 + level * 0.03 + (state.categoryLevels[skill.categoryIndex] || 0) * 0.035;
    createFloat('공격 강화');
  }
  if (skill.type === 'debuff') {
    state.debuff = 4 + skill.tier + Math.floor(level / 2);
    hit(1.05 + level * 0.04, true);
  }
  if (skill.type === 'shield') {
    const shield = Math.floor(getMaxHp() * (0.22 + skill.tier * 0.025 + level * 0.015) * categoryPowerBonus(skill.categoryIndex));
    state.shield += shield;
    createFloat('보호막 ' + fmt(shield), 'mtext');
  }
  if (skill.type === 'drain') {
    const damage = Math.floor(baseDamage() * power * 0.62);
    const heal = Math.floor(damage * (0.22 + level * 0.012));
    dealEnemyDamage(damage);
    state.hp = Math.min(getMaxHp(), state.hp + heal);
    createShot(true);
    createFloat('흡수 ' + fmt(heal), 'heal');
    resolveEnemyDefeat();
  }
  if (skill.type === 'mana') {
    const gain = Math.floor(skillManaCost(skill, level) * (1.25 + level * 0.05) * categoryPowerBonus(skill.categoryIndex));
    restoreMp(gain);
    hit(1.05 + level * 0.035, true);
    createFloat('마나 +' + fmt(gain), 'mtext');
  }
  if (skill.type === 'aoe') {
    hit(power * 1.28, true);
    createFloat('광역 폭발');
  }
  if (skill.type === 'resource') {
    state.rewardBoost = (1.55 + skill.tier * 0.1 + level * 0.05) * categoryPowerBonus(skill.categoryIndex);
    hit(1.0 + level * 0.025, true);
  }
  resolveEnemyDefeat();
}

function skillCooldown(skill, level) {
  return Math.max(2, 8 - Math.floor(skill.tier / 3) - Math.floor(level / 12));
}

function tryAutoSkill() {
  if (!state.autoSkillEnabled || state.hp <= 0) return;
  repairSkillState();
  for (let attempt = 0; attempt < state.skillSlots.length; attempt++) {
    const slot = (state.autoSkillCursor + attempt) % state.skillSlots.length;
    const skillId = state.skillSlots[slot];
    const skill = skills[skillId];
    if (!skill || (state.skillCooldowns[slot] || 0) > 0 || !isSkillUnlocked(skillId)) continue;
    const level = Math.max(1, skillLevel(skillId));
    if (state.mp < skillManaCost(skill, level)) continue;
    if (!canAutoUseSkill(skill)) continue;
    state.autoSkillCursor = (slot + 1) % state.skillSlots.length;
    useSkillSlot(slot);
    return;
  }
}

function canAutoUseSkill(skill) {
  // 자동 사용이 힐·버프·보호막 등을 아무 때나 낭비하지 않도록 조건을 둡니다.
  if (skill.type === 'heal') return state.hp <= getMaxHp() * 0.72;
  if (skill.type === 'shield') return state.shield <= getMaxHp() * 0.18 || state.hp <= getMaxHp() * 0.82;
  if (skill.type === 'mana') return state.mp <= getMaxMp() * 0.72;
  if (skill.type === 'buff') return state.buffTicks <= 0;
  if (skill.type === 'debuff') return state.debuff <= 0;
  if (skill.type === 'dot') return state.dotTicks <= 0;
  if (skill.type === 'resource') return state.rewardBoost <= 1.05;
  return true;
}

function equipSkill(skillId, slotIndex) {
  if (!isSkillUnlocked(skillId)) return log('잠긴 스킬은 장착할 수 없습니다.', 'warn');
  state.skillSlots[slotIndex] = skillId;
  state.skillCooldowns[slotIndex] = 0;
  log(`슬롯 ${slotIndex + 1}에 ${skills[skillId].name} 장착`, 'good');
  renderAll();
  saveGame();
}

function levelUpSkill(skillId) {
  return levelUpSkillMany(skillId, 1);
}

function levelUpSkillMany(skillId, count) {
  if (!isSkillUnlocked(skillId)) return log('잠긴 스킬은 레벨업할 수 없습니다.', 'warn');
  count = Math.max(1, Math.floor(Number(count) || 1));
  const result = simulateSkillLevelCost(skillId, count);
  if (result.levels <= 0) return log('스킬 레벨업 재화가 부족합니다.', 'warn');
  paySkillCost(result.cost);
  state.skillLevels[skillId] = skillLevel(skillId) + result.levels;
  unlockFollowingSkillsFrom(skillId);
  log(`${skills[skillId].name} ${result.levels}회 레벨업 → Lv.${skillLevel(skillId)} 달성`, 'good');
  repairSkillState();
  renderAll();
  saveGame();
}

function levelUpSkillToNext(skillId) {
  const skill = skills[skillId];
  if (!skill || !isSkillUnlocked(skillId)) return log('잠긴 스킬은 레벨업할 수 없습니다.', 'warn');
  const next = skills[skillId + 1];
  if (!next || next.categoryIndex !== skill.categoryIndex) return log('이 분야의 마지막 스킬입니다.', 'warn');
  if (isSkillUnlocked(next.id)) {
    equipSkill(next.id, 0);
    currentSkillCategory = next.categoryIndex;
    log(`이미 개방된 다음 스킬 ${next.name}을 슬롯 1에 장착했습니다.`, 'good');
    renderAll();
    return;
  }
  const need = Math.max(0, SKILL_NEXT_UNLOCK_LEVEL - skillLevel(skillId));
  if (need <= 0) {
    state.skillLevels[next.id] = Math.max(state.skillLevels[next.id] || 0, 1);
    log(`새 스킬 개방: ${next.name}`, 'good');
    repairSkillState(); renderAll(); saveGame();
    return;
  }
  const result = simulateSkillLevelCost(skillId, need);
  if (result.levels < need) return log(`다음 스킬 개방 재화가 부족합니다. 필요: ${formatCost(result.requiredCost || result.cost)}`, 'warn');
  paySkillCost(result.cost);
  state.skillLevels[skillId] = skillLevel(skillId) + result.levels;
  unlockFollowingSkillsFrom(skillId);
  if (isSkillUnlocked(next.id)) {
    state.skillLevels[next.id] = Math.max(state.skillLevels[next.id] || 0, 1);
    log(`${skill.name}을 Lv.${skillLevel(skillId)}까지 올려 ${next.name}을 개방했습니다.`, 'good');
  }
  repairSkillState(); renderAll(); saveGame();
}

function unlockFollowingSkillsFrom(skillId) {
  const skill = skills[skillId];
  let current = skillId;
  while (skills[current] && skills[current + 1] && skills[current + 1].categoryIndex === skill.categoryIndex && skillLevel(current) >= SKILL_NEXT_UNLOCK_LEVEL) {
    const next = skills[current + 1];
    if (state.skillLevels[next.id] < 1) {
      state.skillLevels[next.id] = 1;
      log(`새 스킬 개방: ${next.name}`, 'good');
    }
    current++;
  }
}

function skillLevelCost(skillId, overrideLevel = null) {
  const level = Math.max(1, overrideLevel ?? skillLevel(skillId));
  const skill = skills[skillId];
  const discount = 1 - rebirthSkillDiscount();
  // 다음 스킬 해금 조건이 Lv.50으로 올라가므로, 스킬 성장 비용은 이전보다 훨씬 완만하게 조정합니다.
  return {
    gold: Math.max(1, Math.floor(18 * Math.pow(1.095, level + skillId * 0.045) * discount)),
    rune: Math.max(1, Math.floor((1 + skill.tier * 0.75 + level * 0.38) * discount)),
    manaCrystal: Math.max(1, Math.floor((1 + skill.tier * 0.65 + level * 0.34 + skill.categoryIndex * 0.22) * discount)),
  };
}

function simulateSkillLevelCost(skillId, count) {
  let level = Math.max(1, skillLevel(skillId));
  const total = { gold: 0, rune: 0, manaCrystal: 0 };
  let levels = 0;
  let requiredCost = null;
  for (let i = 0; i < count; i++) {
    const cost = skillLevelCost(skillId, level);
    const nextTotal = {
      gold: total.gold + cost.gold,
      rune: total.rune + cost.rune,
      manaCrystal: total.manaCrystal + cost.manaCrystal,
    };
    if (!canPaySkillCost(nextTotal)) {
      requiredCost = nextTotal;
      break;
    }
    total.gold = nextTotal.gold;
    total.rune = nextTotal.rune;
    total.manaCrystal = nextTotal.manaCrystal;
    level++;
    levels++;
  }
  return { levels, cost: total, requiredCost };
}

function canPaySkillCost(cost) {
  return state.gold >= cost.gold && state.rune >= cost.rune && state.manaCrystal >= cost.manaCrystal;
}

function paySkillCost(cost) {
  state.gold -= cost.gold;
  state.rune -= cost.rune;
  state.manaCrystal -= cost.manaCrystal;
}

function formatCost(cost) {
  return `골드 ${fmt(cost.gold)} / 룬 ${fmt(cost.rune)} / 마나수정 ${fmt(cost.manaCrystal)}`;
}

function categoryUpgradeCost(categoryIndex) {
  const level = state.categoryLevels[categoryIndex] || 0;
  const cat = skillCategories[categoryIndex];
  return {
    main: Math.max(1, Math.floor(7 + categoryIndex * 2 + level * 5 + Math.pow(level, 1.22) * 3)),
    gold: Math.max(1, Math.floor(75 * Math.pow(1.155, level + categoryIndex * 0.25))),
    key: cat.resource,
  };
}

function upgradeCategory(categoryIndex) {
  const cost = categoryUpgradeCost(categoryIndex);
  if (state[cost.key] < cost.main || state.gold < cost.gold) return log('분야 업그레이드 재화가 부족합니다.', 'warn');
  state[cost.key] -= cost.main;
  state.gold -= cost.gold;
  state.categoryLevels[categoryIndex] = (state.categoryLevels[categoryIndex] || 0) + 1;
  log(`${skillCategories[categoryIndex].name} 분야 강화 Lv.${state.categoryLevels[categoryIndex]} 달성`, 'good');
  renderAll();
  saveGame();
}

function passiveCost(i) {
  const level = state.passiveLevels[i] || 0;
  const p = passiveSkills[i];
  return {
    main: Math.max(1, Math.floor(6 + i * 3 + level * 4 + Math.pow(level, 1.2) * 2.5)),
    gold: Math.max(1, Math.floor(65 * Math.pow(1.14, level + i * 0.22))),
    key: p.cost,
  };
}

function upgradePassive(i) {
  const cost = passiveCost(i);
  if (state[cost.key] < cost.main || state.gold < cost.gold) return log('패시브 레벨업 재화가 부족합니다.', 'warn');
  state[cost.key] -= cost.main;
  state.gold -= cost.gold;
  state.passiveLevels[i] = (state.passiveLevels[i] || 0) + 1;
  state.hp = Math.min(state.hp, getMaxHp());
  state.mp = Math.min(state.mp, getMaxMp());
  log(`${passiveSkills[i].name} Lv.${state.passiveLevels[i]} 달성`, 'good');
  renderAll();
  saveGame();
}

function autoHealStats() {
  const level = state.autoHealLevel || 0;
  return {
    level,
    threshold: Math.min(0.72, 0.34 + level * 0.018),
    healRate: 0.16 + level * 0.018,
    manaCost: Math.max(8, Math.floor(24 + level * 2)),
    cooldown: Math.max(3, 10 - Math.floor(level / 4)),
  };
}

function tryAutoHeal() {
  if (!state.autoHealEnabled || state.hp <= 0 || state.autoHealCooldown > 0 || isAutoHealBlocked()) return;
  const stats = autoHealStats();
  if (state.hp > getMaxHp() * stats.threshold || state.mp < stats.manaCost) return;
  state.mp -= stats.manaCost;
  const heal = Math.floor(getMaxHp() * stats.healRate);
  state.hp = Math.min(getMaxHp(), state.hp + heal);
  state.autoHealCooldown = stats.cooldown;
  createSkillFx('heal');
  createFloat('자동 힐 ' + fmt(heal), 'heal');
  log('자동 힐 발동', 'good');
}

function autoHealCost() {
  const level = state.autoHealLevel || 0;
  return { gold: Math.max(1, Math.floor(90 * Math.pow(1.16, level))), manaCrystal: 8 + level * 4, dust: 6 + level * 3 };
}

function upgradeAutoHeal() {
  const cost = autoHealCost();
  if (state.gold < cost.gold || state.manaCrystal < cost.manaCrystal || state.dust < cost.dust) return log('자동 힐 레벨업 재화가 부족합니다.', 'warn');
  state.gold -= cost.gold;
  state.manaCrystal -= cost.manaCrystal;
  state.dust -= cost.dust;
  state.autoHealLevel = (state.autoHealLevel || 0) + 1;
  log(`자동 힐 Lv.${state.autoHealLevel} 달성`, 'good');
  renderAll();
  saveGame();
}

function toggleAutoHeal() {
  state.autoHealEnabled = !state.autoHealEnabled;
  log(`자동 힐 ${state.autoHealEnabled ? 'ON' : 'OFF'}`, 'good');
  renderAll();
  saveGame();
}

function toggleAutoSkill() {
  state.autoSkillEnabled = !state.autoSkillEnabled;
  log(`스킬 자동 사용 ${state.autoSkillEnabled ? 'ON' : 'OFF'}`, 'good');
  renderAll();
  saveGame();
}

function upgradeCosts() {
  return {
    power: Math.floor(20 * Math.pow(1.18, state.coreLv - 1)),
    powerMultGold: Math.floor(320 * Math.pow(1.32, state.powerMultLv || 0)),
    powerMultRune: 18 + (state.powerMultLv || 0) * 9,
    speed: Math.floor(45 * Math.pow(1.28, state.speed - 1)),
    hp: 30 + state.hpLv * 12,
    defense: 22 + (state.defenseLv || 1) * 10,
    defenseMultDust: 50 + (state.defenseMultLv || 0) * 24,
    defenseMultRune: 8 + (state.defenseMultLv || 0) * 6,
    hpMultDust: 65 + (state.hpMultLv || 0) * 30,
    hpMultSoul: 2 + Math.floor((state.hpMultLv || 0) / 2),
    mp: 25 + state.mpLv * 10,
    crit: 20 + Math.floor(state.crit * 1.7),
    gradeGold: Math.floor(260 * Math.pow(3.1, state.grade)),
    gradeDust: 40 + state.grade * 60,
    awakeningGold: Math.floor(1800 * Math.pow(1.34, awakeningLv())),
    awakeningMedal: 3 + awakeningLv() * 2 + Math.floor(awakeningLv() / 10) * 10,
    transcendSoul: 12 + transcendLv() * 9 + Math.floor(transcendLv() / 10) * 35,
    transcendRune: 75 + transcendLv() * 42 + Math.floor(transcendLv() / 10) * 160,
    limitBossMedal: 12 + limitBreakLv() * 9 + Math.floor(limitBreakLv() / 5) * 25,
    limitGold: Math.floor(6500 * Math.pow(1.48, limitBreakLv())),
  };
}

function pay(key, amount) {
  if (state[key] < amount) {
    log(`${resourceName(key)} 부족`, 'warn');
    return false;
  }
  state[key] -= amount;
  return true;
}

function upgradeAwakening() {
  const cost = upgradeCosts();
  if (state.gold < cost.awakeningGold || (state.bossMedal || 0) < cost.awakeningMedal) return log('각성 재화가 부족합니다.', 'warn');
  state.gold -= cost.awakeningGold;
  state.bossMedal -= cost.awakeningMedal;
  state.awakeningLv = (state.awakeningLv || 0) + 1;
  state.hp = getMaxHp();
  createSparkBurst('buff', 24);
  log(`각성 코어 Lv.${state.awakeningLv} 달성. 기본 전투력과 보상이 증가합니다.`, 'good');
  renderAll(); saveGame(); startLoops();
}

function upgradeTranscend() {
  const cost = upgradeCosts();
  if (state.soul < cost.transcendSoul || state.rune < cost.transcendRune) return log('초월 재화가 부족합니다.', 'warn');
  state.soul -= cost.transcendSoul;
  state.rune -= cost.transcendRune;
  state.transcendLv = (state.transcendLv || 0) + 1;
  state.hp = getMaxHp(); state.mp = getMaxMp();
  createSparkBurst('mana', 26);
  log(`초월 회로 Lv.${state.transcendLv} 달성. 스킬 위력과 마나 운용이 강화됩니다.`, 'good');
  renderAll(); saveGame(); startLoops();
}

function upgradeLimitBreak() {
  const cost = upgradeCosts();
  if ((state.bossMedal || 0) < cost.limitBossMedal || state.gold < cost.limitGold) return log('한계돌파 재화가 부족합니다.', 'warn');
  state.bossMedal -= cost.limitBossMedal;
  state.gold -= cost.limitGold;
  state.limitBreakLv = (state.limitBreakLv || 0) + 1;
  state.hp = getMaxHp();
  createBossDefeatFx();
  log(`한계돌파 인장 Lv.${state.limitBreakLv} 달성. 보스전 돌파력이 강화됩니다.`, 'good');
  renderAll(); saveGame(); startLoops();
}

function buyUpgrade(type) {
  const cost = upgradeCosts();
  if (type === 'power') { if (!pay('gold', cost.power)) return; state.power += 3; state.coreLv++; }
  if (type === 'powerMult') { if (state.gold < cost.powerMultGold || state.rune < cost.powerMultRune) return log('기본 피해 배수 강화 재화가 부족합니다.', 'warn'); state.gold -= cost.powerMultGold; state.rune -= cost.powerMultRune; state.powerMultLv++; }
  if (type === 'speed') { if (!pay('gold', cost.speed)) return; state.speed++; startLoops(); }
  if (type === 'hp') { if (!pay('dust', cost.hp)) return; state.hpLv++; state.maxHp += 35; state.hp = getMaxHp(); }
  if (type === 'defense') { if (!pay('dust', cost.defense)) return; state.defenseLv = (state.defenseLv || 1) + 1; state.defense = (state.defense || 0) + 12; }
  if (type === 'defenseMult') { if (state.dust < cost.defenseMultDust || state.rune < cost.defenseMultRune) return log('방어 배수 강화 재화가 부족합니다.', 'warn'); state.dust -= cost.defenseMultDust; state.rune -= cost.defenseMultRune; state.defenseMultLv = (state.defenseMultLv || 0) + 1; }
  if (type === 'hpMult') { if (state.dust < cost.hpMultDust || state.soul < cost.hpMultSoul) return log('체력 배수 강화 재화가 부족합니다.', 'warn'); state.dust -= cost.hpMultDust; state.soul -= cost.hpMultSoul; state.hpMultLv++; state.hp = getMaxHp(); }
  if (type === 'mp') { if (!pay('manaCrystal', cost.mp)) return; state.mpLv++; state.maxMp += 18; state.mp = getMaxMp(); }
  if (type === 'crit') { if (!pay('rune', cost.crit)) return; state.crit = Math.min(80, state.crit + 3); }
  if (type === 'grade') {
    if (state.grade >= grades.length - 1) return log('이미 최고 등급입니다.', 'warn');
    if (state.gold < cost.gradeGold || state.dust < cost.gradeDust) return log('승급 재화가 부족합니다.', 'warn');
    state.gold -= cost.gradeGold;
    state.dust -= cost.gradeDust;
    state.grade++;
  }
  log('기본 성장을 강화했습니다.', 'good');
  renderAll();
  saveGame();
}

function challengeBoss() {
  if (state.boss) return log('이미 보스와 전투 중입니다.', 'warn');
  syncBossSelectionForCurrentField();
  const boss = currentBoss();
  if (state.field !== 'normal' && boss.fieldKey !== state.field) {
    syncBossSelectionForCurrentField();
    return log(`${fields[state.field].label}에서는 해당 특별 전장 전용 보스만 도전할 수 있습니다.`, 'warn');
  }
  if (state.field === 'normal' && boss.fieldKey) {
    syncBossSelectionForCurrentField();
    return log('일반 전장에서는 지역 보스만 도전할 수 있습니다.', 'warn');
  }
  if (state.stage < boss.minStage) return log(`${boss.name}은 ${boss.minStage}스테이지부터 도전할 수 있습니다.`, 'warn');
  const time = currentBossTimeLimit();
  state.boss = true;
  state.reflectLockUntil = 0;
  state.bossAttempts = (state.bossAttempts || 0) + 1;
  state.bossPhase = 1;
  state.bossTimeLeft = time.seconds;
  state.dungeonTimer = 0;
  spawnEnemy();
  log(`보스 도전! ${boss.name} / 제한 시간 ${time.label} / ${currentBossDifficulty().label} 난이도`, 'bad');
  renderAll();
  saveGame();
}


function selectBossDifficulty(key) {
  if (!bossDifficulties[key]) return;
  if (state.boss) return log('보스전 중에는 난이도를 변경할 수 없습니다.', 'warn');
  state.bossDifficulty = key;
  log(`보스 난이도 선택: ${bossDifficulties[key].label}`, 'good');
  renderAll();
  saveGame();
}

function selectBossTimeLimit(key) {
  if (!bossTimeLimits[key]) return;
  if (state.boss) return log('보스전 중에는 제한 시간을 변경할 수 없습니다.', 'warn');
  state.bossTimeLimit = key;
  log(`보스 제한 시간 선택: ${bossTimeLimits[key].label}`, 'good');
  renderAll();
  saveGame();
}

function selectBossArena(key) {
  // 보스전 전장 선택은 폐지되었습니다. 보스별 고유 배경만 자동 적용됩니다.
  return log('보스전 전장 선택은 삭제되었습니다. 보스를 직접 선택해 도전하세요.', 'warn');
}

function selectBoss(index) {
  const boss = bosses[index];
  if (!boss) return;
  if (state.field !== 'normal' && boss.fieldKey !== state.field) return log(`${fields[state.field].label}에서는 이 보스를 선택할 수 없습니다.`, 'warn');
  if (state.field === 'normal' && boss.fieldKey) return log('일반 전장에서는 지역 보스만 선택할 수 있습니다.', 'warn');
  if (state.stage < boss.minStage) return log(`${boss.name}은 ${boss.minStage}스테이지부터 도전할 수 있습니다.`, 'warn');
  if (state.boss) return log('보스전 중에는 보스를 변경할 수 없습니다.', 'warn');
  state.bossIndex = index;
  if (boss.defaultArena && bossArenas[boss.defaultArena]) state.bossArena = boss.defaultArena;
  log(`보스 선택: ${boss.name}`, 'good');
  renderAll();
  saveGame();
}

function enterField(key) {
  if (!fields[key]) return log('존재하지 않는 전장입니다.', 'warn');
  const targetField = fields[key];
  const requiredStage = targetField.minStage || 1;
  if (key !== 'normal' && state.stage < requiredStage) {
    return log(`${targetField.label}은 ${requiredStage}스테이지부터 입장할 수 있습니다.`, 'warn');
  }
  const previousField = state.field;
  state.field = key;
  if (previousField === 'barrierCity' || key !== previousField) {
    state.enemyBaseAtk = 0;
    state.bossBaseAtk = 0;
    state.dungeonTimer = 0;
    state.summonPressure = 0;
    state.specialAtkRamp = 0;
  }
  resetFieldRotation(key);
  state.boss = false;
  state.reflectLockUntil = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.bossPhase = 1;
  state.dungeonStreak = 0;
  state.dungeonTimer = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.enemy = null;
  state.enemyHp = 0;
  state.enemyMaxHp = 0;

  // 일반 전장으로 돌아오면 특별 전장 보스 선택값을 즉시 해제합니다.
  // 특별 전장으로 들어가면 해당 전장 전용 보스를 미리 선택해 둡니다.
  syncBossSelectionForCurrentField();

  spawnEnemy();
  log(`${fields[key].label}에 입장했습니다.`, 'good');
  renderAll();
  saveGame();
}



function grantTestResources() {
  if (state.testRewardUsed) return log('테스트 보상은 이미 사용했습니다.', 'warn');
  const amount = 100000000;
  ['gold', 'manaCrystal', 'soul', 'dust', 'rune', 'bossMedal'].forEach(key => {
    state[key] = (state[key] || 0) + amount;
  });
  state.testRewardUsed = true;
  log('테스트 보상 지급: 모든 재화 +1억. 테스트 버튼은 이제 사라집니다.', 'good');
  renderAll();
  saveGame();
}

function toggleAuto() {
  autoOn = !autoOn;
  document.getElementById('autoButton').textContent = autoOn ? '자동 전투 ON' : '자동 전투 OFF';
  startLoops();
}

function resetGame() {
  if (!confirm('저장된 진행을 모두 초기화할까요?')) return;
  localStorage.removeItem('artifactCoreRpgFull');
  localStorage.removeItem('artifactCoreRpgFullRemake');
  state = defaultState();
  spawnEnemy();
  document.getElementById('logBox').innerHTML = '';
  renderAll();
  startLoops();
  log('게임을 초기화했습니다.', 'warn');
}

function rebirthPreview() {
  const stageScore = Math.max(0, (state.stage || 1) - 24);
  const waveScore = Math.floor((typeof normalStageWave === 'function' ? normalStageWave() : state.stageWave || 1) / 3);
  const bossScore = (state.bossWins || 0) * 2;
  const gradeScore = (state.grade || 0) * 2;
  const growthScore = Math.floor(((state.awakeningLv || 0) + (state.transcendLv || 0) + (state.limitBreakLv || 0)) / 2);
  const bestBonus = Math.floor(Math.max(0, (state.bestStage || state.stage || 1) - 25) / 4);
  return Math.max(1, Math.floor(stageScore + waveScore + bossScore + gradeScore + growthScore + bestBonus));
}

function prestige() {
  if (state.stage < 25) return log('환생은 25스테이지부터 가능합니다.', 'warn');
  const gained = rebirthPreview();
  const keep = {
    rebirthCount: (state.rebirthCount || 0) + 1,
    rebirthPoints: (state.rebirthPoints || 0) + gained,
    rebirthTraitLevels: state.rebirthTraitLevels,
    highestRebirthGain: Math.max(state.highestRebirthGain || 0, gained),
    bestStage: Math.max(state.bestStage || 1, state.stage || 1),
    weaponOwned: state.weaponOwned,
    weaponLevels: state.weaponLevels,
    equippedWeapon: state.equippedWeapon,
    passiveLevels: state.passiveLevels,
    categoryLevels: state.categoryLevels,
    bossWins: state.bossWins || 0,
    bossFails: state.bossFails || 0,
    testRewardUsed: state.testRewardUsed,
    advanced: state.advanced,
  };
  const startStage = Math.max(1, 1 + rebirthStartStageBonus());
  state = defaultState();
  Object.assign(state, keep);
  state.stage = startStage;
  state.stageWave = 1;
  state.field = 'normal';
  state.hp = getMaxHp();
  state.mp = getMaxMp();
  spawnEnemy();
  startLoops();
  renderAll();
  log(`환생 완료. 윤회석 ${fmt(gained)} 획득! 무기고, 패시브, 분야 강화, 환생 특성은 유지됩니다.`, 'good');
  saveGame();
}

function rebirthTraitCost(index) {
  const level = state.rebirthTraitLevels[index] || 0;
  return Math.floor(1 + index * 0.7 + Math.pow(level + 1, 1.45));
}

function upgradeRebirthTrait(index) {
  const trait = rebirthTraits[index];
  if (!trait) return;
  const cost = rebirthTraitCost(index);
  if ((state.rebirthPoints || 0) < cost) return log(`윤회석이 부족합니다. 필요: ${fmt(cost)}`, 'warn');
  state.rebirthPoints -= cost;
  state.rebirthTraitLevels[index] = (state.rebirthTraitLevels[index] || 0) + 1;
  state.hp = Math.min(getMaxHp(), state.hp + Math.floor(getMaxHp() * 0.08));
  state.mp = Math.min(getMaxMp(), state.mp + Math.floor(getMaxMp() * 0.08));
  log(`${trait.name} Lv.${state.rebirthTraitLevels[index]} 달성. 영구 환생 특성이 강화되었습니다.`, 'good');
  renderAll();
  saveGame();
}

function weaponCostText(cost) { return Object.entries(cost).map(([k, v]) => `${resourceName(k)} ${fmt(v)}`).join(' / '); }
function canPayCost(cost) { return Object.entries(cost).every(([k, v]) => state[k] >= v); }
function payCost(cost) { if (!canPayCost(cost)) return false; Object.entries(cost).forEach(([k, v]) => { state[k] -= v; }); return true; }
function unlockWeapon(id) {
  if (state.weaponOwned[id]) return log('이미 보유한 무기입니다.', 'warn');
  if (!payCost(weapons[id].cost)) return log('무기 해금 재화가 부족합니다.', 'warn');
  state.weaponOwned[id] = true;
  state.weaponLevels[id] = 1;
  log(`무기 해금: ${weapons[id].name}`, 'good');
  renderAll(); saveGame();
}
function equipWeapon(id) {
  if (!state.weaponOwned[id]) return log('보유하지 않은 무기입니다.', 'warn');
  state.equippedWeapon = id;
  state.hp = Math.min(state.hp, getMaxHp());
  state.mp = Math.min(state.mp, getMaxMp());
  log(`무기 장착: ${weapons[id].name}`, 'good');
  startLoops(); renderAll(); saveGame();
}
function upgradeWeapon(id) {
  if (!state.weaponOwned[id]) return log('먼저 무기를 해금해야 합니다.', 'warn');
  const level = weaponLevel(id);
  const cost = { gold: Math.floor(90 * Math.pow(1.22, level + id)), dust: Math.floor(8 + level * 3 + id * 4), rune: Math.floor(3 + level + id) };
  if (!payCost(cost)) return log('무기 강화 재화가 부족합니다.', 'warn');
  state.weaponLevels[id]++;
  log(`${weapons[id].name} Lv.${state.weaponLevels[id]} 강화 완료`, 'good');
  startLoops(); renderAll(); saveGame();
}

function renderAllBase() {
  renderBattle();
  renderUpgrades();
  renderAscension();
  renderPrestige();
  renderFields();
  renderBossPanel();
  renderSkillModeTabs();
  renderSkillSlots();
  renderAutoSkillPanel();
  renderCategoryTabs();
  renderSkills();
  renderCategoryUpgrades();
  renderPassives();
  renderAutoHeal();
  renderWeapons();
}

function renderBattle() {
  if (state && state.enemy && state.enemyHp <= 0 && !state.resolvingEnemyDefeat) {
    if (forceResolveEnemyDefeat('renderBattle')) return renderBattle();
  }
  const field = fields[state.field] || fields.normal;
  const enemy = state.enemy || field.pool[0];
  const arenaClass = state.boss ? currentBossArena().cls : (state.field === 'normal' ? currentNormalRegionKey() : field.cls);
  document.getElementById('arena').className = 'arena ' + arenaClass;
  document.getElementById('stageLabel').textContent = state.boss ? `${currentBossArena().label} / ${enemy.name}` : (state.field === 'normal' ? `${field.label} 스테이지 ${state.stage} · ${normalStageWave()}/${stageWaveCap()}` : `${field.label} ${state.stage}`);
  document.getElementById('resourceBox').innerHTML = [
    ['골드', state.gold], ['마나수정', state.manaCrystal], ['영혼석', state.soul], ['유물가루', state.dust], ['룬조각', state.rune], ['보스메달', state.bossMedal || 0], ['윤회석', state.rebirthPoints || 0], ['초당 피해', dps()], ['방어력', getDefense()], ['방어 감소', Math.round(defenseReductionRate()*100) + '%'], ['핵 레벨', state.coreLv]
  ].map(([label, value]) => `<div class="resource"><span>${label}</span><b>${fmt(value)}</b></div>`).join('');
  document.getElementById('hpText').textContent = `${fmt(state.hp)} / ${fmt(getMaxHp())}`;
  document.getElementById('mpText').textContent = `${fmt(state.mp)} / ${fmt(getMaxMp())}`;
  document.getElementById('hpBar').style.width = Math.max(0, state.hp / getMaxHp() * 100) + '%';
  document.getElementById('mpBar').style.width = Math.max(0, state.mp / getMaxMp() * 100) + '%';
  document.getElementById('enemyName').textContent = enemy.name;
  document.getElementById('enemyName2').textContent = enemy.name;
  document.getElementById('enemyIcon').textContent = enemy.icon;
  const mechanicText = state.boss ? `보스전 ${currentBossDifficulty().label} / ${state.bossPhase || 1}페이즈 / 남은 시간 ${state.bossTimeLeft || 0}초 / 실패 ${state.bossFails || 0} / 승리 ${state.bossWins || 0}` : (state.field === 'normal' ? `스테이지 ${state.stage} · ${normalStageWave()}/${stageWaveCap()} · ${normalStageRankText()} · 개방 지역 ${normalStageUnlockRegionCount()}/${regionOrder.length}` : dungeonMechanicText());
  const enemyHits = getEnemyAttackCount(enemy.mechanic || currentField().mechanic);
  document.getElementById('enemyTrait').textContent = `${enemy.trait} / 공격력 ${state.enemyAtk} / 공격횟수 ${enemyHits}회 / 방어력 ${fmt(getDefense())} / 보호막 ${fmt(state.shield)} / ${mechanicText} / 장착 ${equippedWeapon().name}`;
  const activeBar = currentEnemyBar();
  const activeBarHp = currentEnemyBarHp();
  const activeBarRatio = state.enemyBarHp ? activeBarHp / state.enemyBarHp : 0;
  document.getElementById('enemyHpText').textContent = `HP ${fmt(activeBarHp)} / ${fmt(state.enemyBarHp || state.enemyMaxHp)} · 총 ${fmt(Math.max(0, state.enemyHp))}`;
  const badge = document.getElementById('enemyBarCountBadge');
  if (badge) badge.textContent = `x${activeBar}`;
  const enemyHpBar = document.getElementById('enemyHpBar');
  enemyHpBar.className = 'fill enemyhp ' + enemyHpColorClass(enemy);
  enemyHpBar.style.width = Math.max(0, activeBarRatio * 100) + '%';
  renderEnemyMultiBars(activeBar);
  document.getElementById('coreIcon').textContent = grade().icon;
  const testButton = document.getElementById('testButton');
  if (testButton) testButton.style.display = state.testRewardUsed ? 'none' : '';
  state.skillSlots.forEach((skillId, i) => {
    const btn = document.getElementById(`slotButton${i}`);
    if (!btn) return;
    const skill = skills[skillId];
    const cd = state.skillCooldowns[i] || 0;
    btn.textContent = skill ? `${i + 1}. ${skill.name}${cd ? ` (${cd})` : ''}` : `스킬 ${i + 1}`;
  });
}

function enemyHpColorClass(enemy) {
  if (state.boss) return 'hp-boss hp-' + ((currentBoss()?.element || '').includes('시간') ? 'time' : (currentBoss()?.element || '').includes('화염') ? 'fire' : (currentBoss()?.element || '').includes('얼음') ? 'ice' : (currentBoss()?.element || '').includes('공허') ? 'void' : (currentBoss()?.element || '').includes('암흑') ? 'dark' : 'boss');
  const element = String(enemy?.element || enemy?.trait || enemy?.mechanic || '').toLowerCase();
  const grade = enemy?.grade === '정예' ? ' hp-elite' : '';
  let cls = 'hp-normal';
  if (element.includes('화염') || element.includes('burn') || element.includes('fire')) cls = 'hp-fire';
  else if (element.includes('얼음') || element.includes('ice') || element.includes('서리')) cls = 'hp-ice';
  else if (element.includes('독') || element.includes('poison')) cls = 'hp-poison';
  else if (element.includes('번개') || element.includes('shock') || element.includes('전기')) cls = 'hp-lightning';
  else if (element.includes('암흑') || element.includes('언데드') || element.includes('저주')) cls = 'hp-dark';
  else if (element.includes('공허') || element.includes('void')) cls = 'hp-void';
  else if (element.includes('자연') || element.includes('생명')) cls = 'hp-nature';
  else if (element.includes('대지') || element.includes('금속')) cls = 'hp-earth';
  else if (element.includes('물') || element.includes('해저')) cls = 'hp-water';
  else if (element.includes('시간')) cls = 'hp-time';
  return cls + grade;
}

function renderEnemyMultiBars(activeBar) {
  const box = document.getElementById('enemyMultiBars');
  if (!box) return;
  const total = Math.max(1, state.enemyBarCount || 1);
  const left = Math.max(0, activeBar - 1);
  const inv = state.enemyInvincibleHits > 0 ? '<span class="hp-status invincible">무적</span>' : '';
  box.innerHTML = `<span class="hp-stack-summary">남은 체력바 x${activeBar} / 전체 x${total}</span>${inv}<span class="hp-stack-mini">소진 ${Math.max(0, total - activeBar)}줄 · 예비 ${left}줄</span>`;
}

function dungeonMechanicText() {
  const mechanic = currentField().mechanic;
  if (mechanic === 'reflect') return '메커니즘: 쿨다운형 피해 반사';
  if (mechanic === 'noAutoHeal') return '메커니즘: 자동 힐 봉인';
  if (mechanic === 'timePressure') return `메커니즘: 시간 압박 ${state.dungeonTimer || 0}`;
  if (mechanic === 'jackpot') return '메커니즘: 보상 도박';
  if (mechanic === 'streak') return `메커니즘: 연전 ${state.dungeonStreak || 0}`;
  return '일반 규칙';
}

function renderBossPanel() {
  const difficultyBox = document.getElementById('bossDifficultyList');
  const timeBox = document.getElementById('bossTimeLimitList');
  const bossBox = document.getElementById('bossList');
  if (!bossBox) return;
  if (difficultyBox) {
    difficultyBox.innerHTML = Object.entries(bossDifficulties).map(([key, difficulty]) => `<div class="item ${state.bossDifficulty === key ? 'equipped' : ''}">
      <b>${difficulty.label} 난이도</b><br>
      <span class="small">${difficulty.desc}</span><br>
      <span class="chip">체력 x${difficulty.hp}</span><span class="chip">공격 x${difficulty.atk}</span><span class="chip">보상 x${difficulty.reward}</span><span class="chip">메달 +${difficulty.medal}</span>
      <button ${state.boss ? 'disabled' : ''} onclick="selectBossDifficulty('${key}')">${state.bossDifficulty === key ? '선택 중' : '난이도 선택'}</button>
    </div>`).join('');
  }
  if (timeBox) {
    timeBox.innerHTML = Object.entries(bossTimeLimits).map(([key, time]) => `<div class="item ${state.bossTimeLimit === key ? 'equipped' : ''}">
      <b>${time.label} 제한</b><br>
      <span class="small">${time.desc}</span><br>
      <span class="chip">시간 ${time.seconds}초</span><span class="chip">보상 x${time.reward}</span><span class="chip">추가 메달 +${time.medal}</span>
      <button ${state.boss ? 'disabled' : ''} onclick="selectBossTimeLimit('${key}')">${state.bossTimeLimit === key ? '선택 중' : '시간 선택'}</button>
    </div>`).join('');
  }
  syncBossSelectionForCurrentField();
  const visibleBosses = availableBossEntriesForCurrentField();
  const bossHeader = state.field === 'normal'
    ? '<div class="item"><b>일반 전장 지역 보스</b><br><span class="small">현재 일반 전장에서는 지역 보스만 선택할 수 있습니다. 특별 전장 전용 보스는 해당 특별 전장에 입장해야 표시됩니다.</span></div>'
    : `<div class="item"><b>${fields[state.field].label} 전용 보스</b><br><span class="small">현재 특별 전장에서는 이 전장에 연결된 전용 보스만 선택하고 도전할 수 있습니다.</span></div>`;
  bossBox.innerHTML = bossHeader + visibleBosses.map(({ boss, index }) => {
    const locked = state.stage < boss.minStage;
    const difficulty = currentBossDifficulty();
    const arena = bossArenas[boss.defaultArena] || bossArenas.meadowBoss;
    const time = currentBossTimeLimit();
    return `<div class="item ${state.bossIndex === index ? 'equipped' : ''} ${locked ? 'locked' : ''}">
      <b>${boss.icon} ${boss.name}</b><br>
      <span class="small">${boss.trait}</span><br>
      <span class="chip">필요 스테이지 ${boss.minStage}</span><span class="chip">배경 ${arena.label}</span><span class="chip">제한 ${time.label}</span><span class="chip">체력 x${(boss.hp * difficulty.hp).toFixed(1)}</span><span class="chip">공격 x${(boss.atk * difficulty.atk).toFixed(1)}</span><span class="chip">보상 x${(boss.rewardMult * difficulty.reward * time.reward).toFixed(1)}</span><span class="chip">기믹 ${mechanicName(boss.mechanic)}</span>
      <div class="grid2"><button ${locked ? 'disabled' : ''} onclick="selectBoss(${index})">${state.bossIndex === index ? '선택 중' : '보스 선택'}</button><button class="red-btn" ${locked ? 'disabled' : ''} onclick="selectBoss(${index});challengeBoss();">시간 제한 도전</button></div>
    </div>`;
  }).join('');
}


function makeBulkButtons(handlerName, argText = '', enabled = true, labels = BULK_LEVEL_BUTTONS) {
  return `<div class="bulk-row">${labels.map(count => `<button ${enabled ? '' : 'disabled'} onclick="${handlerName}(${argText}${argText ? ',' : ''}${count})">+${count}</button>`).join('')}<button ${enabled ? '' : 'disabled'} onclick="${handlerName}(${argText}${argText ? ',' : ''}999999)">최대</button></div>`;
}

function upgradeGenericMany(action, count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = snapshotResourcesAndLevels();
    buyUpgrade(action);
    if (snapshotResourcesAndLevels() === before) break;
    done++;
  }
  if (done > 1) log(`${done}회 연속 강화 완료`, 'good');
}

function snapshotResourcesAndLevels() {
  return [state.gold, state.manaCrystal, state.soul, state.dust, state.rune, state.bossMedal, state.coreLv, state.speed, state.hpLv, state.mpLv, state.defenseLv, state.defense, state.powerMultLv, state.hpMultLv, state.defenseMultLv, state.crit, state.grade, state.awakeningLv, state.transcendLv, state.limitBreakLv].join('|');
}

function upgradeCategoryMany(categoryIndex, count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.categoryLevels[categoryIndex] || 0;
    upgradeCategory(categoryIndex);
    if ((state.categoryLevels[categoryIndex] || 0) === before) break;
    done++;
  }
  if (done > 1) log(`${skillCategories[categoryIndex].name} 분야 ${done}회 강화 완료`, 'good');
}

function upgradePassiveMany(index, count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.passiveLevels[index] || 0;
    upgradePassive(index);
    if ((state.passiveLevels[index] || 0) === before) break;
    done++;
  }
  if (done > 1) log(`${passiveSkills[index].name} ${done}회 레벨업 완료`, 'good');
}

function upgradeAutoHealMany(count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.autoHealLevel || 0;
    upgradeAutoHeal();
    if ((state.autoHealLevel || 0) === before) break;
    done++;
  }
  if (done > 1) log(`자동 힐 ${done}회 레벨업 완료`, 'good');
}

function upgradeWeaponMany(id, count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = weaponLevel(id);
    upgradeWeapon(id);
    if (weaponLevel(id) === before) break;
    done++;
  }
  if (done > 1) log(`${weapons[id].name} ${done}회 강화 완료`, 'good');
}

function upgradeAwakeningMany(count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.awakeningLv || 0;
    upgradeAwakening();
    if ((state.awakeningLv || 0) === before) break;
    done++;
  }
  if (done > 1) log(`각성 ${done}회 강화 완료`, 'good');
}
function upgradeTranscendMany(count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.transcendLv || 0;
    upgradeTranscend();
    if ((state.transcendLv || 0) === before) break;
    done++;
  }
  if (done > 1) log(`초월 ${done}회 강화 완료`, 'good');
}
function upgradeLimitBreakMany(count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.limitBreakLv || 0;
    upgradeLimitBreak();
    if ((state.limitBreakLv || 0) === before) break;
    done++;
  }
  if (done > 1) log(`한계돌파 ${done}회 강화 완료`, 'good');
}

function upgradeRebirthTraitMany(index, count) {
  count = Math.max(1, Math.floor(Number(count) || 1));
  let done = 0;
  for (let i = 0; i < count; i++) {
    const before = state.rebirthTraitLevels[index] || 0;
    upgradeRebirthTrait(index);
    if ((state.rebirthTraitLevels[index] || 0) === before) break;
    done++;
  }
  if (done > 1) log(`${rebirthTraits[index].name} ${done}회 강화 완료`, 'good');
}

function upgradeRebirthTraitMax(index) {
  let done = 0;
  while (done < 10000) {
    const before = state.rebirthTraitLevels[index] || 0;
    upgradeRebirthTrait(index);
    if ((state.rebirthTraitLevels[index] || 0) === before) break;
    done++;
  }
  if (done > 0) log(`${rebirthTraits[index].name} 최대 강화 ${done}회 완료`, 'good');
}

function upgradeAllRebirthTraitsEvenly() {
  let totalDone = 0;
  while (totalDone < 10000) {
    const minLevel = Math.min(...rebirthTraits.map((_, i) => state.rebirthTraitLevels[i] || 0));
    const candidates = rebirthTraits
      .map((_, i) => i)
      .filter(i => (state.rebirthTraitLevels[i] || 0) === minLevel)
      .sort((a, b) => rebirthTraitCost(a) - rebirthTraitCost(b));
    let upgraded = false;
    for (const index of candidates) {
      const cost = rebirthTraitCost(index);
      if ((state.rebirthPoints || 0) >= cost) {
        state.rebirthPoints -= cost;
        state.rebirthTraitLevels[index] = (state.rebirthTraitLevels[index] || 0) + 1;
        totalDone++;
        upgraded = true;
        break;
      }
    }
    if (!upgraded) break;
  }
  if (totalDone > 0) {
    state.hp = Math.min(getMaxHp(), state.hp + Math.floor(getMaxHp() * 0.08));
    state.mp = Math.min(getMaxMp(), state.mp + Math.floor(getMaxMp() * 0.08));
    log(`환생 영구 특성 균등 강화 ${totalDone}회 완료`, 'good');
    renderAll();
    saveGame();
  } else {
    log(`${REBIRTH_POINT_NAME}이 부족해 균등 강화를 진행할 수 없습니다.`, 'warn');
  }
}

function renderUpgrades() {
  const c = upgradeCosts();
  document.getElementById('upgradeList').innerHTML = [
    item('기본 피해 더하기 강화', `기본 피해 +3. 현재 기본 피해 수치: ${fmt(state.power)} / 비용: 골드 ${fmt(c.power)}`, `buyUpgrade('power')`),
    item('기본 피해 배수 강화', `현재 Lv.${state.powerMultLv || 0}, 배수 x${powerMultiplier().toFixed(2)} / 비용: 골드 ${fmt(c.powerMultGold)} + 룬조각 ${fmt(c.powerMultRune)}`, `buyUpgrade('powerMult')`, 'purple-btn'),
    item('발사 속도 훈련', `자동 공격 주기 감소. 비용: 골드 ${fmt(c.speed)}`, `buyUpgrade('speed')`),
    item('체력 더하기 강화', `최대 체력 +35. 현재 기본 체력: ${fmt(state.maxHp)} / 비용: 유물가루 ${fmt(c.hp)}`, `buyUpgrade('hp')`, 'red-btn'),
    item('체력 배수 강화', `현재 Lv.${state.hpMultLv || 0}, 배수 x${hpMultiplier().toFixed(2)} / 비용: 유물가루 ${fmt(c.hpMultDust)} + 영혼석 ${fmt(c.hpMultSoul)}`, `buyUpgrade('hpMult')`, 'purple-btn'),
    item('방어력 더하기 강화', `방어력 +12. 현재 방어력: ${fmt(getDefense())} / 피해 감소율 ${Math.round(defenseReductionRate()*100)}% / 비용: 유물가루 ${fmt(c.defense)}`, `buyUpgrade('defense')`, 'cyan-btn'),
    item('방어력 배수 강화', `현재 Lv.${state.defenseMultLv || 0}, 배수 x${defenseMultiplier().toFixed(2)} / 비용: 유물가루 ${fmt(c.defenseMultDust)} + 룬조각 ${fmt(c.defenseMultRune)}`, `buyUpgrade('defenseMult')`, 'purple-btn'),
    item('마나 회로', `최대 마나 +18. 비용: 마나수정 ${fmt(c.mp)}`, `buyUpgrade('mp')`, 'cyan-btn'),
    item('치명 각인', `치명타 확률 +3%. 비용: 룬조각 ${fmt(c.crit)}`, `buyUpgrade('crit')`),
    item('유물 핵 승급', state.grade >= grades.length - 1 ? '최고 등급' : `비용: 골드 ${fmt(c.gradeGold)} / 유물가루 ${fmt(c.gradeDust)}`, `buyUpgrade('grade')`, 'gold-btn'),
    item('환생하기', `25스테이지부터 가능. 예상 윤회석 ${fmt(rebirthPreview())}. 기본 성장은 초기화되고 무기고·패시브·분야 강화·환생 특성은 유지됩니다.`, 'prestige()', 'dark-btn'),
  ].join('');
}

function renderPrestige() {
  const box = document.getElementById('prestigePanel');
  if (!box) return;
  const preview = rebirthPreview();
  box.innerHTML = `
    <div class="menu-section">
      <div class="menu-title"><h2>환생 리메이크</h2><b>영구 특성</b></div>
      <p class="small">환생은 25스테이지부터 가능합니다. 환생하면 기본 피해, 체력, 마나, 등급, 스테이지 진행은 초기화되지만 무기고, 패시브, 분야 강화, 보스 기록, 환생 특성은 유지됩니다. 높은 스테이지와 보스 승리 기록일수록 ${REBIRTH_POINT_NAME}을 더 많이 얻습니다.</p>
    </div>
    <div class="grid2">
      <div class="item"><b>환생 정보</b><br><span class="small">환생 횟수 ${fmt(state.rebirthCount || 0)}회 / 보유 ${REBIRTH_POINT_NAME} ${fmt(state.rebirthPoints || 0)} / 이번 예상 획득 ${fmt(preview)} / 최고 획득 ${fmt(state.highestRebirthGain || 0)}</span><button class="dark-btn" onclick="prestige()">환생 실행</button></div>
      <div class="item"><b>현재 환생 보정</b><br><span class="small">피해 x${rebirthDamageBonus().toFixed(2)} / 체력 x${rebirthHpBonus().toFixed(2)} / 마나 x${rebirthMpBonus().toFixed(2)} / 보상 +${Math.round(rebirthRewardBonus()*100)}% / 시작 스테이지 +${rebirthStartStageBonus()}</span><button class="purple-btn" onclick="upgradeAllRebirthTraitsEvenly()">전체 균등 강화</button></div>
    </div>
    <div class="grid2">
      ${rebirthTraits.map((trait, index) => {
        const level = state.rebirthTraitLevels[index] || 0;
        const cost = rebirthTraitCost(index);
        return `<div class="item"><b>${trait.name} Lv.${level}</b><br><span class="small">${trait.desc}</span><br><span class="chip">1회 비용 ${fmt(cost)} ${REBIRTH_POINT_NAME}</span><span class="chip">영구 적용</span>
          <div class="level-buttons">
            <button class="purple-btn" onclick="upgradeRebirthTraitMany(${index},1)">+1</button>
            <button class="purple-btn" onclick="upgradeRebirthTraitMany(${index},10)">+10</button>
            <button class="purple-btn" onclick="upgradeRebirthTraitMany(${index},50)">+50</button>
            <button class="purple-btn" onclick="upgradeRebirthTraitMany(${index},100)">+100</button>
            <button class="gold-btn" onclick="upgradeRebirthTraitMax(${index})">최대</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function ascensionMilestoneText(kind, level) {
  const next = kind === 'limit' ? (Math.floor(level / 5) + 1) * 5 : (Math.floor(level / 10) + 1) * 10;
  return `다음 돌파 보너스 Lv.${next}`;
}
function renderAscension() {
  const box = document.getElementById('ascensionPanel');
  if (!box) return;
  const c = upgradeCosts();
  box.innerHTML = `
    <div class="menu-section">
      <div class="menu-title"><h2>상위 성장 리메이크</h2><b>각성 코어 · 초월 회로 · 한계돌파 인장</b></div>
      <p class="small">상위 성장은 역할을 분리했습니다. 각성은 기본 전투와 재화 기반, 초월은 스킬·마나 운용, 한계돌파는 보스전 폭발력을 담당합니다. 일정 레벨마다 추가 돌파 보너스가 붙습니다.</p>
    </div>
    <div class="grid2">
      <div class="item">
        <b>각성 코어 Lv.${awakeningLv()}</b><br>
        <span class="small">기본 피해, 최대 체력, 재화 보상을 고르게 올리는 균형 성장입니다. 일반/특별 전장 전체 효율이 좋아집니다.</span><br>
        <span class="chip">피해 x${awakeningBonus().toFixed(2)}</span><span class="chip">보상 +${Math.round(awakeningLv()*1.2)}%</span><span class="chip">${ascensionMilestoneText('awakening', awakeningLv())}</span><br>
        <span class="small">비용: 골드 ${fmt(c.awakeningGold)} / 보스메달 ${fmt(c.awakeningMedal)}</span>
        <button class="gold-btn" onclick="upgradeAwakening()">+1</button>${makeBulkButtons('upgradeAwakeningMany', '')}
      </div>
      <div class="item">
        <b>초월 회로 Lv.${transcendLv()}</b><br>
        <span class="small">스킬 위력, 최대 마나, 마나 회복, 보상 효율을 올리는 스킬 중심 성장입니다. 고레벨 스킬 운용에 가장 중요합니다.</span><br>
        <span class="chip">스킬 x${transcendSkillBonus().toFixed(2)}</span><span class="chip">마나 x${(1 + transcendLv()*0.07).toFixed(2)}</span><span class="chip">${ascensionMilestoneText('transcend', transcendLv())}</span><br>
        <span class="small">비용: 영혼석 ${fmt(c.transcendSoul)} / 룬조각 ${fmt(c.transcendRune)}</span>
        <button class="cyan-btn" onclick="upgradeTranscend()">+1</button>${makeBulkButtons('upgradeTranscendMany', '')}
      </div>
      <div class="item">
        <b>한계돌파 인장 Lv.${limitBreakLv()}</b><br>
        <span class="small">보스전 피해, 전체 피해 배율, 체력 배율, 치명타를 올리는 도전형 성장입니다. 보스 타임어택을 밀 때 효율이 큽니다.</span><br>
        <span class="chip">전체 피해 x${limitBreakBonus().toFixed(2)}</span><span class="chip">보스 추가 x${(1 + limitBreakLv()*0.10 + Math.floor(limitBreakLv()/5)*0.08).toFixed(2)}</span><span class="chip">치명 +${Math.round(limitBreakLv()*1.5)}%</span><br>
        <span class="small">비용: 보스메달 ${fmt(c.limitBossMedal)} / 골드 ${fmt(c.limitGold)}</span>
        <button class="purple-btn" onclick="upgradeLimitBreak()">+1</button>${makeBulkButtons('upgradeLimitBreakMany', '')}
      </div>
      <div class="item">
        <b>현재 종합 상위 보정</b><br>
        <span class="small">피해 배율 x${powerMultiplier().toFixed(2)} / 체력 배율 x${hpMultiplier().toFixed(2)} / 스킬 배율 x${transcendSkillBonus().toFixed(2)} / 보스 피해 x${limitBossBonus().toFixed(2)} / 치명 보너스 +${Math.round(passiveCritBonus())}%</span><br>
        <span class="small">추천 순서: 초반 각성 → 스킬 중심 초월 → 보스가 막힐 때 한계돌파</span>
      </div>
    </div>`;
}

function dungeonMechanicName(mechanic) {
  return { reflect: '쿨다운형 피해 반사', noAutoHeal: '자동 힐 봉인', timePressure: '시간 압박', jackpot: '잭팟 보상', streak: '연전 누적', unstableBrew:'무작위 연금 반응', stormChain:'연쇄 번개', gravityWell:'중력 지연', bloodDebt:'피의 대가', eclipseCycle:'월식 주기', overgrowth:'과성장 재생', voidForge:'공허 장갑', dreamShift:'꿈결 변동', barrierCity:'저주 결계', minorSkillSeal:'낮은 확률 봉인', fearDot:'공포 지속 피해', bleed:'출혈', defDown:'방어 저하', attackDown:'공격 약화', buffPurge:'버프 제거', execution:'처형', barrierShield:'결계 보호막', evolve:'진화', bindingWitch:'붉은 결속', domainDevour:'영역 포식', poison:'중독', strongPoison:'강한 중독', burn:'화상', slow:'둔화', armor:'방어 강화', evasion:'회피', regen:'재생', shield:'보호막', crit:'치명타', charge:'돌진', poisonField:'독 장판', bossRegen:'보스 재생', heatUp:'가열', freezeSlow:'빙결 둔화', accuracyDown:'명중률 감소', wave:'파도 공격', summonUndead:'언데드 소환', skillSeal:'스킬 봉인', timeDelay:'행동 지연' }[mechanic] || mechanic || '일반 규칙';
}

function specialMissionForField(key) {
  const field = fields[key];
  if (!field || key === 'normal') return null;
  const tier = specialFieldTier(key);
  const target = Math.max(6, Math.min(18, 5 + tier));
  const rewardKey = field.reward === 'mixed' ? 'gold' : field.reward;
  const rewardAmount = Math.floor((500 + tier * 180 + Math.max(0, (state.stage || 1) - fieldUnlockStage(field)) * 35) * (1 + (state.fieldMissionCompletions?.[key] || 0) * 0.08));
  return {
    target,
    rewardKey,
    rewardAmount,
    title: `${field.label} 정화 임무`,
    desc: `${field.label} 몬스터 ${target}마리 처치. 완료 시 ${resourceName(rewardKey)}와 보스메달을 얻습니다.`
  };
}
function fieldMissionProgress(key) {
  return Math.max(0, Number(state.fieldMissionProgress?.[key] || 0));
}
function recordSpecialMissionKill() {
  if (state.boss || state.field === 'normal') return;
  const key = state.field;
  const mission = specialMissionForField(key);
  if (!mission) return;
  if (!state.fieldMissionProgress) state.fieldMissionProgress = {};
  if (!state.fieldMissionCompletions) state.fieldMissionCompletions = {};
  state.fieldMissionProgress[key] = fieldMissionProgress(key) + 1;
  if (state.fieldMissionProgress[key] >= mission.target) {
    state.fieldMissionProgress[key] = 0;
    state.fieldMissionCompletions[key] = (state.fieldMissionCompletions[key] || 0) + 1;
    state[mission.rewardKey] = (state[mission.rewardKey] || 0) + mission.rewardAmount;
    state.bossMedal = (state.bossMedal || 0) + Math.max(1, Math.floor(specialFieldTier(key) / 4));
    createSparkBurst('resource', 22);
    log(`${mission.title} 완료! ${resourceName(mission.rewardKey)} +${fmt(mission.rewardAmount)}, 보스메달 보상 획득.`, 'good');
  }
}
function renderMissionLine(key) {
  const mission = specialMissionForField(key);
  if (!mission) return '';
  const progress = Math.min(mission.target, fieldMissionProgress(key));
  const clears = state.fieldMissionCompletions?.[key] || 0;
  return `<br><span class="chip">특수 미션: ${progress}/${mission.target}</span><span class="chip">완료 ${clears}회</span><br><span class="small"><b>미션:</b> ${mission.desc}</span>`;
}

function renderFields() {
  document.getElementById('fieldList').innerHTML = Object.entries(fields).map(([key, field]) => {
    const requiredStage = field.minStage || 1;
    const locked = key !== 'normal' && state.stage < requiredStage;
    return `
    <div class="item ${state.field === key ? 'equipped' : ''} ${locked ? 'locked' : ''}">
      <b>${field.label}</b><br>
      <span class="small">${field.desc}</span><br>
      <span class="chip">입장 조건: ${requiredStage}스테이지</span><span class="chip">보상: ${rewardLabel(field.reward)}</span><span class="chip">체력 x${field.hp}</span><span class="chip">공격 x${field.atk}</span><span class="chip">${key === 'normal' ? '스테이지 체력' : '특수 체력 Tier ' + specialFieldTier(key)}</span><span class="chip">${field.mechanic ? '특수: ' + dungeonMechanicName(field.mechanic) : '일반 규칙'}</span><br>
      <span class="small"><b>추천:</b> ${field.tip}</span>${renderMissionLine(key)}
      <button class="${key === 'normal' ? 'cyan-btn' : 'gold-btn'}" ${locked ? 'disabled' : ''} onclick="enterField('${key}')">${locked ? `${requiredStage}스테이지 필요` : (state.field === key ? '현재 전장' : '입장하기')}</button>
    </div>`;
  }).join('');
}
function rewardLabel(key) { return ({ mixed: '혼합 보상', gold: '골드', manaCrystal: '마나수정', soul: '영혼석', dust: '유물가루', rune: '룬조각' })[key] || key; }

function renderSkillModeTabs() {
  const modes = ['Loadout', 'Tree', 'Mastery', 'Passive', 'AutoHeal'];
  const map = { Loadout: 'loadout', Tree: 'tree', Mastery: 'mastery', Passive: 'passive', AutoHeal: 'autoHeal' };
  modes.forEach(label => {
    const mode = map[label];
    const btn = document.getElementById(`skillMode${label}`);
    const sec = document.getElementById(`skill${label}Section`);
    if (btn) btn.classList.toggle('active', skillMode === mode);
    if (sec) sec.classList.toggle('hidden', skillMode !== mode);
  });
}

function renderSkillSlots() {
  const box = document.getElementById('skillSlotList');
  if (!box) return;
  box.innerHTML = state.skillSlots.map((skillId, i) => {
    const skill = skills[skillId];
    if (!skill) return `<div class="item slot-card"><b>슬롯 ${i + 1}</b><br><span class="small">비어 있음</span></div>`;
    const level = Math.max(1, skillLevel(skillId));
    const cd = state.skillCooldowns[i] || 0;
    return `<div class="item slot-card equipped">
      <div class="slot-title"><span class="slot-number">슬롯 ${i + 1}</span><b>${skill.name}</b></div>
      <span class="small">${skill.categoryName} / ${skill.role}</span><br>
      <span class="chip">Lv.${Math.max(1, level)}</span><span class="chip">마나 ${skillManaCost(skill, level)}</span><span class="chip ${cd ? 'cooldown-chip' : ''}">쿨타임 ${cd}</span><br>
      <span class="small">${skill.description}</span>
      <button onclick="useSkillSlot(${i})">이 슬롯 사용</button>
    </div>`;
  }).join('');
}

function renderAutoSkillPanel() {
  const box = document.getElementById('autoSkillPanel');
  if (!box) return;
  box.innerHTML = `<div class="item auto-skill-box">
    <b>스킬 자동 사용</b><br>
    <span class="small">켜두면 3개 장착 슬롯을 순서대로 확인해, 마나가 충분하고 쿨타임이 끝난 스킬을 자동 발동합니다.</span><br>
    <span class="chip">상태: ${state.autoSkillEnabled ? 'ON' : 'OFF'}</span><span class="chip">순서: 슬롯 1 → 2 → 3</span>
    <button class="green-btn" onclick="toggleAutoSkill()">${state.autoSkillEnabled ? '자동 사용 끄기' : '자동 사용 켜기'}</button>
  </div>`;
}

function renderCategoryTabs() {
  const box = document.getElementById('skillCategoryTabs');
  if (!box) return;
  box.className = 'category-tab-bar';
  box.innerHTML = skillCategories.map((cat, i) => `<button class="${currentSkillCategory === i ? 'active' : ''}" onclick="setSkillCategory(${i})">${cat.name}</button>`).join('');
}

function renderSkills() {
  const box = document.getElementById('skillList');
  if (!box) return;
  const list = skills.filter(skill => skill.categoryIndex === currentSkillCategory);
  const resourcePanel = `<div class="item skill-resource-panel">
    <b>스킬 강화 재화</b><br>
    <span class="chip">골드 ${fmt(state.gold)}</span><span class="chip">룬조각 ${fmt(state.rune)}</span><span class="chip">마나수정 ${fmt(state.manaCrystal)}</span>
    <p class="small">10회, 50회, 100회 버튼은 현재 보유 재화로 가능한 만큼만 자동 적용됩니다. ‘다음 스킬’ 버튼은 이전 스킬을 Lv.50까지 올려 다음 스킬을 개방합니다.</p>
  </div>`;
  box.innerHTML = resourcePanel + `<div class="skill-path-title">${skillCategories[currentSkillCategory].name} 스킬트리</div>` + list.map(skill => {
    const level = skillLevel(skill.id);
    const shownLevel = Math.max(1, level);
    const unlocked = isSkillUnlocked(skill.id);
    const cost = skillLevelCost(skill.id);
    const cost10 = simulateSkillLevelCost(skill.id, 10).cost;
    const cost50 = simulateSkillLevelCost(skill.id, 50).cost;
    const cost100 = simulateSkillLevelCost(skill.id, 100).cost;
    const nextSkill = skills[skill.id + 1];
    const hasNextInCategory = nextSkill && nextSkill.categoryIndex === skill.categoryIndex;
    const needToNext = hasNextInCategory ? Math.max(0, SKILL_NEXT_UNLOCK_LEVEL - level) : 0;
    const nextText = hasNextInCategory
      ? (isSkillUnlocked(nextSkill.id) ? `다음 개방됨: ${nextSkill.name}` : `다음 스킬: ${nextSkill.name} / ${skill.name} Lv.50 필요 / 남은 레벨 ${needToNext}`)
      : '이 분야의 마지막 스킬';
    const prevText = skill.tierIndex === 0 ? '기본 개방' : `${skills[skill.id - 1].name} Lv.50 필요`;
    return `<div class="item ${unlocked ? '' : 'locked'}">
      <div class="skill-card remake">
        <div>
          <b>${skill.tier}. ${skill.name}</b><br>
          <span class="small">${unlocked ? skill.description : '잠김: ' + prevText}</span><br>
          <span class="chip">${skill.categoryName}</span><span class="chip">역할: ${skill.role}</span><span class="chip">Lv.${shownLevel}</span><span class="chip">마나 ${skillManaCost(skill, shownLevel)}</span><span class="chip">효과 x${skillPower(skill, shownLevel).toFixed(2)}</span><br>
          <span class="small">현재 1회 비용: ${formatCost(cost)}</span><br>
          <span class="small">${nextText}</span>
          <div class="skill-actions">
            <button ${unlocked ? '' : 'disabled'} onclick="equipSkill(${skill.id},0)">슬롯1</button>
            <button ${unlocked ? '' : 'disabled'} onclick="equipSkill(${skill.id},1)">슬롯2</button>
            <button ${unlocked ? '' : 'disabled'} onclick="equipSkill(${skill.id},2)">슬롯3</button>
          </div>
          <div class="skill-bulk-actions">
            <button ${unlocked ? '' : 'disabled'} title="${formatCost(cost)}" onclick="levelUpSkillMany(${skill.id},1)">+1</button>
            <button ${unlocked ? '' : 'disabled'} title="최대 10회 비용: ${formatCost(cost10)}" onclick="levelUpSkillMany(${skill.id},10)">+10</button>
            <button ${unlocked ? '' : 'disabled'} title="최대 50회 비용: ${formatCost(cost50)}" onclick="levelUpSkillMany(${skill.id},50)">+50</button>
            <button ${unlocked ? '' : 'disabled'} title="최대 100회 비용: ${formatCost(cost100)}" onclick="levelUpSkillMany(${skill.id},100)">+100</button>
            <button ${unlocked && hasNextInCategory ? '' : 'disabled'} onclick="levelUpSkillToNext(${skill.id})">다음 스킬</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCategoryUpgrades() {
  const box = document.getElementById('categoryUpgradeList');
  if (!box) return;
  box.innerHTML = skillCategories.map((cat, i) => {
    const level = state.categoryLevels[i] || 0;
    const cost = categoryUpgradeCost(i);
    return `<div class="item">
      <b>${cat.name} Lv.${level}</b><br>
      <span class="small">${cat.role} 계열 전체 효과가 증가합니다. 현재 보정: x${categoryPowerBonus(i).toFixed(2)}</span><br>
      <span class="chip">주요 비용: ${resourceName(cost.key)}</span><span class="chip">담당: ${cat.role}</span><br>
      <span class="small">비용: ${resourceName(cost.key)} ${fmt(cost.main)} / 골드 ${fmt(cost.gold)}</span>
      <button onclick="upgradeCategory(${i})">+1</button>${makeBulkButtons('upgradeCategoryMany', `${i}`)}
    </div>`;
  }).join('');
}

function renderPassives() {
  const box = document.getElementById('passiveSkillList');
  if (!box) return;
  box.innerHTML = passiveSkills.map((p, i) => {
    const level = state.passiveLevels[i] || 0;
    const cost = passiveCost(i);
    return `<div class="item">
      <b>${p.name} Lv.${level}</b><br>
      <span class="small">${p.desc}</span><br>
      <span class="chip">상시 적용</span><span class="chip">주요 비용: ${resourceName(p.cost)}</span><br>
      <span class="small">비용: ${resourceName(cost.key)} ${fmt(cost.main)} / 골드 ${fmt(cost.gold)}</span>
      <button class="purple-btn" onclick="upgradePassive(${i})">+1</button>${makeBulkButtons('upgradePassiveMany', `${i}`)}
    </div>`;
  }).join('');
}

function renderAutoHeal() {
  const box = document.getElementById('autoHealPanel');
  if (!box) return;
  const stats = autoHealStats();
  const cost = autoHealCost();
  box.innerHTML = `<div class="item auto-heal-card">
    <b>자동 힐 Lv.${stats.level}</b><br>
    <span class="small">체력이 ${Math.round(stats.threshold * 100)}% 이하이고 마나가 ${stats.manaCost} 이상이면 자동으로 최대 체력의 ${Math.round(stats.healRate * 100)}%를 회복합니다.</span><br>
    <span class="chip">상태: ${state.autoHealEnabled ? 'ON' : 'OFF'}</span><span class="chip">쿨타임 ${stats.cooldown}</span><span class="chip">현재 대기 ${state.autoHealCooldown || 0}</span><br>
    <span class="small">레벨업 비용: 골드 ${fmt(cost.gold)} / 마나수정 ${fmt(cost.manaCrystal)} / 유물가루 ${fmt(cost.dust)}</span>
    <div class="grid2">
      <button class="green-btn" onclick="toggleAutoHeal()">${state.autoHealEnabled ? '자동 힐 끄기' : '자동 힐 켜기'}</button>
      <button class="purple-btn" onclick="upgradeAutoHeal()">+1</button>
    </div>
    ${makeBulkButtons('upgradeAutoHealMany', '')}
  </div>`;
}

function renderWeapons() {
  const box = document.getElementById('weaponList');
  if (!box) return;
  const list = weapons.map((weapon, id) => ({ ...weapon, id })).filter(weapon => {
    if (weaponFilter === 'owned') return state.weaponOwned[weapon.id];
    if (weaponFilter === 'locked') return !state.weaponOwned[weapon.id];
    return true;
  });
  box.innerHTML = list.map(w => {
    const owned = state.weaponOwned[w.id];
    const equipped = state.equippedWeapon === w.id;
    const level = weaponLevel(w.id);
    const scale = 1 + (level - 1) * 0.12;
    const cost = { gold: Math.floor(90 * Math.pow(1.22, level + w.id)), dust: Math.floor(8 + level * 3 + w.id * 4), rune: Math.floor(3 + level + w.id) };
    return `<div class="item ${equipped ? 'equipped' : ''}">
      <b>${w.icon} ${w.name}</b><br>
      <span class="small">${w.desc}</span><br>
      <span class="chip">Lv.${Math.max(1, level)}</span><span class="chip">피해 +${Math.round(w.atk * scale * 100)}%</span><span class="chip">치명 +${Math.floor(w.crit * scale)}%</span><span class="chip">속도 +${Math.floor(w.speed * scale)}</span><span class="chip">체력 +${Math.floor(w.hp * scale)}</span><span class="chip">방어 +${Math.floor((w.def || 0) * scale)}</span><span class="chip">마나 +${Math.floor(w.mp * scale)}</span><span class="chip">보상 +${Math.round(w.reward * scale * 100)}%</span><br>
      <span class="small">해금 비용: ${weaponCostText(w.cost)}${owned ? ' / 강화: 골드 ' + fmt(cost.gold) + ' / 가루 ' + fmt(cost.dust) + ' / 룬 ' + fmt(cost.rune) : ''}</span>
      <div class="grid2"><button ${owned ? 'disabled' : ''} onclick="unlockWeapon(${w.id})">${owned ? '보유 중' : '해금'}</button><button ${owned ? '' : 'disabled'} onclick="equipWeapon(${w.id})">${equipped ? '장착 중' : '장착'}</button></div>
      <button class="purple-btn" ${owned ? '' : 'disabled'} onclick="upgradeWeapon(${w.id})">+1 강화</button>${makeBulkButtons('upgradeWeaponMany', `${w.id}`, owned)}
    </div>`;
  }).join('');
}

function item(title, desc, action, cls = '') {
  const match = action.match(/buyUpgrade\('([^']+)'\)/);
  const bulk = match ? makeBulkButtons('upgradeGenericMany', `'${match[1]}'`) : '';
  return `<div class="item"><b>${title}</b><br><span class="small">${desc}</span><button class="${cls}" onclick="${action}">+1</button>${bulk}</div>`;
}

function safeGet(id) { return document.getElementById(id); }
function safeRenderAll() {
  try {
    renderAll();
  } catch (error) {
    console.error('renderAll failed:', error);
    try { renderSkillModeTabs(); } catch (e) { console.error('renderSkillModeTabs failed:', e); }
    try { renderSkillSlots(); } catch (e) { console.error('renderSkillSlots failed:', e); }
    try { renderAutoSkillPanel(); } catch (e) { console.error('renderAutoSkillPanel failed:', e); }
    try { renderCategoryTabs(); } catch (e) { console.error('renderCategoryTabs failed:', e); }
    try { renderSkills(); } catch (e) { console.error('renderSkills failed:', e); }
    try { renderCategoryUpgrades(); } catch (e) { console.error('renderCategoryUpgrades failed:', e); }
    try { renderPassives(); } catch (e) { console.error('renderPassives failed:', e); }
    try { renderAutoHeal(); } catch (e) { console.error('renderAutoHeal failed:', e); }
  }
}
function showMainTabBase(name) {
  const tabs = ['growth', 'fields', 'boss', 'skills', 'armory'];
  tabs.forEach(tab => {
    const panel = safeGet(tab + 'Panel');
    const button = safeGet('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (panel) panel.classList.toggle('hidden', name !== tab);
    if (button) button.classList.toggle('active', name === tab);
  });
  if (name === 'skills') {
    if (!skillMode) skillMode = 'loadout';
    renderSkillModeTabs();
  }
  safeRenderAll();
}
function setSkillMode(mode) {
  skillMode = mode;
  renderSkillModeTabs();
  safeRenderAll();
}
function setSkillCategory(categoryIndex) {
  currentSkillCategory = Math.max(0, Math.min(skillCategories.length - 1, Number(categoryIndex) || 0));
  renderCategoryTabs();
  renderSkills();
}
function setWeaponFilter(filter) {
  weaponFilter = filter;
  ['All', 'Owned', 'Locked'].forEach(label => document.getElementById('weaponFilter' + label).classList.remove('active'));
  document.getElementById('weaponFilter' + (filter === 'all' ? 'All' : filter === 'owned' ? 'Owned' : 'Locked')).classList.add('active');
  renderWeapons();
}

function createShot(critical = false) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const el = document.createElement('div');
  el.className = 'shot' + (critical ? ' critical' : '');
  el.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
  arena.appendChild(el);
  setTimeout(() => el.remove(), 600);

  // 치명타는 짧은 별빛 파편과 충격파를 추가해 타격감을 강화합니다.
  if (critical) {
    createSparkBurst('critical', 18);
    createShockwave('critical');
  }

  const monster = document.getElementById('monsterBox');
  if (monster) {
    monster.classList.remove('shake');
    void monster.offsetWidth;
    monster.classList.add('shake');
  }
}
function createSkillFx(type) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const el = document.createElement('div');
  el.className = 'fx ' + type;
  arena.appendChild(el);
  setTimeout(() => el.remove(), 800);

  createSparkBurst(type, type === 'aoe' ? 36 : 24);
  createShockwave(type);
  if (['aoe', 'damage', 'drain'].includes(type)) createScreenFlash(type);
}
function createSparkBurst(type = 'damage', count = 20) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const palette = {
    damage: ['#fde047', '#fb923c', '#ef4444'],
    aoe: ['#f0abfc', '#60a5fa', '#f97316'],
    heal: ['#bbf7d0', '#22c55e', '#86efac'],
    dot: ['#86efac', '#16a34a', '#4ade80'],
    buff: ['#fde68a', '#facc15', '#fb923c'],
    debuff: ['#ddd6fe', '#8b5cf6', '#a78bfa'],
    shield: ['#bfdbfe', '#60a5fa', '#93c5fd'],
    mana: ['#bae6fd', '#38bdf8', '#6366f1'],
    drain: ['#fca5a5', '#ef4444', '#7f1d1d'],
    resource: ['#fde68a', '#f59e0b', '#fef3c7'],
    critical: ['#fff7ed', '#facc15', '#f97316']
  }[type] || ['#ffffff', '#fde68a', '#60a5fa'];
  const amount = Math.min(60, Math.max(6, count));
  for (let i = 0; i < amount; i++) {
    const p = document.createElement('div');
    p.className = 'spark';
    const angle = Math.random() * Math.PI * 2;
    const dist = 55 + Math.random() * 135;
    p.style.setProperty('--x', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--y', Math.sin(angle) * dist + 'px');
    p.style.setProperty('--size', (4 + Math.random() * 8) + 'px');
    p.style.background = palette[i % palette.length];
    p.style.boxShadow = `0 0 14px ${palette[i % palette.length]}`;
    arena.appendChild(p);
    setTimeout(() => p.remove(), 920);
  }
}
function createShockwave(type = 'damage') {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const ring = document.createElement('div');
  ring.className = 'shockwave ' + type;
  arena.appendChild(ring);
  setTimeout(() => ring.remove(), 720);
}
function createScreenFlash(type = 'damage') {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const flash = document.createElement('div');
  flash.className = 'screen-flash ' + type;
  arena.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}
function createBossDefeatFx() {
  createScreenFlash('resource');
  createSparkBurst('resource', 56);
  createShockwave('resource');
}
function createFloat(text, cls = '') {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const el = document.createElement('div');
  el.className = 'float ' + cls;
  el.textContent = text;
  arena.appendChild(el);
  setTimeout(() => el.remove(), 840);
}
function log(text, cls = '') {
  const el = document.createElement('div');
  el.className = cls;
  el.textContent = '• ' + text;
  const box = document.getElementById('logBox');
  box.prepend(el);
  while (box.children.length > 80) box.lastChild.remove();
}

function mechanicName(mechanic) {
  const names = {
    none: '없음', fast: '빠른 공격', poison: '중독', strongPoison: '강한 중독', burn: '화상', slow: '둔화',
    evasion: '회피', armor: '방어', reflect: '피해 반사', counter: '확률 반격', regen: '체력 재생',
    bossRegen: '보스 재생', shield: '보호막', charge: '돌진', summonUndead: '소환', skillSeal: '스킬 봉인', minorSkillSeal:'부적 봉인', fearDot:'공포 지속 피해', bleed:'출혈', defDown:'방어 저하', attackDown:'공격 약화', buffPurge:'버프 제거', execution:'처형', barrierCity:'저주 결계', barrierShield:'결계 보호막', evolve:'진화', bindingWitch:'붉은 결속', domainDevour:'영역 포식',
    manaDrain: '마나 흡수', treasureGuard: '황금 장갑', spiritRisk: '영혼 압박', runeSurge: '룬 폭주',
    deathBomb: '처치 폭발', bloodDebt: '피의 대가', overgrowth: '증식 회복', dreamShift: '꿈결 변동',
    voidForge: '공허 장갑', crystalArmor: '결정 장갑', accuracyDown: '명중률 감소', timeDelay: '행동 지연',
    heatUp: '전장 가열', timePressure: '시간 압박', wave: '파도 공격', aoe: '광역 공격', crit: '치명타',
    ambush: '기습', magicBurst: '마법 폭발', cooldownUp: '쿨타임 증가', skillDisrupt: '스킬 방해',
    freezeSlow: '빙결 둔화', bind: '속박', fear: '공포', shock: '감전', multiHit: '연속 공격',
    poisonField: '독 장판', unstableBrew: '연금 반응', stormChain: '연쇄 번개', gravityWell: '중력 지연',
    eclipseCycle: '월식 주기', jackpot: '도박 보상', streak: '연전', noAutoHeal: '자동 힐 봉인', regionMix: '지역 혼합'
  };
  return names[mechanic] || mechanic || '없음';
}

function forceResolveEnemyDefeat(source = '') {
  ensureEnemyHpNumber();
  if (!state.enemy || state.resolvingEnemyDefeat) return false;
  if (state.enemyHp <= 0 || state.enemyDefeatedPending) {
    state.enemyHp = 0;
    state.enemyDefeatedPending = true;
    return resolveEnemyDefeat();
  }
  return false;
}

function describeSkill(type, role) {
  return {
    damage: '즉시 강한 피해를 주는 공격 스킬입니다.',
    heal: '체력을 회복해 생존을 보조합니다.',
    dot: '적에게 지속 피해를 남깁니다.',
    buff: '일정 시간 자동 공격 피해를 높입니다.',
    debuff: '적의 공격력을 낮춰 받는 피해를 줄입니다.',
    shield: '보호막을 만들어 피해를 먼저 흡수합니다.',
    drain: '피해를 주고 체력을 일부 회복합니다.',
    mana: '마나를 회복하고 보조 피해를 줍니다.',
    aoe: '강한 범위 폭발 피해를 줍니다.',
    resource: '다음 처치 보상을 증가시킵니다.',
  }[type] || role;
}

// Startup deferred until final rebalanced patch is defined.



/* === 2026 추가 패치: 지역 10스테이지 순환 / 특수전장 공격력 증가 삭제 / 무한 탑 === */
function currentNormalRegionIndex() {
  return Math.max(0, Math.min(regionOrder.length - 1, Math.floor((Math.max(1, state.stage || 1) - 1) / 10) % regionOrder.length));
}
function currentNormalRegionKey() { return regionOrder[currentNormalRegionIndex()] || 'meadow'; }
function currentNormalRegion() { return regionFields[currentNormalRegionKey()] || regionFields.meadow; }
function normalStageUnlockRegionCount() { return currentNormalRegionIndex() + 1; }
function normalStageRankText() {
  const wave = normalStageWave();
  if (wave <= 3) return currentNormalRegion().label + ' 초반';
  if (wave <= 7) return currentNormalRegion().label + ' 중반';
  if (wave <= 9) return currentNormalRegion().label + ' 후반';
  return currentNormalRegion().label + ' 정예 웨이브';
}
function selectNormalStageMonster() {
  const wave = normalStageWave();
  const region = currentNormalRegion();
  let candidates = region.pool.slice();
  if (wave <= 3) candidates = candidates.filter(m => m.grade !== '정예' && (m.hp || 1) <= 1.15);
  else if (wave <= 7) candidates = candidates.filter(m => m.grade !== '정예' || (m.hp || 1) <= 1.45);
  else if (wave <= 9) candidates = candidates.filter(m => m.grade !== '정예' || (m.hp || 1) <= 1.65);
  else candidates = candidates.filter(m => m.grade === '정예');
  if (!candidates.length) candidates = region.pool.slice();
  const seq = (state.enemySpawnSeq || 0) + (state.kills || 0) + wave;
  let idx = seq % candidates.length;
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[idx].name !== state.lastEnemyName) break;
    idx = (idx + 1) % candidates.length;
  }
  return { ...candidates[idx], regionKey: currentNormalRegionKey(), region: region.label };
}
function normalBossIndexForStage() {
  return Math.max(0, Math.min(9, currentNormalRegionIndex()));
}
function dungeonAtkBonus() { return 1; }

function clearPlayerDamageTemporaryState() {
  // 전투/던전 기믹으로 생긴 임시값이 초당 피해량에 섞이지 않도록 매번 정리합니다.
  state.buffTicks = 0;
  state.buffPower = 1;
  state.specialEntryDps = 0;
}

function hardResetSpecialAttackState() {
  clearPlayerDamageTemporaryState();
  state.dungeonTimer = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.tempAtkPressure = 0;
  state.enemyBaseAtk = Number(state.enemyBaseAtk || state.enemyAtk || 1);
  if (!state.boss && state.field !== 'normal') state.enemyAtk = state.enemyBaseAtk;
}
function enterField(key) {
  if (!fields[key]) return log('존재하지 않는 전장입니다.', 'warn');
  const targetField = fields[key];
  const requiredStage = targetField.minStage || 1;
  if (key !== 'normal' && state.stage < requiredStage) {
    return log(`${targetField.label}은 ${requiredStage}스테이지부터 입장할 수 있습니다.`, 'warn');
  }

  const from = state.field;
  state.field = key;
  state.towerMode = false;
  state.boss = false;
  state.bossPhase = 1;
  state.reflectLockUntil = 0;
  state.dungeonStreak = 0;
  state.dungeonTimer = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.tempAtkPressure = 0;
  state.enemyBaseAtk = 0;
  state.bossBaseAtk = 0;
  state.enemy = null;
  state.enemyHp = 0;
  state.enemyMaxHp = 0;
  state.enemyInvincibleHits = 0;
  state.enemyInvincibleCooldown = 0;

  // 던전 입장으로 플레이어 공격력이 올라가 보이는 현상을 막기 위해
  // 전장 전환 시 전투성 임시 버프만 정리합니다. 영구 성장/장비/스킬 레벨은 유지됩니다.
  state.buffTicks = 0;
  state.buffPower = 1;
  state.rewardBoost = 1;
  state.specialEntryDps = 0;

  resetFieldRotation(key);
  syncBossSelectionForCurrentField();
  spawnEnemy();
  startLoops();
  log(`${targetField.label}에 입장했습니다.${from !== key ? ' 임시 전투 버프와 이전 전장 상태를 초기화했습니다.' : ''}`, 'good');
  renderAll();
  saveGame();
}
function spawnEnemy() {
  if (state.towerMode) return spawnTowerEnemy();
  spawnEnemyBase();
  if (!state.boss && state.field !== 'normal') hardResetSpecialAttackState();
}
function enemyAttack() {
  if (state.hp <= 0) return;
  const mechanic = state.boss ? currentBoss().mechanic : (state.enemy?.mechanic || currentField().mechanic);

  // 보스와 특수 전장 몬스터는 전투 시간이 길어질수록 '몬스터 공격'만 강해집니다.
  // 플레이어 공격력/DPS에는 영향을 주지 않습니다.
  if (state.boss || state.field !== 'normal') state.dungeonTimer = (state.dungeonTimer || 0) + 1;
  if (state.boss) updateBossPhase();

  let atk = Math.max(1, Number(state.enemyBaseAtk || state.enemyAtk || 1));
  if (state.boss) atk = Math.max(1, Number(state.enemyAtk || atk));
  if (state.debuff > 0) { atk = Math.floor(atk * 0.58); state.debuff--; }

  // 공격력 기본 상향
  atk = Math.floor(atk * (state.boss ? 1.85 : state.field === 'normal' ? 1.55 : 2.15));

  // 특수 전장 몬스터 공격력 증가: 몬스터만 증가. 플레이어 공격력은 절대 증가시키지 않음.
  if (!state.boss && state.field !== 'normal') {
    const ramp = Math.min(3.0, (state.dungeonTimer || 0) * 0.055); // 최대 4배
    atk = Math.floor(atk * (1 + ramp));
  }

  if (state.boss) {
    const phaseRamp = 1 + ((state.bossPhase || 1) - 1) * 0.28;
    const timeRamp = ['timeDelay','heatUp','timePressure','evolve','domainDevour'].includes(mechanic)
      ? 1 + Math.min(0.65, (state.dungeonTimer || 0) * 0.012)
      : 1;
    const summonRamp = 1 + Math.min(0.35, state.summonPressure || 0);
    atk = Math.floor(atk * phaseRamp * timeRamp * summonRamp);
  }

  // 공격 메커니즘 다양화 및 상향
  if (mechanic === 'fast') atk = Math.floor(atk * 1.22);
  if (mechanic === 'crit' && Math.random() < 0.30) { atk = Math.floor(atk * 1.85); createFloat('강화 치명', 'bad'); }
  if (mechanic === 'ambush' && Math.random() < 0.28) { atk = Math.floor(atk * 1.9); createFloat('강화 기습', 'bad'); }
  if (mechanic === 'magicBurst' && Math.random() < 0.26) { atk = Math.floor(atk * 1.85); createFloat('마력 폭발', 'bad'); }
  if (mechanic === 'aoe' || mechanic === 'wave') atk = Math.floor(atk * 1.35);
  if (mechanic === 'execution' && Math.random() < 0.22) { atk = Math.floor(atk * 2.05); createFloat('처형 강타', 'bad'); }
  if (mechanic === 'charge' && Math.random() < 0.25) { atk = Math.floor(atk * 1.75); createFloat('돌진 강타', 'bad'); }
  if (mechanic === 'bloodDebt') atk = Math.floor(atk * 1.35);
  if (mechanic === 'voidForge') atk = Math.floor(atk * 1.28);
  if (mechanic === 'attackDown' && Math.random() < 0.20) { state.debuff = Math.max(state.debuff || 0, 2); createFloat('공격 약화', 'bad'); }
  if (mechanic === 'bindingWitch' && Math.random() < 0.25) {
    state.skillCooldowns = state.skillCooldowns.map(v => (v || 0) + 1);
    state.autoHealCooldown = Math.max(state.autoHealCooldown || 0, 2);
    createFloat('붉은 결속', 'bad');
  }

  let damage = Math.max(1, Math.floor(atk * 1.65) + Math.floor(Math.random() * 14) - Math.floor(state.dust / 58));
  if ((state.enemyInvincibleHits || 0) > 0) {
    damage = Math.floor(damage * 2);
    createFloat('무적 반격 2배', 'bad');
  }

  // 너무 말도 안 되는 즉사만 막는 느슨한 상한. 이전보다 훨씬 강합니다.
  if (!state.boss && state.field !== 'normal') damage = Math.min(damage, Math.max(30, Math.floor(getMaxHp() * 0.32)));
  if (state.boss) damage = Math.min(damage, Math.max(60, Math.floor(getMaxHp() * 0.48)));

  const hitCount = getEnemyAttackCount(mechanic);
  const boostedDamage = Math.floor(damage * (1 + Math.max(0, hitCount - 1) * 0.34));
  applyPlayerDamageMultiHit(boostedDamage, hitCount);
  applyEnemyMechanicAfterAttack(mechanic);
  tryAutoHeal();
  if (state.hp <= 0) handlePlayerDefeat();
  renderBattle();
  saveGame();
}
function handlePlayerDefeat() {
  if (state.towerMode) return finishTowerRun(false);
  return handlePlayerDefeatBase();
}
function killEnemy() {
  if (state.towerMode && !state.boss) return towerKillEnemy();
  return killEnemyBase();
}
function towerBaseReward() {
  const floor = Math.max(1, state.towerFloor || 1);
  return Math.floor(120 + floor * 45 + Math.pow(floor, 1.35) * 18);
}
function startTower() {
  if (state.boss) return log('보스전 중에는 탑에 입장할 수 없습니다.', 'warn');
  state.towerMode = true;
  state.towerFloor = 1;
  state.towerKills = 0;
  state.towerRewardBank = { gold:0, manaCrystal:0, dust:0, rune:0, soul:0, bossMedal:0 };
  state.field = 'normal';
  state.hp = getMaxHp();
  state.mp = getMaxMp();
  spawnEnemy();
  startLoops();
  renderAll();
  log('무한 탑 입장! 체력이 0이 될 때까지 등반합니다.', 'good');
}
function exitTower() { finishTowerRun(true); }
function finishTowerRun(manual=false) {
  if (!state.towerMode) return;
  const bank = state.towerRewardBank || {};
  for (const [key, value] of Object.entries(bank)) state[key] = (state[key] || 0) + Math.floor(value || 0);
  state.towerBest = Math.max(state.towerBest || 0, (state.towerFloor || 1) - 1);
  state.towerMode = false;
  state.towerFloor = 1;
  state.towerKills = 0;
  state.towerRewardBank = { gold:0, manaCrystal:0, dust:0, rune:0, soul:0, bossMedal:0 };
  state.hp = Math.max(1, Math.floor(getMaxHp() * 0.45));
  state.mp = Math.max(1, Math.floor(getMaxMp() * 0.45));
  spawnEnemy();
  startLoops();
  renderAll();
  log(`무한 탑 ${manual ? '퇴장' : '패배'}: 보상을 정산했습니다. 최고층 ${state.towerBest || 0}층`, manual ? 'good' : 'bad');
  saveGame();
}
function spawnTowerEnemy() {
  const floor = Math.max(1, state.towerFloor || 1);
  const regionIdx = Math.min(regionOrder.length - 1, Math.floor((floor - 1) / 8));
  const region = regionFields[regionOrder[regionIdx]] || regionFields.meadow;
  const pool = region.pool.slice();
  let enemy = pool[(floor + (state.towerKills || 0)) % pool.length];
  if (floor % 5 === 0) {
    const elites = pool.filter(m => m.grade === '정예');
    if (elites.length) enemy = elites[floor % elites.length];
  }
  const towerEnemy = { ...enemy, name: `탑 ${floor}층 ${enemy.name}`, trait: `${enemy.trait} / 탑 몬스터: 층이 오를수록 체력과 공격 횟수가 증가합니다.`, tower:true };
  const hpBase = Math.floor((80 + floor * 42 + Math.pow(floor, 1.45) * 25) * (enemy.hp || 1) * (floor % 5 === 0 ? 2.4 : 1.25));
  state.enemy = towerEnemy;
  applyScaledEnemyHp(hpBase, towerEnemy, false);
  state.enemyAtk = Math.floor((7 + floor * 1.35 + Math.pow(floor, 1.12) * 1.1) * (enemy.atk || 1) * (floor % 5 === 0 ? 1.35 : 1));
  state.enemyBaseAtk = state.enemyAtk;
  state.enemyInvincibleHits = 0;
  state.enemyInvincibleCooldown = 0;
  saveGame();
}
function towerKillEnemy() {
  if (state.resolvingEnemyDefeat) return;
  state.resolvingEnemyDefeat = true;
  const floor = Math.max(1, state.towerFloor || 1);
  const reward = towerBaseReward();
  const bank = state.towerRewardBank || (state.towerRewardBank = {});
  bank.gold = (bank.gold || 0) + reward;
  bank.manaCrystal = (bank.manaCrystal || 0) + Math.floor(reward / 12);
  bank.dust = (bank.dust || 0) + Math.floor(reward / 10);
  bank.rune = (bank.rune || 0) + Math.floor(reward / 18);
  if (floor % 5 === 0) bank.soul = (bank.soul || 0) + Math.max(1, Math.floor(floor / 10));
  if (floor % 10 === 0) bank.bossMedal = (bank.bossMedal || 0) + Math.max(1, Math.floor(floor / 20));
  state.towerKills = (state.towerKills || 0) + 1;
  state.towerFloor = floor + 1;
  state.hp = Math.min(getMaxHp(), state.hp + Math.floor(getMaxHp() * 0.06));
  state.mp = Math.min(getMaxMp(), state.mp + Math.floor(getMaxMp() * 0.08));
  state.enemySpawnSeq = (state.enemySpawnSeq || 0) + 1;
  state.resolvingEnemyDefeat = false;
  spawnTowerEnemy();
  renderAll();
  log(`무한 탑 ${floor}층 돌파. 누적 보상 골드 +${fmt(reward)}`, 'good');
  saveGame();
}
function renderTower() {
  const box = document.getElementById('towerPanelContent');
  if (!box) return;
  const bank = state.towerRewardBank || {};
  box.innerHTML = `<div class="item ${state.towerMode ? 'equipped' : ''}">
    <b>무한 탑 등반</b><br>
    <span class="small">체력이 0이 될 때까지 계속 강한 몬스터를 만납니다. 5층마다 정예층, 10층마다 보스급 보상이 붙습니다.</span><br>
    <span class="chip">현재 ${state.towerMode ? (state.towerFloor || 1) + '층' : '대기 중'}</span><span class="chip">최고 ${state.towerBest || 0}층</span><span class="chip">누적 골드 ${fmt(bank.gold || 0)}</span><span class="chip">누적 룬 ${fmt(bank.rune || 0)}</span><span class="chip">누적 메달 ${fmt(bank.bossMedal || 0)}</span>
    <div class="grid2"><button class="purple-btn" ${state.towerMode ? 'disabled' : ''} onclick="startTower()">탑 입장</button><button class="dark-btn" ${state.towerMode ? '' : 'disabled'} onclick="exitTower()">보상 받고 퇴장</button></div>
  </div>`;
}
function renderAll() {
  renderBattle(); renderUpgrades(); renderAscension(); renderPrestige(); renderFields(); renderBossPanel(); renderTower();
  renderSkillModeTabs(); renderSkillSlots(); renderAutoSkillPanel(); renderCategoryTabs(); renderSkills(); renderCategoryUpgrades(); renderPassives(); renderAutoHeal(); renderWeapons();
}
function showMainTab(name) {
  const tabs = ['growth', 'fields', 'boss', 'tower', 'skills', 'armory'];
  tabs.forEach(tab => {
    const panel = safeGet(tab + 'Panel');
    const button = safeGet('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (panel) panel.classList.toggle('hidden', name !== tab);
    if (button) button.classList.toggle('active', name === tab);
  });
  if (name === 'skills') { if (!skillMode) skillMode = 'loadout'; renderSkillModeTabs(); }
  safeRenderAll();
}
// 보스 목록은 일반 전장에서 현재 10스테이지 지역에 맞는 보스가 기본 선택되게 보정합니다.
function syncBossSelectionForCurrentField() { ensureBossMatchesCurrentField(); if (state.field === 'normal') state.bossIndex = normalBossIndexForStage(); }

/* =========================================================
   USER DAMAGE ONLY PATCH
   - 플레이어 피해량은 오직 사용자가 직접 올린 성장/업그레이드/장비/스킬 레벨에만 영향을 받습니다.
   - 던전/지역/몬스터/보스 기믹은 플레이어 피해량을 증가시키거나 감소시키지 않습니다.
   - 특수 전장 보너스 피해, 월식 증폭, 연쇄 번개 등 자동 피해 증가 기믹은 제거됩니다.
   ========================================================= */

function baseDamage() {
  // 절대 규칙: 플레이어 피해량은 사용자가 직접 누른 성장/강화만 반영합니다.
  // 보유 재화량, 현재 전장, 지역, 던전 시간, 몬스터 기믹, 보스 기믹은 여기에서 완전히 제외합니다.
  const flat = Math.max(1, Number(state.power || 0))
    + Math.max(0, Number(state.coreLv || 0)) * 3;

  const userUpgradeMultiplier =
    powerMultiplier()
    * grade().mult
    * (1 + weaponAtkBonus() + passiveAtkBonus())
    * rebirthDamageBonus();

  return Math.max(1, Math.floor(flat * userUpgradeMultiplier));
}

function hit(mult = 1, fromSkill = false) {
  if (state.hp <= 0) return;

  const enemyMechanic = state.enemy?.mechanic || 'none';
  const bossMechanic = state.boss ? currentBoss().mechanic : '';

  // 회피는 피해량 증감이 아니라 명중 판정이므로 유지합니다.
  const missChance = (enemyMechanic === 'evasion' ? 0.18 : 0) + (bossMechanic === 'accuracyDown' ? 0.18 : 0);
  if (missChance > 0 && Math.random() < missChance) {
    createFloat('회피', 'mtext');
    renderBattle();
    return;
  }

  // 핵심: 피해량은 baseDamage()와 스킬/사용자 업그레이드 기반 mult만 사용합니다.
  // 던전, 지역, 몬스터 방어/장갑/월식/연쇄 기믹은 피해량을 바꾸지 않습니다.
  let damage = Math.max(1, Math.floor(baseDamage() * Math.max(0.01, Number(mult) || 1)));

  // 치명타는 사용자가 강화할 수 있는 치명 관련 성장만 반영합니다.
  const critical = Math.random() * 100 < state.crit + weaponCritBonus() + passiveCritBonus();
  if (critical) damage = Math.floor(damage * 2.25);

  dealEnemyDamage(damage);
  createShot(critical);
  createFloat(critical ? '치명 ' + fmt(damage) : fmt(damage));
  restoreMp(2 + Math.floor(state.mpLv / 2) + passiveMpRegenBonus());

  if (resolveEnemyDefeat()) { renderBattle(); saveGame(); return; }

  const reflectField = !state.boss && currentField().mechanic === 'reflect';
  const reflectEnemy = !state.boss && enemyMechanic === 'reflect';
  const counterEnemy = !state.boss && enemyMechanic === 'counter' && Math.random() < 0.18;
  const reflectBoss = state.boss && bossMechanic === 'reflect';
  applyReflectDamage(damage, { reflectField, reflectEnemy, counterEnemy, reflectBoss });

  // 던전/지역 기믹으로 플레이어 추가 피해가 발생하지 않도록 applyDungeonHitMechanic은 무효화합니다.
  applyDungeonHitMechanic(damage, critical);

  if (resolveEnemyDefeat()) { renderBattle(); saveGame(); return; }
  applyDotDamage();
  if (forceResolveEnemyDefeat('hit-final')) { renderBattle(); saveGame(); return; }
  resolveEnemyDefeat();
  renderBattle();
  saveGame();
}

function applyDungeonHitMechanic(damage, critical) {
  // 플레이어 피해량이 던전/지역 기믹으로 자동 증가하는 현상을 완전히 제거합니다.
  // 예전의 연금 폭발, 연쇄 번개, 월식 증폭 등은 더 이상 적에게 추가 피해를 주지 않습니다.
  // 필요 시 방해/상태이상은 enemyAttack 쪽에서만 처리합니다.
  return false;
}

function applySkillEffect(skill, level) {
  const power = skillPower(skill, level);
  createSkillFx(skill.type);

  if (skill.type === 'damage') hit(power, true);
  if (skill.type === 'heal') {
    const heal = Math.floor(getMaxHp() * (0.16 + skill.tier * 0.018 + level * 0.014) * categoryPowerBonus(skill.categoryIndex));
    state.hp = Math.min(getMaxHp(), state.hp + heal);
    createFloat('회복 ' + fmt(heal), 'heal');
  }
  if (skill.type === 'dot') {
    state.dotTicks = 4 + Math.floor(level / 2);
    state.dotDamage = Math.floor(baseDamage() * (0.42 + skill.tier * 0.08 + level * 0.045) * categoryPowerBonus(skill.categoryIndex));
    hit(0.55 + level * 0.015, true);
  }
  if (skill.type === 'buff') {
    // 피해량 증가 버프는 제거합니다. 대신 마나 회복과 짧은 보호막으로 변경합니다.
    const gain = Math.floor(getMaxMp() * (0.08 + level * 0.003));
    const shield = Math.floor(getMaxHp() * (0.06 + level * 0.002));
    restoreMp(gain);
    state.shield += shield;
    state.buffTicks = 0;
    state.buffPower = 1;
    createFloat('전투 보조', 'mtext');
  }
  if (skill.type === 'debuff') {
    state.debuff = 4 + skill.tier + Math.floor(level / 2);
    hit(1.05 + level * 0.04, true);
  }
  if (skill.type === 'shield') {
    const shield = Math.floor(getMaxHp() * (0.22 + skill.tier * 0.025 + level * 0.015) * categoryPowerBonus(skill.categoryIndex));
    state.shield += shield;
    createFloat('보호막 ' + fmt(shield), 'mtext');
  }
  if (skill.type === 'drain') {
    const damage = Math.floor(baseDamage() * power * 0.62);
    const heal = Math.floor(damage * (0.22 + level * 0.012));
    dealEnemyDamage(damage);
    state.hp = Math.min(getMaxHp(), state.hp + heal);
    createShot(true);
    createFloat('흡수 ' + fmt(heal), 'heal');
    resolveEnemyDefeat();
  }
  if (skill.type === 'mana') {
    const gain = Math.floor(skillManaCost(skill, level) * (1.25 + level * 0.05) * categoryPowerBonus(skill.categoryIndex));
    restoreMp(gain);
    hit(1.05 + level * 0.035, true);
    createFloat('마나 +' + fmt(gain), 'mtext');
  }
  if (skill.type === 'aoe') {
    hit(power * 1.28, true);
    createFloat('광역 폭발');
  }
  if (skill.type === 'resource') {
    state.rewardBoost = (1.55 + skill.tier * 0.1 + level * 0.05) * categoryPowerBonus(skill.categoryIndex);
    hit(1.0 + level * 0.025, true);
  }
  resolveEnemyDefeat();
}


function clearPlayerDamageTemporaryState() {
  // 전투/던전 기믹으로 생긴 임시값이 초당 피해량에 섞이지 않도록 매번 정리합니다.
  state.buffTicks = 0;
  state.buffPower = 1;
  state.specialEntryDps = 0;
}

function hardResetSpecialAttackState() {
  clearPlayerDamageTemporaryState();
  state.dungeonTimer = 0;
  state.summonPressure = 0;
  state.specialAtkRamp = 0;
  state.tempAtkPressure = 0;
  state.buffTicks = 0;
  state.buffPower = 1;
  state.enemyBaseAtk = Number(state.enemyBaseAtk || state.enemyAtk || 1);
  if (!state.boss && state.field !== 'normal') state.enemyAtk = state.enemyBaseAtk;
}

/* =========================================================
   FINAL REBALANCE + VISUAL BACKGROUND PATCH
   - 스탯 인플레 완화: 강화 효율을 낮추고 소프트캡을 적용
   - 피해량은 사용자 업그레이드만 반영
   - 지역/던전 배경과 몬스터 카드 비주얼 반영
   ========================================================= */

function rbSoft(level, linear, softStart, softRate) {
  level = Math.max(0, Number(level || 0));
  if (level <= softStart) return level * linear;
  return softStart * linear + (level - softStart) * linear * softRate;
}

function defenseMultiplier() {
  return 1 + rbSoft(state.defenseMultLv || 0, 0.035, 60, 0.35) + awakeningLv() * 0.006 + limitBreakLv() * 0.008;
}
function powerMultiplier() {
  return 1 + rbSoft(state.powerMultLv || 0, 0.028, 60, 0.34) + awakeningLv() * 0.010 + transcendLv() * 0.012 + limitBreakLv() * 0.016;
}
function hpMultiplier() {
  return 1 + rbSoft(state.hpMultLv || 0, 0.035, 60, 0.36) + awakeningLv() * 0.010 + transcendLv() * 0.012 + limitBreakLv() * 0.016;
}
function awakeningBonus() { return 1 + rbSoft(awakeningLv(), 0.012, 80, 0.35); }
function transcendBonus() { return 1 + rbSoft(transcendLv(), 0.012, 80, 0.35); }
function limitBreakBonus() { return 1 + rbSoft(limitBreakLv(), 0.018, 60, 0.35); }
function transcendSkillBonus() { return 1 + rbSoft(transcendLv(), 0.014, 80, 0.35); }
function limitBossBonus() { return state.boss ? 1 + rbSoft(limitBreakLv(), 0.018, 60, 0.35) : 1; }
function rebirthDamageBonus() { return 1 + rbSoft(rebirthTraitLevel('damage'), 0.018, 100, 0.30); }
function rebirthHpBonus() { return 1 + rbSoft(rebirthTraitLevel('hp'), 0.022, 100, 0.32); }
function rebirthMpBonus() { return 1 + rbSoft(rebirthTraitLevel('mp'), 0.016, 100, 0.32); }
function rebirthRewardBonus() { return rbSoft(rebirthTraitLevel('reward'), 0.018, 100, 0.30); }
function rebirthWeaponBonus() { return rbSoft(rebirthTraitLevel('weapon'), 0.014, 100, 0.30); }
function rebirthBossDamageBonus() { return state.boss ? 1 + rbSoft(rebirthTraitLevel('boss'), 0.020, 100, 0.32) : 1; }
function weaponScale(i = state.equippedWeapon) { return 1 + rbSoft(weaponLevel(i) - 1, 0.045, 80, 0.35); }
function weaponAtkBonus() { return equippedWeapon().atk * weaponScale() * (1 + rebirthWeaponBonus()); }
function passiveAtkBonus() { return passiveLevel('atk') * 0.012 + passiveLevel('soulAtk') * 0.014; }
function passiveRewardBonus() { return passiveLevel('reward') * 0.012 + awakeningLv() * 0.004 + transcendLv() * 0.005 + rebirthRewardBonus(); }
function categoryPowerBonus(categoryIndex) { return 1 + rbSoft(state.categoryLevels[categoryIndex] || 0, 0.020, 80, 0.34); }
function getMaxHp() {
  const flat = Math.max(120, state.maxHp || 0) + Math.floor(equippedWeapon().hp * weaponScale()) + passiveLevel('hp') * 8;
  return Math.floor(flat * hpMultiplier() * rebirthHpBonus());
}
function getMaxMp() {
  return Math.floor(((state.maxMp || 70) + Math.floor(equippedWeapon().mp * weaponScale()) + passiveLevel('mp') * 6) * (1 + rbSoft(transcendLv(), 0.012, 80, 0.35)) * rebirthMpBonus());
}
function baseDamage() {
  const flat = Math.max(1, Number(state.power || 0)) + Math.max(0, Number(state.coreLv || 0)) * 2;
  const mult = powerMultiplier() * grade().mult * (1 + weaponAtkBonus() + passiveAtkBonus()) * rebirthDamageBonus() * rebirthBossDamageBonus() * limitBossBonus();
  return Math.max(1, Math.floor(flat * mult));
}
function skillPower(skill, level) {
  return skill.basePower * (1 + rbSoft(level, 0.055, 80, 0.35)) * categoryPowerBonus(skill.categoryIndex) * transcendSkillBonus();
}
function defenseReductionRate() {
  const defense = getDefense();
  return Math.min(0.65, defense / (defense + 700));
}
function reduceIncomingDamageByDefense(rawDamage) {
  let damage = Math.max(1, Math.floor(rawDamage || 0));
  const defense = getDefense();
  if (defense <= 0) return damage;
  const reduced = Math.floor(damage * (1 - defenseReductionRate()) - defense * 0.08);
  return Math.max(1, reduced);
}

function upgradeCosts() {
  return {
    power: Math.floor(30 * Math.pow(1.14, state.coreLv - 1)),
    powerMultGold: Math.floor(350 * Math.pow(1.18, state.powerMultLv || 0)),
    powerMultRune: 25 + (state.powerMultLv || 0) * 10,
    speed: Math.floor(85 * Math.pow(1.20, state.speed - 1)),
    hp: 45 + state.hpLv * 15,
    defense: 36 + (state.defenseLv || 1) * 14,
    defenseMultDust: 80 + (state.defenseMultLv || 0) * 30,
    defenseMultRune: 12 + (state.defenseMultLv || 0) * 7,
    hpMultDust: 95 + (state.hpMultLv || 0) * 36,
    hpMultSoul: 3 + Math.floor((state.hpMultLv || 0) / 3),
    mp: 40 + state.mpLv * 12,
    crit: 35 + Math.floor(state.crit * 2.0),
    gradeGold: Math.floor(650 * Math.pow(2.15, state.grade)),
    gradeDust: 120 + state.grade * 90,
    awakeningGold: Math.floor(2500 * Math.pow(1.18, awakeningLv())),
    awakeningMedal: 5 + awakeningLv() * 2,
    transcendSoul: 18 + transcendLv() * 6,
    transcendRune: 120 + transcendLv() * 28,
    limitBossMedal: 18 + limitBreakLv() * 6,
    limitGold: Math.floor(9500 * Math.pow(1.20, limitBreakLv())),
  };
}

function buyUpgrade(type) {
  const cost = upgradeCosts();
  if (type === 'power') { if (!pay('gold', cost.power)) return; state.power += 2; state.coreLv++; }
  if (type === 'powerMult') { if (state.gold < cost.powerMultGold || state.rune < cost.powerMultRune) return log('기본 피해 배수 강화 재화가 부족합니다.', 'warn'); state.gold -= cost.powerMultGold; state.rune -= cost.powerMultRune; state.powerMultLv = (state.powerMultLv || 0) + 1; }
  if (type === 'speed') { if (!pay('gold', cost.speed)) return; state.speed++; startLoops(); }
  if (type === 'hp') { if (!pay('dust', cost.hp)) return; state.hpLv++; state.maxHp += 22; state.hp = getMaxHp(); }
  if (type === 'defense') { if (!pay('dust', cost.defense)) return; state.defenseLv = (state.defenseLv || 1) + 1; state.defense = (state.defense || 0) + 7; }
  if (type === 'defenseMult') { if (state.dust < cost.defenseMultDust || state.rune < cost.defenseMultRune) return log('방어 배수 강화 재화가 부족합니다.', 'warn'); state.dust -= cost.defenseMultDust; state.rune -= cost.defenseMultRune; state.defenseMultLv = (state.defenseMultLv || 0) + 1; }
  if (type === 'hpMult') { if (state.dust < cost.hpMultDust || state.soul < cost.hpMultSoul) return log('체력 배수 강화 재화가 부족합니다.', 'warn'); state.dust -= cost.hpMultDust; state.soul -= cost.hpMultSoul; state.hpMultLv = (state.hpMultLv || 0) + 1; state.hp = getMaxHp(); }
  if (type === 'mp') { if (!pay('manaCrystal', cost.mp)) return; state.mpLv++; state.maxMp += 10; state.mp = getMaxMp(); }
  if (type === 'crit') { if (!pay('rune', cost.crit)) return; state.crit = Math.min(65, state.crit + 1); }
  if (type === 'grade') {
    if (state.grade >= grades.length - 1) return log('이미 최고 등급입니다.', 'warn');
    if (state.gold < cost.gradeGold || state.dust < cost.gradeDust) return log('승급 재화가 부족합니다.', 'warn');
    state.gold -= cost.gradeGold;
    state.dust -= cost.gradeDust;
    state.grade++;
  }
  log('리밸런스 성장 강화 완료.', 'good');
  renderAll();
  saveGame();
}

function renderUpgrades() {
  const c = upgradeCosts();
  const note = `<div class="item stat-balance-note"><b>리밸런스 안내</b><br><span class="small">스탯 인플레를 낮추기 위해 강화 효율은 완만해지고, 고레벨 구간에는 소프트캡이 적용됩니다. 전장·던전·몬스터 기믹은 플레이어 피해량을 올리지 않습니다.</span></div>`;
  document.getElementById('upgradeList').innerHTML = note + [
    item('기본 피해 더하기 강화', `기본 피해 +2. 현재 기본 피해 수치: ${fmt(state.power)} / 비용: 골드 ${fmt(c.power)}`, `buyUpgrade('power')`),
    item('기본 피해 배수 강화', `현재 Lv.${state.powerMultLv || 0}, 배수 x${powerMultiplier().toFixed(2)} / 비용: 골드 ${fmt(c.powerMultGold)} + 룬조각 ${fmt(c.powerMultRune)}`, `buyUpgrade('powerMult')`, 'purple-btn'),
    item('발사 속도 훈련', `자동 공격 주기 감소. 비용: 골드 ${fmt(c.speed)}`, `buyUpgrade('speed')`),
    item('체력 더하기 강화', `최대 체력 +22. 현재 기본 체력: ${fmt(state.maxHp)} / 비용: 유물가루 ${fmt(c.hp)}`, `buyUpgrade('hp')`, 'red-btn'),
    item('체력 배수 강화', `현재 Lv.${state.hpMultLv || 0}, 배수 x${hpMultiplier().toFixed(2)} / 비용: 유물가루 ${fmt(c.hpMultDust)} + 영혼석 ${fmt(c.hpMultSoul)}`, `buyUpgrade('hpMult')`, 'purple-btn'),
    item('방어력 더하기 강화', `방어력 +7. 현재 방어력: ${fmt(getDefense())} / 피해 감소율 ${Math.round(defenseReductionRate()*100)}% / 비용: 유물가루 ${fmt(c.defense)}`, `buyUpgrade('defense')`, 'cyan-btn'),
    item('방어력 배수 강화', `현재 Lv.${state.defenseMultLv || 0}, 배수 x${defenseMultiplier().toFixed(2)} / 비용: 유물가루 ${fmt(c.defenseMultDust)} + 룬조각 ${fmt(c.defenseMultRune)}`, `buyUpgrade('defenseMult')`, 'purple-btn'),
    item('마나 회로', `최대 마나 +10. 비용: 마나수정 ${fmt(c.mp)}`, `buyUpgrade('mp')`, 'cyan-btn'),
    item('치명 각인', `치명타 확률 +1%. 비용: 룬조각 ${fmt(c.crit)}`, `buyUpgrade('crit')`),
    item('유물 핵 승급', state.grade >= grades.length - 1 ? '최고 등급' : `비용: 골드 ${fmt(c.gradeGold)} / 유물가루 ${fmt(c.gradeDust)}`, `buyUpgrade('grade')`, 'gold-btn'),
    item('환생하기', `25스테이지부터 가능. 예상 윤회석 ${fmt(rebirthPreview())}. 기본 성장은 초기화되고 무기고·패시브·분야 강화·환생 특성은 유지됩니다.`, 'prestige()', 'dark-btn'),
  ].join('');
}

function arenaVisualClassForCurrentBattle() {
  if (state.field && state.field !== 'normal') {
    if (state.field === 'barrierCity') return 'barrier-city';
    const f = fields[state.field] || {};
    return f.cls || 'special';
  }
  const region = currentNormalRegion ? currentNormalRegion() : null;
  return region?.cls || 'meadow';
}

const __oldRenderBattleVisual = typeof renderBattle === 'function' ? renderBattle : null;
renderBattle = function renderBattleVisualPatch() {
  if (__oldRenderBattleVisual) __oldRenderBattleVisual();
  const arena = document.getElementById('arena');
  if (arena) {
    const base = 'arena ' + arenaVisualClassForCurrentBattle();
    arena.className = base;
  }
  const enemy = state?.enemy || {};
  const element = String(enemy.element || enemy.trait || '').toLowerCase();
  const hpBar = document.getElementById('enemyHpBar');
  if (hpBar) {
    let c = ['#ef4444','#f97316','#facc15'];
    if (/화염|fire/.test(element)) c = ['#dc2626','#f97316','#facc15'];
    else if (/얼음|ice|서리/.test(element)) c = ['#e0f2fe','#38bdf8','#6366f1'];
    else if (/독|poison/.test(element)) c = ['#84cc16','#22c55e','#15803d'];
    else if (/번개|전기|lightning/.test(element)) c = ['#fde047','#38bdf8','#2563eb'];
    else if (/암흑|언데드|저주|공허/.test(element)) c = ['#7f1d1d','#7c3aed','#020617'];
    else if (/자연|초원|숲/.test(element)) c = ['#bbf7d0','#22c55e','#166534'];
    else if (/대지|금속/.test(element)) c = ['#fbbf24','#a16207','#44403c'];
    else if (/물|해저/.test(element)) c = ['#67e8f9','#0284c7','#1e3a8a'];
    else if (/시간/.test(element)) c = ['#facc15','#a855f7','#312e81'];
    hpBar.style.setProperty('--hp1', c[0]);
    hpBar.style.setProperty('--hp2', c[1]);
    hpBar.style.setProperty('--hp3', c[2]);
  }
}

// 최종 패치 후 게임 시작
loadGame();

/* 강화 체력바 + 아이콘형 아이템창 + 몬스터 공격 리밸런스 패치 */
(function reinforcedHpAndCombatPatch(){
  const PATCH_VERSION = 'reinforced-hp-v1';

  function enemyRankMultiplier(enemy, isBoss) {
    if (isBoss) return 4.2;
    if (enemy?.grade === '정예') return 1.65;
    if ((state?.field || 'normal') !== 'normal') return 1.25;
    return 0.85;
  }

  function calcFortifiedHp(enemy, isBoss) {
    const baseBar = Math.max(1, Number(state.enemyBarHp || 1));
    const stage = Math.max(1, Number(state.stage || 1));
    const barCount = Math.max(1, Number(state.enemyBarCount || 1));
    const rank = enemyRankMultiplier(enemy, isBoss);
    const scaling = 1 + Math.min(2.8, stage * 0.035) + Math.min(1.6, barCount * 0.018);
    return Math.max(0, Math.floor(baseBar * rank * scaling));
  }

  const oldApplyScaledEnemyHp = typeof applyScaledEnemyHp === 'function' ? applyScaledEnemyHp : null;
  if (oldApplyScaledEnemyHp) {
    applyScaledEnemyHp = function patchedApplyScaledEnemyHp(rawMaxHp, enemy, isBoss) {
      oldApplyScaledEnemyHp(rawMaxHp, enemy, isBoss);
      const fortified = calcFortifiedHp(enemy, isBoss);
      state.enemyFortifiedMax = fortified;
      state.enemyFortifiedHp = fortified;
      state.enemyFortifiedVersion = PATCH_VERSION;
    };
  }

  const oldDealEnemyDamage = typeof dealEnemyDamage === 'function' ? dealEnemyDamage : null;
  if (oldDealEnemyDamage) {
    dealEnemyDamage = function patchedDealEnemyDamage(amount, label = '') {
      ensureEnemyHpNumber();
      let safeDamage = Math.max(0, Math.floor(Number(amount) || 0));
      if (safeDamage <= 0 || state.resolvingEnemyDefeat) return 0;
      if (!Number.isFinite(state.enemyFortifiedHp)) state.enemyFortifiedHp = 0;
      if ((state.enemyInvincibleHits || 0) > 0) {
        state.enemyInvincibleHits--;
        createFloat('무적', 'mtext');
        return 0;
      }
      if (shouldTriggerEnemyInvincible()) return 0;
      let applied = 0;
      if (state.enemyFortifiedHp > 0) {
        const absorbed = Math.min(state.enemyFortifiedHp, safeDamage);
        state.enemyFortifiedHp -= absorbed;
        safeDamage -= absorbed;
        applied += absorbed;
        createFloat(`강화 체력 -${fmt(absorbed)}`, 'mtext');
      }
      if (safeDamage > 0) {
        state.enemyHp = Math.max(0, state.enemyHp - safeDamage);
        applied += safeDamage;
        if (state.enemyHp <= 0) state.enemyDefeatedPending = true;
      }
      return applied;
    };
  }

  const oldGetEnemyAttackCount = typeof getEnemyAttackCount === 'function' ? getEnemyAttackCount : null;
  if (oldGetEnemyAttackCount) {
    getEnemyAttackCount = function patchedGetEnemyAttackCount(mechanic) {
      let hits = oldGetEnemyAttackCount(mechanic);
      const enemy = state.enemy || {};
      hits += 2;
      if (enemy.grade === '정예') hits += 2;
      if (state.field !== 'normal') hits += 2;
      if (['multiHit','fast','shock','stormChain','comboSlash'].includes(mechanic)) hits += 3;
      if (['charge','ambush','execution','magicBurst','aoe','wave'].includes(mechanic)) hits += 2;
      if (state.boss) hits += 4 + Math.max(0, (state.bossPhase || 1) - 1) * 2;
      return Math.max(1, Math.min(state.boss ? 34 : 26, hits));
    };
  }

  const oldApplyPlayerDamageMultiHit = typeof applyPlayerDamageMultiHit === 'function' ? applyPlayerDamageMultiHit : null;
  if (oldApplyPlayerDamageMultiHit) {
    applyPlayerDamageMultiHit = function patchedApplyPlayerDamageMultiHit(totalDamage, hitCount, label = '') {
      const mechanic = state.boss ? currentBoss().mechanic : (state.enemy?.mechanic || currentField().mechanic);
      let factor = 1.55;
      if (state.field !== 'normal') factor += 0.30;
      if (state.boss) factor += 0.45;
      if (['crit','ambush','execution','charge','magicBurst'].includes(mechanic)) factor += 0.35;
      if (['multiHit','fast','shock','stormChain','comboSlash'].includes(mechanic)) factor += 0.25;
      if ((state.enemyInvincibleHits || 0) > 0) factor += 0.65;
      const arena = document.getElementById('arena');
      if (arena) {
        arena.classList.remove('monster-barrage-flash');
        void arena.offsetWidth;
        arena.classList.add('monster-barrage-flash');
      }
      return oldApplyPlayerDamageMultiHit(Math.floor(totalDamage * factor), hitCount, label);
    };
  }

  const oldRenderBattleForFortified = typeof renderBattle === 'function' ? renderBattle : null;
  if (oldRenderBattleForFortified) {
    renderBattle = function patchedRenderBattleFortified() {
      oldRenderBattleForFortified();
      const fortifiedBar = document.getElementById('enemyFortifiedHpBar');
      if (fortifiedBar) {
        const max = Math.max(1, Number(state.enemyFortifiedMax || 0));
        const hp = Math.max(0, Number(state.enemyFortifiedHp || 0));
        fortifiedBar.style.width = max > 0 ? Math.max(0, Math.min(100, hp / max * 100)) + '%' : '0%';
        fortifiedBar.style.display = hp > 0 ? 'block' : 'none';
      }
      const hpText = document.getElementById('enemyHpText');
      if (hpText && (state.enemyFortifiedHp || 0) > 0) {
        hpText.innerHTML = `${hpText.textContent} <span class="fortified-label">강화 ${fmt(state.enemyFortifiedHp)}</span>`;
      }
    };
  }

  // 무기고를 텍스트 목록이 아니라 아이콘 중심 아이템창으로 표시합니다.
  renderWeapons = function renderWeaponsIconInventory() {
    const box = document.getElementById('weaponList');
    if (!box) return;
    const list = weapons.map((w, i) => ({ ...w, id: i })).filter(w => {
      if (weaponFilter === 'owned') return state.weaponOwned[w.id];
      if (weaponFilter === 'locked') return !state.weaponOwned[w.id];
      return true;
    });
    box.innerHTML = `<div class="weapon-icon-grid">${list.map(w => {
      const owned = state.weaponOwned[w.id];
      const equipped = state.equippedWeapon === w.id;
      const lv = weaponLevel(w.id);
      const scale = 1 + (lv - 1) * .12;
      const upgradeCost = { gold: Math.floor(90 * Math.pow(1.22, lv + w.id)), dust: Math.floor(8 + lv * 3 + w.id * 4), rune: Math.floor(3 + lv + w.id) };
      return `<div class="weapon-icon-card ${equipped ? 'equipped' : ''} ${owned ? '' : 'locked'}" title="${w.desc}">
        <div class="weapon-big-icon">${w.icon || '🎒'}</div>
        <div class="weapon-name">${owned ? w.name : '미확인 장비'}</div>
        <div class="weapon-mini-stats">
          <span class="chip">Lv.${lv}</span>
          <span class="chip">⚔️+${Math.round((w.atk || 0) * scale * 100)}%</span>
          <span class="chip">🎯+${Math.floor((w.crit || 0) * scale)}%</span>
          <span class="chip">🛡️+${Math.floor((w.def || 0) * scale)}</span>
          <span class="chip">❤️+${Math.floor((w.hp || 0) * scale)}</span>
          <span class="chip">💠+${Math.floor((w.mp || 0) * scale)}</span>
          <span class="chip">💰+${Math.round((w.reward || 0) * scale * 100)}%</span>
        </div>
        <span class="small">${owned ? '해금됨' : '해금: ' + weaponCostText(w.cost)}</span>
        <div class="weapon-actions">
          <button ${owned ? 'disabled' : ''} onclick="unlockWeapon(${w.id})">${owned ? '보유' : '해금'}</button>
          <button ${owned ? '' : 'disabled'} onclick="equipWeapon(${w.id})">${equipped ? '장착중' : '장착'}</button>
        </div>
        <button class="purple-btn" ${owned ? '' : 'disabled'} onclick="upgradeWeapon(${w.id})" title="골드 ${fmt(upgradeCost.gold)} / 가루 ${fmt(upgradeCost.dust)} / 룬 ${fmt(upgradeCost.rune)}">강화</button>
      </div>`;
    }).join('')}</div>`;
  };

  const oldSpawnEnemy = typeof spawnEnemy === 'function' ? spawnEnemy : null;
  if (oldSpawnEnemy) {
    spawnEnemy = function patchedSpawnEnemy() {
      oldSpawnEnemy();
      if (!Number.isFinite(state.enemyFortifiedHp)) {
        const fortified = calcFortifiedHp(state.enemy, !!state.boss);
        state.enemyFortifiedMax = fortified;
        state.enemyFortifiedHp = fortified;
      }
    };
  }
})();
