const Monster = require("./.monster");

class PlaguebeastTail extends ExpirableItem {}
Item.itemFactory(PlaguebeastTail, {
  dynamicName: () => `${Nameable.getName("Plaguebeast")} Tail`,
  order: ITEMS_ORDER.OTHER,
  expiresIn: 5 * DAYS,
  icon: `/${ICONS_PATH}/creatures/monsters/prickly_root_b.png`,
  weight: 5
});

class PlaguebeastAppendage extends Item {}
Item.itemFactory(PlaguebeastAppendage, {
  dynamicName: () => `${Nameable.getName("Plaguebeast")} Appendage`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/leg_b_01.png`,
  weight: 3
});

module.exports = Monster.factory(class Plaguebeast extends Monster {}, {
  name: "Plaguebeast",
  icon: `/${ICONS_PATH}/creatures/monsters/plant_monster_01.png`,
  travelSpeed: 0.9,
  aggressiveness: 85,
  bloodPool: 60,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 22,
    [DAMAGE_TYPES.SLICE]: 22,
    [DAMAGE_TYPES.PIERCE]: 22
  },
  dodgeRating: 35,
  defaultWeapon: {
    name: "Slash",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 8,
      [DAMAGE_TYPES.SLICE]: 65,
      [DAMAGE_TYPES.PIERCE]: 42,
      [DAMAGE_TYPES.VENOM]: 54
    },
    hitChance: 65
  },
  butcherable: {
    butcherTime: 60 * MINUTES,
    butcherSkillLevel: 5,
    produces: {
      PlaguebeastAppendage: 5,
      PlaguebeastTail: 1,
      VileMeat: 80,
      TenderMeat: 20
    }
  },
  placement: {
    [NODE_TYPES.BOG]: 1,
    [NODE_TYPES.SWAMP]: 2,
    [NODE_TYPES.TROPICAL_PLAINS]: 1,
    [NODE_TYPES.JUNGLE]: 1
  },
  threatLevel: 85,
  scouterMessages: [
    SCOUTER_MESSAGES.CLAW_MARKS_HUGE,
    SCOUTER_MESSAGES.SLIME,
    SCOUTER_MESSAGES.CARCASSES_BONES
  ],
  stats: {
    [STATS.STRENGTH]: 75,
    [STATS.DEXTERITY]: 45,
    [STATS.ENDURANCE]: 60,
    [STATS.PERCEPTION]: 22,
    [STATS.INTELLIGENCE]: 1
  }
});
