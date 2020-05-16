const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 0,
  plant: "Onion",
  sowAmount: 10,
  producesRange: [15, 20],
  growthTime: 24 * HOURS,
  gatherTime: 4 * MINUTES,
  placement: [NODE_TYPES.PLAINS, NODE_TYPES.TROPICAL_PLAINS]
});
