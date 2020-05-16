const Predator = require("./.predator");
const Corpse = require("../../../items/corpses/.corpse");

class CrocodileSkin extends Item {}
Object.assign(CrocodileSkin.prototype, {
  dynamicName: () => `${Nameable.getName("Crocodile")} Skin`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/lz_b_01_green.png`,
  weight: 1
});
module.exports = global.CrocodileSkin = CrocodileSkin;

module.exports = Monster.factory(class Crocodile extends Predator {}, {
  name: "Crocodile",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/crocodile_01.png`,
  travelSpeed: 1,
  bloodPool: 22,
  dodgeRating: 20,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 4,
    [DAMAGE_TYPES.SLICE]: 15,
    [DAMAGE_TYPES.PIERCE]: 8
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 24,
      [DAMAGE_TYPES.PIERCE]: 14
    },
    hitChance: 60
  },
  butcherable: {
    butcherTime: 20 * MINUTES,
    butcherSkillLevel: 2,
    produces: {
      CrocodileSkin: 25,
      ToughMeat: 10,
      VileMeat: 10,
      Bone: 10
    }
  },
  placement: {
    [NODE_TYPES.BOG]: 30,
    [NODE_TYPES.SWAMP]: 50
  },
  movementDelay: 12 * HOURS,
  threatLevel: 6,
  stats: {
    [STATS.STRENGTH]: 50,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 55,
    [STATS.PERCEPTION]: 40,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.CARCASSES_TINY,
    SCOUTER_MESSAGES.SCALE_FRAGMENTS,
    SCOUTER_MESSAGES.SOUNDS_HISSING
  ]
});
