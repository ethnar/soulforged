const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");

class SnakeSkin extends Item {}
Object.assign(SnakeSkin.prototype, {
  dynamicName: () => `${Nameable.getName("Snake")} Skin`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/lz_b_01.png`,
  weight: 1
});
module.exports = global.SnakeSkin = SnakeSkin;

module.exports = Monster.factory(class Snake extends Predator {}, {
  name: "Snake",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/snake_01_brown.png`,
  travelSpeed: 1,
  bloodPool: 3,
  dodgeRating: 25,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 0,
    [DAMAGE_TYPES.SLICE]: 6,
    [DAMAGE_TYPES.PIERCE]: 4
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 3,
      [DAMAGE_TYPES.PIERCE]: 5,
      [DAMAGE_TYPES.VENOM]: 2
    },
    hitChance: 90
  },
  butcherable: {
    butcherTime: 20 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      SnakeSkin: 6,
      VileMeat: 3,
      Bone: 3
    }
  },
  placement: {
    [NODE_TYPES.BOG]: 15,
    [NODE_TYPES.TROPICAL_PLAINS]: 50,
    [NODE_TYPES.JUNGLE]: 50,
    [NODE_TYPES.SAVANNAH]: 20,
    [NODE_TYPES.CACTI]: 20,
    [NODE_TYPES.SWAMP]: 20,
    [NODE_TYPES.DESERT_PALMS]: 20,
    [NODE_TYPES.DESERT_GRASS]: 20,
    [NODE_TYPES.PLAINS]: 20,
    [NODE_TYPES.SCRUB_LAND]: 20,
    [NODE_TYPES.BROADLEAF_FOREST]: 15
  },
  movementDelay: 12 * HOURS,
  threatLevel: 2,
  stats: {
    [STATS.STRENGTH]: 35,
    [STATS.DEXTERITY]: 55,
    [STATS.ENDURANCE]: 40,
    [STATS.PERCEPTION]: 45,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.TINY_POO,
    SCOUTER_MESSAGES.SOUNDS_HISSING,
    SCOUTER_MESSAGES.EGG_SHELLS,
    SCOUTER_MESSAGES.SCALE_FRAGMENTS
  ]
});
