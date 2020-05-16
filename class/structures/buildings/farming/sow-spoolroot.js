const Sowing = require("./.sowing");

module.exports = Sowing.allowSowPlant({
  skillLevel: 1,
  plant: "Spoolroot",
  sowAmount: 20,
  producesRange: [30, 50],
  growthTime: 48 * HOURS,
  gatherTime: 2 * MINUTES,
  placement: [
    NODE_TYPES.PLAINS,
    NODE_TYPES.TROPICAL_PLAINS,
    NODE_TYPES.SCRUB_LAND,
    NODE_TYPES.DESERT_GRASS
  ]
});
