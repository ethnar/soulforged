const Spider = require("./.spider");

class SpiderLeg extends Item {}
Item.itemFactory(SpiderLeg, {
  name: "Spider Leg",
  nameable: true,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/lpp_01_b.png`,
  weight: 0.2
});
module.exports = global.SpiderLeg = SpiderLeg;

module.exports = Monster.factory(class ForestSpider extends Spider {}, {
  name: "Spider",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/spellbookpage09_113.png`,
  travelSpeed: 0.7,
  bloodPool: 3,
  websCounts: [0, 2],
  dodgeRating: 90,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 2,
    [DAMAGE_TYPES.SLICE]: -1,
    [DAMAGE_TYPES.PIERCE]: -1
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 6,
      [DAMAGE_TYPES.PIERCE]: 3
    },
    hitChance: 95
  },
  butcherable: {
    butcherTime: 15 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      VileMeat: 8,
      SpiderLeg: 8
    }
  },
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 100,
    [NODE_TYPES.CONIFEROUS_FOREST]: 20
  },
  movementDelay: 12 * HOURS,
  threatLevel: 1,
  stats: {
    [STATS.STRENGTH]: 45,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 45,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.SOUNDS_SKITTERING,
    SCOUTER_MESSAGES.WEBS_SMALL,
    SCOUTER_MESSAGES.INSECT_PIECES
  ],
  taming: {
    tool: "ForestSpiderTamingTool",
    food: "VileMeat",
    skillLevel: 2,
    tamenessGains: [2, 10],
    tamedCycle: (creature, seconds) => {
      creature.doHunting(seconds);
    }
  }
});
