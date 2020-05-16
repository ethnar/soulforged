const Spider = require("./.spider");
require("./forest-spider");

class SpiderIchor extends Item {}
Item.itemFactory(SpiderIchor, {
  name: "Ichor",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/am_b_05.png`,
  weight: 0.5
});

module.exports = Monster.factory(class DesertSpider extends Spider {}, {
  name: "Spider",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/80.png`,
  travelSpeed: 0.8,
  websCounts: [2, 8],
  dodgeRating: 65,
  bloodPool: 20,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 18,
    [DAMAGE_TYPES.SLICE]: 22,
    [DAMAGE_TYPES.PIERCE]: 23
  },
  defaultWeapon: {
    name: "Bite",
    damage: {
      [DAMAGE_TYPES.SLICE]: 10,
      [DAMAGE_TYPES.PIERCE]: 7,
      [DAMAGE_TYPES.VENOM]: 5
    },
    hitChance: 85
  },
  butcherable: {
    butcherTime: 15 * MINUTES,
    butcherSkillLevel: 2,
    produces: {
      VileMeat: 20,
      ToughMeat: 10,
      SpiderIchor: 4,
      SpiderLeg: 8
    }
  },
  placement: {
    [NODE_TYPES.DESERT_SAND]: 50,
    [NODE_TYPES.DESERT_PALMS]: 50,
    [NODE_TYPES.SAVANNAH]: 8,
    [NODE_TYPES.CACTI]: 35,
    [NODE_TYPES.DESERT_GRASS]: 30,
    [NODE_TYPES.SCRUB_LAND]: 10
  },
  movementDelay: 8 * HOURS,
  threatLevel: 16,
  stats: {
    [STATS.STRENGTH]: 45,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 45,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.WEBS_HUGE,
    SCOUTER_MESSAGES.SOUNDS_SKITTERING,
    SCOUTER_MESSAGES.INSECT_PIECES
  ]
});
