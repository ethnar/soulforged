const Trees = require("./.trees");
const Item = require("../../../items/.item");

class MahoganyWood extends Item {}
Object.assign(MahoganyWood.prototype, {
  name: "Mahogany Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/wd_b_03.png`,
  weight: 5,
  order: ITEMS_ORDER.OTHER
});

class Mahogany extends Trees {}
Object.assign(Mahogany.prototype, {
  name: "Mahoganies",
  sizeRange: [80, 190],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 5,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: MahoganyWood,
  baseTime: 60 * MINUTES,
  placement: {
    [NODE_TYPES.JUNGLE]: 100
  },
  twigsRatio: 12
});

module.exports = global.MahoganyWood = MahoganyWood;
module.exports = global.Mahogany = Mahogany;
