const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");

module.exports = Monster.factory(class VenomSnake extends Predator {}, {
  name: "VenomSnake",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/snake_01_green.png`,
  travelSpeed: 1,
  bloodPool: 6,
  dodgeRating: 15,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 5,
    [DAMAGE_TYPES.SLICE]: 11,
    [DAMAGE_TYPES.PIERCE]: 9
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 3,
      [DAMAGE_TYPES.PIERCE]: 5,
      [DAMAGE_TYPES.VENOM]: 50
    },
    hitChance: 105
  },
  butcherable: {
    butcherTime: 20 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      SnakeSkin: 6,
      VileMeat: 2,
      ToughMeat: 1,
      Bone: 3
    }
  },
  placement: {},
  movementDelay: 12 * HOURS,
  threatLevel: 8,
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
    SCOUTER_MESSAGES.CARCASSES_MEDIUM,
    SCOUTER_MESSAGES.SCALE_FRAGMENTS
  ]
});
