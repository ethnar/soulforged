const Building = require("./.building");

class Fireplace extends Building {
  static getDescription() {
    return `A small fire to keep yourself warm and cook some basic meals. Twigs must be added frequently to keep the fire going.`;
  }

  earthQuakeDamage() {}
}
Building.buildingFactory(Fireplace, {
  name: "Small Campfire",
  deteriorationRate: 2 * DAYS,
  baseTime: 1 * MINUTES,
  icon: `/${ICONS_PATH}/structures/buildings/red_32.png`,
  noRuins: true,
  research: {
    sameAsCrafting: true
  },
  placement: [
    NODE_TYPES.TROPICAL_PLAINS,
    NODE_TYPES.DESERT_GRASS,
    NODE_TYPES.DESERT_SAND,
    NODE_TYPES.BOG,
    NODE_TYPES.PLAINS,
    NODE_TYPES.SCRUB_LAND,
    NODE_TYPES.SNOW_FIELDS,
    NODE_TYPES.PLAINS_SNOW,
    NODE_TYPES.COLD_DIRT,
    NODE_TYPES.JUNGLE,
    NODE_TYPES.SAVANNAH,
    NODE_TYPES.CACTI,
    NODE_TYPES.SWAMP,
    NODE_TYPES.BROADLEAF_FOREST,
    NODE_TYPES.DESERT_PALMS,
    NODE_TYPES.CONIFEROUS_FOREST_SNOWED,
    NODE_TYPES.CONIFEROUS_FOREST_COLD,
    NODE_TYPES.CONIFEROUS_FOREST,
    NODE_TYPES.HILLS_DIRT,
    NODE_TYPES.HILLS_REDGRASS,
    NODE_TYPES.HILLS_GRASS,
    NODE_TYPES.HILLS_SNOW,
    NODE_TYPES.HILLS_COLD,
    NODE_TYPES.MOUNTAINS_SNOW,
    NODE_TYPES.MOUNTAINS_COLD,
    NODE_TYPES.MOUNTAINS_DIRT,
    NODE_TYPES.UNDERGROUND_FLOOR,
    NODE_TYPES.UNDERGROUND_CAVE,
    NODE_TYPES.UNDERGROUND_WALL
  ],
  toolUtility: TOOL_UTILS.FIRESTARTER,
  materials: {
    Twig: 10,
    Stone: 4
  },
  repair: {
    materials: {
      Twig: 10
    }
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1
  }
});
module.exports = global.Fireplace = Fireplace;
