const Monster = require("./.unliving");

module.exports = Monster.factory(class StoneGolem extends Monster {}, {
  name: "Golem",
  icon: `/${ICONS_PATH}/creatures/monsters/golem_02.png`,
  travelSpeed: 0.9,
  dodgeRating: 0,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 150,
    [DAMAGE_TYPES.SLICE]: 290,
    [DAMAGE_TYPES.PIERCE]: 300
  },
  defaultWeapon: {
    name: "Punch",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 140
    },
    hitChance: 40
  },
  butcherable: {
    butcherTime: 2 * HOURS,
    produces: {
      Galena: 20,
      Granite: 100,
      Stone: 40,
      Diamond: 1
    },
    butcherSkillLevel: 2,
    skill: SKILLS.MINING,
    toolUtility: TOOL_UTILS.MINING
  },
  placement: {
    [NODE_TYPES.HILLS_DIRT]: 1
  },
  demolisher: 1.3,
  threatLevel: 120,
  stats: {
    [STATS.STRENGTH]: 95,
    [STATS.DEXTERITY]: 20,
    [STATS.ENDURANCE]: 90,
    [STATS.PERCEPTION]: 50,
    [STATS.INTELLIGENCE]: 1
  },
  scouterMessages: [SCOUTER_MESSAGES.NONE]
});
