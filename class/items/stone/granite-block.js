const Item = require("../.item");

class GraniteBlock extends Item {}
Item.itemFactory(GraniteBlock, {
  name: "Granite Block",
  icon: `/${ICONS_PATH}/items/stone/st_b_05_gray.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Granite: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.CARVING,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.GraniteBlock = GraniteBlock;
