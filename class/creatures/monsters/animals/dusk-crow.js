const Predator = require("./.predator");

class DuskCrowFeather extends Item {}
Item.itemFactory(DuskCrowFeather, {
  dynamicName: () => `${Nameable.getName("DuskCrow")} Feather`,
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/creatures/monsters/feather_b_05_black.png`,
  weight: 0.01
});

module.exports = Monster.factory(class DuskCrow extends Predator {}, {
  name: "Dusk Crow",
  icon: `/${ICONS_PATH}/creatures/monsters/56.png`,
  travelSpeed: 1.6,
  bloodPool: 4,
  dodgeRating: 150,
  defaultArmor: {
    [DAMAGE_TYPES.BLUNT]: 13,
    [DAMAGE_TYPES.SLICE]: 6,
    [DAMAGE_TYPES.PIERCE]: 9
  },
  defaultWeapon: {
    name: "Peck",
    damage: {
      [DAMAGE_TYPES.BLUNT]: 0.5,
      [DAMAGE_TYPES.SLICE]: 8,
      [DAMAGE_TYPES.PIERCE]: 4
    },
    hitChance: 90
  },
  butcherable: {
    butcherTime: 15 * MINUTES,
    butcherSkillLevel: 1,
    produces: {
      DuskCrowFeather: 35,
      FowlMeat: 10,
      HeartyMeat: 5
    }
  },
  placement: {
    // [NODE_TYPES.COAST]: 4,
    [NODE_TYPES.TROPICAL_PLAINS]: 4,
    [NODE_TYPES.DESERT_GRASS]: 4,
    [NODE_TYPES.DESERT_SAND]: 4,
    [NODE_TYPES.BOG]: 4,
    [NODE_TYPES.PLAINS]: 4,
    [NODE_TYPES.SCRUB_LAND]: 4,
    [NODE_TYPES.SNOW_FIELDS]: 4,
    [NODE_TYPES.PLAINS_SNOW]: 4,
    [NODE_TYPES.COLD_DIRT]: 4,
    [NODE_TYPES.JUNGLE]: 4,
    [NODE_TYPES.SAVANNAH]: 4,
    [NODE_TYPES.CACTI]: 4,
    [NODE_TYPES.SWAMP]: 4,
    [NODE_TYPES.BROADLEAF_FOREST]: 4,
    [NODE_TYPES.DESERT_PALMS]: 4,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 4,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 4,
    [NODE_TYPES.CONIFEROUS_FOREST]: 4,
    [NODE_TYPES.HILLS_DIRT]: 4,
    [NODE_TYPES.HILLS_REDGRASS]: 4,
    [NODE_TYPES.HILLS_GRASS]: 4,
    [NODE_TYPES.HILLS_SNOW]: 4,
    [NODE_TYPES.HILLS_COLD]: 4,
    [NODE_TYPES.MOUNTAINS_DIRT]: 4,
    [NODE_TYPES.MOUNTAINS_COLD]: 4,
    [NODE_TYPES.MOUNTAINS_SNOW]: 4
  },
  threatLevel: 6,
  stats: {
    [STATS.STRENGTH]: 44,
    [STATS.DEXTERITY]: 52,
    [STATS.ENDURANCE]: 43,
    [STATS.PERCEPTION]: 64,
    [STATS.INTELLIGENCE]: 5
  },
  scouterMessages: [
    SCOUTER_MESSAGES.FLYING,
    SCOUTER_MESSAGES.EGG_SHELLS,
    SCOUTER_MESSAGES.FEATHERS,
    SCOUTER_MESSAGES.SOUNDS_SCREECHING
  ]
});
