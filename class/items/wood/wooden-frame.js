const Item = require("../.item");

class WoodenFrame extends Item {}
Item.itemFactory(WoodenFrame, {
  name: "Wooden Frame",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_n6_b.png`,
  weight: 3,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenPlank: 4,
      Glue: 8
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 8 * MINUTES
  }
});
module.exports = global.WoodenFrame = WoodenFrame;
