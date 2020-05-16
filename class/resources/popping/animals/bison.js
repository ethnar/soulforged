const Monster = require("../../../creatures/monsters/.monster");
const Prey = require("./.prey");
const Corpse = require("../../../items/corpses/.corpse");

class BisonHide extends Item {}
Item.itemFactory(BisonHide, {
  dynamicName: () => `${Nameable.getName("BisonHerd")} Hide`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/animals/lz_b_03.png`,
  weight: 1
});

module.exports = Monster.factory(class BisonBull extends Monster {}, {
  nameable: false,
  dynamicName: () => `Enraged ${Nameable.getName("BisonHerd")}`,
  icon: `/${ICONS_PATH}/resources/popping/animals/ox_01.png`,
  dodgeRating: 35,
  bloodPool: 40,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 8,
    [DAMAGE_TYPES.SLICE]: 12,
    [DAMAGE_TYPES.PIERCE]: 16
  },
  defaultWeapon: {
    name: "Ram",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 15,
      [DAMAGE_TYPES.PIERCE]: 9
    },
    hitChance: 45
  },
  butcherable: {
    corpseName: () => Nameable.getName("BisonHerd"),
    butcherName: () => `Butcher ${Nameable.getName("BisonHerd")}`,
    butcherTime: 2 * HOURS,
    butcherSkillLevel: 4,
    produces: {
      BisonHide: 30,
      ToughMeat: 100,
      Bone: 20
    }
  },
  threatLevel: 20,
  stats: {
    [STATS.STRENGTH]: 65,
    [STATS.DEXTERITY]: 55,
    [STATS.ENDURANCE]: 60,
    [STATS.PERCEPTION]: 45,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.ANIMAL_POO,
    SCOUTER_MESSAGES.FUR_TAN,
    SCOUTER_MESSAGES.FUR_GREY
  ]
});
global.BisonCorpse = BisonBullCorpse;

class BisonHerd extends Prey {}
Entity.factory(BisonHerd, {
  name: "Bison",
  icon: `/${ICONS_PATH}/resources/popping/animals/ox_01.png`,
  skill: SKILLS.HUNTING,
  toolUtility: TOOL_UTILS.HUNTING,
  sizeRange: [3, 7],
  baseTime: 2 * HOURS,
  skillLevel: 4,
  placement: {
    [NODE_TYPES.COLD_DIRT]: 15,
    [NODE_TYPES.CONIFEROUS_FOREST]: 20
  },
  produces: (creature, core = false, resource) => {
    const chance = 7;

    if (!core && utils.random(chance)) {
      creature.getNode().spawnCreature(BisonBull);
    }
    return BisonBullCorpse;
  },
  activeFor: 4 * DAYS
});

module.exports = global.BisonHerd = BisonHerd;
