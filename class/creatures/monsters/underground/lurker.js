const Monster = require("../.monster");

// class TrollTooth extends Item {}
// Item.itemFactory(TrollTooth, {
//     name: 'TrollTooth',
//     order: ITEMS_ORDER.OTHER,
//     icon: `/${ICONS_PATH}/creatures/monsters/revantusk_01_b.png`,
//     weight: 4,
// });

module.exports = Monster.factory(class Lurker extends Monster {}, {
  name: "Lurker",
  icon: `/${ICONS_PATH}/creatures/monsters/underground/58.png`,
  travelSpeed: 0.6,
  dodgeRating: 45,
  bloodPool: 60,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 39,
    [DAMAGE_TYPES.SLICE]: 13,
    [DAMAGE_TYPES.PIERCE]: 33
  },
  defaultWeapon: {
    name: "Scratch",
    damage: {
      [DAMAGE_TYPES.SLICE]: 24,
      [DAMAGE_TYPES.PIERCE]: 14
    },
    hitChance: 75
  },
  butcherable: {
    butcherTime: 15 * MINUTES,
    butcherSkillLevel: 4,
    produces: {
      MysteryMeat: 80,
      Bone: 20
    }
  },
  placement: {
    [NODE_TYPES.UNDERGROUND_FLOOR]: 9,
    [NODE_TYPES.UNDERGROUND_CAVE]: 9
  },
  movementDelay: 8 * HOURS,
  demolisher: 0.4,
  threatLevel: 30,
  stats: {
    [STATS.STRENGTH]: 40,
    [STATS.DEXTERITY]: 55,
    [STATS.ENDURANCE]: 51,
    [STATS.PERCEPTION]: 15,
    [STATS.INTELLIGENCE]: 45
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FOOTPRINTS_HUMANOID,
    SCOUTER_MESSAGES.HUMANOID_FIGURE,
    SCOUTER_MESSAGES.SOUNDS_SCREECHING,
    SCOUTER_MESSAGES.SCALE_FRAGMENTS
  ]
});
