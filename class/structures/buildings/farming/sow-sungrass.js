const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 3,
  plant: "Sungrass",
  sowAmount: 20,
  producesRange: [30, 50],
  growthTime: 48 * HOURS,
  gatherTime: 2 * MINUTES,
  placement: [NODE_TYPES.DESERT_GRASS]
});
