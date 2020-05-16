const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 2,
  plant: "Wheat",
  sowAmount: 20,
  producesRange: [38, 50],
  growthTime: 48 * HOURS,
  gatherTime: 1 * MINUTES,
  placement: [NODE_TYPES.PLAINS]
});
