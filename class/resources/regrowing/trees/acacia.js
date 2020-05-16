const Trees = require("./.trees");
const Item = require("../../../items/.item");

class AcaciaWood extends Item {}
Object.assign(AcaciaWood.prototype, {
  name: "Acacia Wood",
  icon: `/${ICONS_PATH}/resources/regrowing/trees/foresticons_104_b.png`,
  weight: 5,
  order: ITEMS_ORDER.OTHER
});

class Acacia extends Trees {}
Object.assign(Acacia.prototype, {
  name: "Acacias",
  sizeRange: [30, 50],
  skill: SKILLS.WOODCUTTING,
  skillLevel: 3,
  toolUtility: TOOL_UTILS.WOODCUTTING,
  produces: AcaciaWood,
  baseTime: 45 * MINUTES,
  placement: {
    [NODE_TYPES.SAVANNAH]: 100
  },
  twigsRatio: 12
});

module.exports = global.AcaciaWood = AcaciaWood;
module.exports = global.Acacia = Acacia;
