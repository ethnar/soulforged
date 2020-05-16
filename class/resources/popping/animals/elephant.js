const Monster = require("../../../creatures/monsters/.monster");
const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class ElephantSkin extends Item {}
Item.itemFactory(ElephantSkin, {
  dynamicName: () => `${Nameable.getName("ElephantHerd")} Skin`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_118_b_gray.png`,
  weight: 1
});

class Ivory extends Item {}
Item.itemFactory(Ivory, {
  nameable: true,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/huntingicons_02_white.png`,
  weight: 3
});

module.exports = Monster.factory(class ElephantBull extends Monster {}, {
  nameable: false,
  dynamicName: () => `Enraged ${Nameable.getName("ElephantHerd")}`,
  icon: `/${ICONS_PATH}/resources/popping/animals/elephant_01.png`,
  dodgeRating: 5,
  bloodPool: 120,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 28,
    [DAMAGE_TYPES.SLICE]: 34,
    [DAMAGE_TYPES.PIERCE]: 42
  },
  defaultWeapon: {
    name: "Ram",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 25,
      [DAMAGE_TYPES.SLICE]: 10,
      [DAMAGE_TYPES.PIERCE]: 26
    },
    hitChance: 45
  },
  butcherable: {
    corpseName: () => Nameable.getName("ElephantHerd"),
    butcherName: () => `Butcher ${Nameable.getName("ElephantHerd")}`,
    butcherTime: 2 * HOURS,
    butcherSkillLevel: 5,
    produces: {
      ElephantSkin: 130,
      ToughMeat: 460,
      HeartyMeat: 260,
      Bone: 160,
      Ivory: 10 // 30
    }
  },
  threatLevel: 110,
  stats: {
    [STATS.STRENGTH]: 72,
    [STATS.DEXTERITY]: 52,
    [STATS.ENDURANCE]: 73,
    [STATS.PERCEPTION]: 41,
    [STATS.INTELLIGENCE]: 8
  },
  scouterMessages: [
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.FOOTPRINTS_HUGE,
    SCOUTER_MESSAGES.SOUNDS_TRUMPETING
  ]
});
global.ElephantCorpse = ElephantBullCorpse;

class ElephantHerd extends Prey {}
Entity.factory(ElephantHerd, {
  name: "Elephant",
  icon: `/${ICONS_PATH}/resources/popping/animals/elephant_01.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  sizeRange: [3, 7],
  baseTime: 5 * HOURS,
  skillLevel: 5,
  placement: {
    [NODE_TYPES.SAVANNAH]: 14,
    [NODE_TYPES.DESERT_GRASS]: 6
  },
  produces: (creature, core = false, resource) => {
    const chance = 33;

    if (!core && utils.random(chance)) {
      creature.getNode().spawnCreature(ElephantBull);
    }
    return ElephantBullCorpse;
  },
  activeFor: 4 * DAYS
});

module.exports = global.ElephantHerd = ElephantHerd;
