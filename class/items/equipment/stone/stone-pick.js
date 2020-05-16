const Item = require("../../.item");

class StonePick extends Item {}
Item.itemFactory(StonePick, {
  name: "Stone Pick",
  order: ITEMS_ORDER.TOOLS,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/stone/prehistoricicon_42_b_gray.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MINING]: 1,
    [TOOL_UTILS.CARVING]: 0.2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      Stone: 0
    }
  },
  crafting: {
    materials: {
      SharpenedStone: 2,
      BarkRope: 1,
      Twig: 1
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.CRAFTING,
    baseTime: 120
  }
});
module.exports = global.StonePick = StonePick;
