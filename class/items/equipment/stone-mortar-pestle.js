const Item = require("../.item");

class MortarPestle extends Item {}
Item.itemFactory(MortarPestle, {
  name: "Simple Mortar & Pestle",
  order: ITEMS_ORDER.TOOLS,
  icon: `/${ICONS_PATH}/items/equipment/prehistoricicon_29_b_gray.png`,
  weight: 5,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MILLING]: 0.6
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Stone: 1,
      Granite: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  }
});
module.exports = global.MortarPestle = MortarPestle;
