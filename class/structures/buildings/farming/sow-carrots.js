const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 1,
  plant: "Carrot",
  sowAmount: 10,
  producesRange: [13, 15],
  growthTime: 24 * HOURS,
  gatherTime: 4 * MINUTES,
  placement: [NODE_TYPES.PLAINS, NODE_TYPES.SCRUB_LAND]
});
