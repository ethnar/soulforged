const Monster = require("../.monster");

class HeartOfDarkness extends Item {}
Item.itemFactory(HeartOfDarkness, {
  name: "Heart of Darkness",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/huntingicons_97_black.png`,
  weight: 5
});

module.exports = Monster.factory(class Nightcrawler extends Monster {}, {
  name: "Nightcrawler",
  icon: `/${ICONS_PATH}/creatures/monsters/underground/55.png`,
  aggressiveness: 20,
  travelSpeed: 0.7,
  dodgeRating: 60,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 130,
    [DAMAGE_TYPES.SLICE]: 55,
    [DAMAGE_TYPES.PIERCE]: 82
  },
  defaultWeapon: {
    name: "Claw",
    damage: {
      [DAMAGE_TYPES.SLICE]: 85,
      [DAMAGE_TYPES.PIERCE]: 42
    },
    hitChance: 75
  },
  butcherable: {
    butcherTime: 60 * MINUTES,
    butcherSkillLevel: 6,
    produces: {
      ToughMeat: 80,
      MysteryMeat: 160,
      Bone: 90,
      HeartOfDarkness: 1
    }
  },
  placement: {
    [NODE_TYPES.UNDERGROUND_FLOOR]: 1,
    [NODE_TYPES.UNDERGROUND_CAVE]: 1
  },
  movementDelay: 12 * HOURS,
  demolisher: 1.5,
  threatLevel: 320,
  stats: {
    [STATS.STRENGTH]: 75,
    [STATS.DEXTERITY]: 80,
    [STATS.ENDURANCE]: 77,
    [STATS.PERCEPTION]: 35,
    [STATS.INTELLIGENCE]: 45
  },
  scouterMessages: [
    SCOUTER_MESSAGES.CLAW_MARKS_HUGE,
    SCOUTER_MESSAGES.SOUNDS_HISSING,
    SCOUTER_MESSAGES.CARCASSES_BONES
  ]
});
