const Trees = require("./.trees");
const Item = require("../../../items/.item");

class SpruceWood extends Item {}
Object.assign(SpruceWood.prototype, {
  name: "Spruce Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/147_b.png`,
  weight: 4,
  order: ITEMS_ORDER.OTHER
});

class Spruce extends Trees {}
Object.assign(Spruce.prototype, {
  name: "Spruces",
  sizeRange: [130, 200],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: SpruceWood,
  baseTime: 10 * MINUTES,
  placement: {
    [NODE_TYPES.CONIFEROUS_FOREST]: 100,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 95,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 90
  },
  twigsRatio: 6
});

module.exports = global.SpruceWood = SpruceWood;
module.exports = global.Spruce = Spruce;
