const Item = require("../.item");

class Bonemeal extends Item {}
Item.itemFactory(Bonemeal, {
  name: "Bonemeal",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/alchemy/am_b_09_white.png`,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bone: 1
    },
    result: {
      Bonemeal: 10
    },
    skill: SKILLS.MILLING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.MILLING,
    baseTime: 15 * MINUTES
  }
});
module.exports = global.Bonemeal = Bonemeal;
