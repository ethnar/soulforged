const Predator = require("./.predator");
require("./desert-spider");

module.exports = Monster.factory(class CaveSpider extends Spider {}, {
  name: "Spider",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/57.png`,
  travelSpeed: 0.8,
  bloodPool: 12,
  websCounts: [1, 6],
  dodgeRating: 80,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 11,
    [DAMAGE_TYPES.SLICE]: 16,
    [DAMAGE_TYPES.PIERCE]: 15
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 7,
      [DAMAGE_TYPES.PIERCE]: 4,
      [DAMAGE_TYPES.VENOM]: 2
    },
    hitChance: 85
  },
  butcherable: {
    butcherTime: 15 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      VileMeat: 15,
      SpiderIchor: 2,
      SpiderLeg: 8
    }
  },
  placement: {
    [NODE_TYPES.UNDERGROUND_FLOOR]: 40,
    [NODE_TYPES.UNDERGROUND_CAVE]: 40
  },
  movementDelay: 8 * HOURS,
  threatLevel: 8,
  stats: {
    [STATS.STRENGTH]: 44,
    [STATS.DEXTERITY]: 44,
    [STATS.ENDURANCE]: 44,
    [STATS.PERCEPTION]: 35,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.WEBS_LARGE,
    SCOUTER_MESSAGES.INSECT_PIECES,
    SCOUTER_MESSAGES.SOUNDS_SKITTERING
  ],
  taming: {
    tool: "CaveSpiderTamingTool",
    food: "VileMeat",
    skillLevel: 4,
    tamenessGains: [2, 6],
    tamedCycle: (creature, seconds) => {
      creature.doHunting(seconds);
    }
  }
});
