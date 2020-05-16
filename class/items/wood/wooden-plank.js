const Item = require("../.item");

class WoodenPlank extends Item {}
Item.itemFactory(WoodenPlank, {
  name: "Wooden Plank",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_b_07.png`,
  weight: 0.65,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenBeam: 1
    },
    result: {
      WoodenPlank: 3
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 13 * MINUTES
  }
});
module.exports = global.WoodenPlank = WoodenPlank;
