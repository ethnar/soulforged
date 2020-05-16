const Road = require("./.road");

class PavedRoad extends Road {}

Building.buildingFactory(PavedRoad, {
  name: "Paved Road",
  icon: `/${ICONS_PATH}/structures/greenland_sgi_152_road_paved.png`,
  deteriorationRate: 4 * MONTHS,
  baseTime: 12 * MINUTES,
  mapGraphic: (node, structure) =>
    Road.SHOW_ROAD[node.getType()]
      ? {
          1: `tiles/structures/roads/paved/hexroad-${structure.roadPattern ||
            "000000"}-00.png`
        }
      : {},
  obsoletes: ["DirtRoad", "GravelRoad"],
  buffs: {
    [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: -1.8,
    [BUFFS.TRAVEL_TIME]: -50
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_RoadBuilding: 0
    }
  },
  materials: {
    GraniteBlock: 30,
    Sand: 20,
    Glue: 10,
    Clay: 5
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
    NODE_TYPES.HILLS_COLD
    // NODE_TYPES.MOUNTAINS_SNOW,
    // NODE_TYPES.MOUNTAINS_COLD,
    // NODE_TYPES.MOUNTAINS_DIRT,
  ],
  toolUtility: TOOL_UTILS.HAMMER
});

module.exports = global.GravelRoad = GravelRoad;
