const Item = require("../.item");

class SharpenedStone extends Item {}
Item.itemFactory(SharpenedStone, {
  name: "Sharpened Stone",
  icon: `/${ICONS_PATH}/items/equipment/st_b_03_gray.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 0.8,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 0.2,
    [TOOL_UTILS.CUTTING]: 0.2
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Stone: 1
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.CRAFTING,
    skillLevel: -1,
    baseTime: 15
  }
});
module.exports = global.SharpenedStone = SharpenedStone;
