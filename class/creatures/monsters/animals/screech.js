const Predator = require("./.predator");

class ScreechFeather extends Item {}
Item.itemFactory(ScreechFeather, {
  dynamicName: () => `${Nameable.getName("Screech")} Feather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/huntingicons_74_purple.png`,
  weight: 0.01
});

module.exports = Monster.factory(class Screech extends Predator {}, {
  name: "Screech",
  icon: `/${ICONS_PATH}/creatures/monsters/bird_01.png`,
  travelSpeed: 0.9,
  dodgeRating: 70,
  bloodPool: 25,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 33,
    [DAMAGE_TYPES.SLICE]: 22,
    [DAMAGE_TYPES.PIERCE]: 28
  },
  defaultWeapon: {
    name: "Peck",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 3,
      [DAMAGE_TYPES.SLICE]: 21,
      [DAMAGE_TYPES.PIERCE]: 16
    },
    hitChance: 70
  },
  butcherable: {
    butcherTime: 60 * MINUTES,
    butcherSkillLevel: 3,
    produces: {
      ScreechFeather: 35,
      FowlMeat: 35,
      TenderMeat: 20,
      ToughMeat: 5
    }
  },
  placement: {
    [NODE_TYPES.PLAINS]: 1,
    [NODE_TYPES.DESERT_GRASS]: 6,
    [NODE_TYPES.TROPICAL_PLAINS]: 19,
    [NODE_TYPES.JUNGLE]: 12
  },
  threatLevel: 38,
  stats: {
    [STATS.STRENGTH]: 44,
    [STATS.DEXTERITY]: 54,
    [STATS.ENDURANCE]: 49,
    [STATS.PERCEPTION]: 62,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.SOUNDS_SCREECHING,
    SCOUTER_MESSAGES.CARCASSES_MEDIUM,
    SCOUTER_MESSAGES.FEATHERS,
    SCOUTER_MESSAGES.ANIMAL_POO
  ]
});

Decoration.makeTrophy(
  Screech,
  [DECORATION_SLOTS.LARGE_HANGING_DECOR],
  {
    HardwoodBoard: 1,
    Clay: 20
  },
  {
    [BUFFS.SKILLS.TRACKING]: 0.5,
    [BUFFS.TRAVEL_SPEED]: +8
  }
);
