const Road = require("./.road");

class GravelRoad extends Road {}

Building.buildingFactory(GravelRoad, {
  name: "Gravel Road",
  icon: `/${ICONS_PATH}/structures/greenland_sgi_152_road_gravel.png`,
  deteriorationRate: 4 * MONTHS,
  baseTime: 4 * MINUTES,
  mapGraphic: (node, structure) =>
    Road.SHOW_ROAD[node.getType()]
      ? {
          1: `tiles/structures/roads/gravel/hexroad-${structure.roadPattern ||
            "000000"}-00.png`
        }
      : {},
  obsoletes: ["DirtRoad"],
  buffs: {
    [BUFFS.TRAVEL_DIFFICULTY_OVERWORLD]: -1.3,
    [BUFFS.TRAVEL_TIME]: -30
  },
  research: {
    materials: {
      Sand: 0,
      Stone: 0,
      Clay: 0,
      ResearchConcept_RoadBuilding: 0
    }
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
  toolUtility: TOOL_UTILS.HAMMER,
  materials: {
    Sand: 30,
    Stone: 60,
    Clay: 5
  }
});

const crushGraniteRecipe = new Recipe({
  id: "CrushGranite",
  name: "Crush Granite",
  icon: Stone.prototype.icon,
  result: {
    Stone: 5
  },
  materials: {
    Granite: 1
  },
  toolUtility: TOOL_UTILS.HAMMER,
  baseTime: 20 * MINUTES
});

new Inspiration({
  name: `CrushGranite`,
  requirements: [
    ResearchConcept.knownItem("Stone"),
    ResearchConcept.knownItem("Granite"),
    ResearchConcept.knownBuildingPlan("GravelRoad")
  ],
  onInspire: player => {
    player.getCreature().learnCrafting(crushGraniteRecipe);
  }
});

module.exports = global.GravelRoad = GravelRoad;

new ResearchConcept({
  name: "Road Building",
  className: "ResearchConcept_RoadBuilding",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("Clay"),
    ResearchConcept.knownItem("Stone"),
    ResearchConcept.knownItem("Sand"),
    creature => !!Road.getRoad(creature.getNode())
  ]
});
