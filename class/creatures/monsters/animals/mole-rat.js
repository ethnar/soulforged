const Predator = require("./.predator");

module.exports = Monster.factory(class MoleRat extends Predator {}, {
  name: "Mole Rat",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/beest_02.png`,
  travelSpeed: 0.9,
  bloodPool: 15,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 13,
    [DAMAGE_TYPES.SLICE]: 8,
    [DAMAGE_TYPES.PIERCE]: 10
  },
  dodgeRating: 15,
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 12,
      [DAMAGE_TYPES.SLICE]: 24,
      [DAMAGE_TYPES.PIERCE]: 16
    },
    hitChance: 45
  },
  butcherable: {
    butcherTime: 20 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      VileMeat: 12,
      ToughMeat: 6,
      RatTail: 1
    }
  },
  placement: {
    // [NODE_TYPES.PLAINS]: 1,
    // [NODE_TYPES.DESERT_GRASS]: 6,
    // [NODE_TYPES.TROPICAL_PLAINS]: 19,
    // [NODE_TYPES.JUNGLE]: 12,
  },
  threatLevel: 9,
  stats: {
    [STATS.STRENGTH]: 31,
    [STATS.DEXTERITY]: 55,
    [STATS.ENDURANCE]: 55,
    [STATS.PERCEPTION]: 45,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FUR_TAN,
    SCOUTER_MESSAGES.TINY_POO,
    SCOUTER_MESSAGES.PAWS_REGULAR,
    SCOUTER_MESSAGES.SOUNDS_SCREECHING
  ]
});

Decoration.makeTrophy(
  MoleRat,
  [DECORATION_SLOTS.MEDIUM_HANGING_DECOR, DECORATION_SLOTS.LARGE_HANGING_DECOR],
  {
    WoodenBoard: 1,
    Clay: 6
  },
  {
    [BUFFS.MOOD]: -1,
    [BUFFS.SKILLS.DOCTORING]: 0.4
  }
);
