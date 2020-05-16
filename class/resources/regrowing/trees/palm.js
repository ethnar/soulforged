const Trees = require("./.trees");
const Item = require("../../../items/.item");

class PalmWood extends Item {}
Object.assign(PalmWood.prototype, {
  name: "Palm Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/bamboo_b_01_single.png`,
  weight: 2,
  order: ITEMS_ORDER.OTHER
});

class Palm extends Trees {}
Object.assign(Palm.prototype, {
  name: "Palms",
  sizeRange: [30, 50],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: PalmWood,
  baseTime: 30 * MINUTES,
  placement: {
    [NODE_TYPES.DESERT_PALMS]: 100
  },
  twigsRatio: 12
});

module.exports = global.PalmWood = PalmWood;
module.exports = global.Palm = Palm;
