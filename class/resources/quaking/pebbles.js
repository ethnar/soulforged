const QuakingResource = require("./.quaking-resource");
const Stone = require("../../items/equipment/stone");

class Pebbles extends QuakingResource {}
Object.assign(Pebbles.prototype, {
  nameable: false,
  name: "Stones",
  sizeRange: [20, 60],
  skill: SKILLS.FORAGING,
  skillLevel: -1,
  gatherActionLabel: "Gather",
  produces: Stone,
  placement: {
    [NODE_TYPES.SNOW_FIELDS]: 0,
    [NODE_TYPES.BOG]: 1,
    [NODE_TYPES.TROPICAL_PLAINS]: 1,
    [NODE_TYPES.DESERT_SAND]: 1,
    [NODE_TYPES.JUNGLE]: 1,
    [NODE_TYPES.SAVANNAH]: 1,
    [NODE_TYPES.CACTI]: 1,
    [NODE_TYPES.SWAMP]: 1,
    [NODE_TYPES.DESERT_PALMS]: 1,
    [NODE_TYPES.DESERT_GRASS]: 30,
    [NODE_TYPES.PLAINS]: 30,
    [NODE_TYPES.SCRUB_LAND]: 30,
    [NODE_TYPES.PLAINS_SNOW]: 30,
    [NODE_TYPES.COLD_DIRT]: 30,
    [NODE_TYPES.BROADLEAF_FOREST]: 30,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 30,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 30,
    [NODE_TYPES.CONIFEROUS_FOREST]: 30,
    [NODE_TYPES.HILLS_DIRT]: 60,
    [NODE_TYPES.HILLS_REDGRASS]: 60,
    [NODE_TYPES.HILLS_GRASS]: 60,
    [NODE_TYPES.HILLS_SNOW]: 60,
    [NODE_TYPES.HILLS_COLD]: 60,
    [NODE_TYPES.MOUNTAINS_DIRT]: 90,
    [NODE_TYPES.MOUNTAINS_COLD]: 90,
    [NODE_TYPES.MOUNTAINS_SNOW]: 90,
    [NODE_TYPES.UNDERGROUND_CAVE]: 95,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 95
  },
  baseTime: 6
});

module.exports = global.Pebbles = Pebbles;
