const Trees = require("./.trees");
const Item = require("../../../items/.item");

class WillowWood extends Item {}
Object.assign(WillowWood.prototype, {
  name: "Willow Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/193_b_saturated.png`,
  weight: 2,
  order: ITEMS_ORDER.OTHER
});

class Willow extends Trees {}
Object.assign(Willow.prototype, {
  name: "Willows",
  sizeRange: [40, 70],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: WillowWood,
  baseTime: 30 * MINUTES,
  placement: {
    [NODE_TYPES.SWAMP]: 100
  },
  twigsRatio: 12
});

module.exports = global.WillowWood = WillowWood;
module.exports = global.Willow = Willow;
