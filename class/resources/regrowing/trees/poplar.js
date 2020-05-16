const Trees = require("./.trees");
const Item = require("../../../items/.item");

class PoplarWood extends Item {}
Object.assign(PoplarWood.prototype, {
  name: "Poplar Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/wood_t_nobg_light.png`,
  weight: 4,
  order: ITEMS_ORDER.OTHER
});

class Poplar extends Trees {}
Object.assign(Poplar.prototype, {
  name: "Poplars",
  sizeRange: [120, 200],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 0,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: PoplarWood,
  baseTime: 12 * MINUTES,
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 100
  },
  twigsRatio: 5
});

module.exports = global.PoplarWood = PoplarWood;
module.exports = global.Poplar = Poplar;
