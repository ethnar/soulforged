const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 4,
  plant: "Dragonfruit",
  sowAmount: 5,
  producesRange: [10, 15],
  growthTime: 3 * DAYS,
  gatherTime: 5 * MINUTES,
  placement: [NODE_TYPES.TROPICAL_PLAINS]
});
