const Predator = require("./.predator");

class DrakeScale extends Item {}
Item.itemFactory(DrakeScale, {
  dynamicName: () => `${Nameable.getName("FireDrake")} Scale`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/animals/9806_b_red.png`,
  weight: 2
});
global.DrakeScale = DrakeScale;

module.exports = Monster.factory(class FireDrake extends Predator {}, {
  name: "Drake",
  icon: `/${ICONS_PATH}/creatures/monsters/animals/62.png`,
  dodgeRating: 40,
  bloodPool: 35,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 21,
    [DAMAGE_TYPES.SLICE]: 12,
    [DAMAGE_TYPES.PIERCE]: 19,
    [DAMAGE_TYPES.BURN]: 44,
    [DAMAGE_TYPES.VENOM]: -22
  },
  defaultWeapon: [
    {
      name: "Claw",
      damage: {
        [DAMAGE_TYPES.SLICE]: 40,
        [DAMAGE_TYPES.PIERCE]: 30
      },
      hitChance: 85
    },
    {
      name: "Breath",
      damage: {
        [DAMAGE_TYPES.PIERCE]: 25,
        [DAMAGE_TYPES.BURN]: 20
      },
      hitChance: 55
    }
  ],
  butcherable: {
    butcherTime: 60 * MINUTES,
    butcherSkillLevel: 3,
    produces: {
      DrakeScale: 25,
      HeartyMeat: 35,
      TenderMeat: 20,
      ToughMeat: 5
    }
  },
  placement: {
    [NODE_TYPES.UNDERGROUND_VOLCANO]: 3,
    [NODE_TYPES.UNDERGROUND_LAVA_PLAINS]: 10
  },
  threatLevel: 35,
  stats: {
    [STATS.STRENGTH]: 55,
    [STATS.DEXTERITY]: 55,
    [STATS.ENDURANCE]: 60,
    [STATS.PERCEPTION]: 55,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.SCALE_FRAGMENTS,
    SCOUTER_MESSAGES.SOUNDS_HISSING,
    SCOUTER_MESSAGES.CLAW_MARKS_REGULAR
  ]
});
