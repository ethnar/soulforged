const Item = require("../.item");

class BasicMortarPestle extends Item {}
Item.itemFactory(BasicMortarPestle, {
  name: "Wooden Mortar & Pestle",
  order: ITEMS_ORDER.TOOLS,
  icon: `/${ICONS_PATH}/items/equipment/witchcrafticons_91_b.png`,
  weight: 3,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.MILLING]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      OakWood: 1,
      HardwoodShaft: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    baseTime: 40 * MINUTES
  }
});
module.exports = global.BasicMortarPestle = BasicMortarPestle;
