const Trees = require("./.trees");
const Item = require("../../../items/.item");

class PineWood extends Item {}
Object.assign(PineWood.prototype, {
  name: "Pine Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/147_b_dark.png`,
  weight: 4,
  order: ITEMS_ORDER.OTHER
});

class Pine extends Trees {}
Object.assign(Pine.prototype, {
  name: "Pines",
  sizeRange: [200, 400],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: PineWood,
  baseTime: 20 * MINUTES,
  placement: {
    [NODE_TYPES.CONIFEROUS_FOREST]: 8,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 12,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 20
  },
  twigsRatio: 2
});

module.exports = global.PineWood = PineWood;
module.exports = global.Pine = Pine;
