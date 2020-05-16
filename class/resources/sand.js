const Resource = require("./.resource");
const Item = require("../items/.item");

class Sand extends Item {}
Object.assign(Sand.prototype, {
  name: "Sand",
  icon: `/${ICONS_PATH}/resources/ash_b_sand.png`
});

class SandPile extends Resource {
  constructor(args) {
    super(args);
    this.setSize(Infinity);
  }
}
Object.assign(SandPile.prototype, {
  name: "Sand",
  skill: SKILLS.FORAGING,
  skillLevel: -2,
  produces: Sand,
  baseTime: 300,
  placement: {
    [NODE_TYPES.DESERT_SAND]: 100,
    [NODE_TYPES.SAVANNAH]: 30,
    [NODE_TYPES.CACTI]: 100,
    [NODE_TYPES.DESERT_PALMS]: 100,
    [NODE_TYPES.DESERT_GRASS]: 30,
    [NODE_TYPES.PLAINS]: 30,
    [NODE_TYPES.SCRUB_LAND]: 30,
    [NODE_TYPES.COLD_DIRT]: 30
  },
  placementCondition: node =>
    node.isCoast() || SandPile.prototype.placement[node.getType()] === 100
});

module.exports = global.Sand = Sand;
module.exports = global.SandPile = SandPile;
