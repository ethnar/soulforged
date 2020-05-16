const Monster = require("./.monster");

class TrollTooth extends Item {}
Item.itemFactory(TrollTooth, {
  dynamicName: () => `${Nameable.getName("Troll")} Tooth`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/revantusk_01_b.png`,
  weight: 4
});

module.exports = Monster.factory(class Troll extends Monster {}, {
  name: "Troll",
  icon: `/${ICONS_PATH}/creatures/monsters/demon_02.png`,
  travelSpeed: 0.9,
  aggressiveness: 0,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 100,
    [DAMAGE_TYPES.SLICE]: 66,
    [DAMAGE_TYPES.PIERCE]: 86
  },
  dodgeRating: 5,
  defaultWeapon: {
    name: "Punch",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 65,
      [DAMAGE_TYPES.PIERCE]: 25
    },
    hitChance: 50
  },
  damageTime: {
    [DAMAGE_TYPES.SLICE]: 2 * HOURS,
    [DAMAGE_TYPES.INTERNAL_DAMAGE]: 12 * HOURS,
    [DAMAGE_TYPES.BLUNT]: 5 * HOURS,
    [DAMAGE_TYPES.VENOM]: 30 * MINUTES,
    [DAMAGE_TYPES.BURN]: 12 * DAYS
  },
  butcherable: {
    butcherTime: 2 * HOURS,
    butcherSkillLevel: 5,
    produces: {
      TrollTooth: 4,
      ToughMeat: 30,
      MysteryMeat: 250,
      Bone: 110,
      AncientBone: 10
    }
  },
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 1,
    [NODE_TYPES.HILLS_DIRT]: 1
  },
  scouterMessages: [
    SCOUTER_MESSAGES.CARCASSES_BONES,
    SCOUTER_MESSAGES.SOUNDS_ROARING,
    SCOUTER_MESSAGES.FOOTPRINTS_HUGE
  ],
  demolisher: 1.3,
  threatLevel: 100,
  stats: {
    [STATS.STRENGTH]: 85,
    [STATS.DEXTERITY]: 35,
    [STATS.ENDURANCE]: 85,
    [STATS.PERCEPTION]: 40,
    [STATS.INTELLIGENCE]: 4
  }
});
