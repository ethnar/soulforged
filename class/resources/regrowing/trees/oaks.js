const Trees = require("./.trees");
const Item = require("../../../items/.item");

class OakWood extends Item {}
Object.assign(OakWood.prototype, {
  name: "Oak Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/wood_t_nobg.png`,
  weight: 5,
  order: ITEMS_ORDER.OTHER
});

class Oak extends Trees {}
Object.assign(Oak.prototype, {
  name: "Oaks",
  sizeRange: [120, 200],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 3,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: OakWood,
  baseTime: 30 * MINUTES,
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 20
  },
  twigsRatio: 12
});

module.exports = global.OakWood = OakWood;
module.exports = global.Oak = Oak;
