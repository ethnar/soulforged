const Predator = require("./.predator");

class RatTail extends Item {}
Item.itemFactory(RatTail, {
  dynamicName: () => `${Nameable.getName("Rat")} Tail`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/tail_b_05.png`,
  weight: 0.1
});

module.exports = Monster.factory(class Rat extends Predator {}, {
  name: "Giant Rat",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/rat_01.png`,
  travelSpeed: 0.9,
  bloodPool: 1,
  dodgeRating: 110,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 4,
    [DAMAGE_TYPES.SLICE]: -8,
    [DAMAGE_TYPES.PIERCE]: -4
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 0,
      [DAMAGE_TYPES.SLICE]: 3,
      [DAMAGE_TYPES.PIERCE]: 1
    },
    hitChance: 40
  },
  butcherable: {
    butcherTime: 4 * MINUTES,
    butcherSkillLevel: 0,
    produces: {
      VileMeat: 3,
      ToughMeat: 1,
      RatTail: 1
    }
  },
  placement: {
    // [NODE_TYPES.PLAINS]: 1,
    // [NODE_TYPES.DESERT_GRASS]: 6,
    // [NODE_TYPES.TROPICAL_PLAINS]: 19,
    // [NODE_TYPES.JUNGLE]: 12,
  },
  threatLevel: 1,
  stats: {
    [STATS.STRENGTH]: 11,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 35,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.TINY_POO,
    SCOUTER_MESSAGES.PAWS_TINY,
    SCOUTER_MESSAGES.SOUNDS_SCREECHING,
    SCOUTER_MESSAGES.FUR_GREY
  ]
});
