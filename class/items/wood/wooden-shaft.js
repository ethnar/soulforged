const Item = require("../.item");

class WoodenShaft extends Item {}
Item.itemFactory(WoodenShaft, {
  name: "Wooden Pole",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_b_04.png`,
  weight: 0.4,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenBeam: 1
    },
    result: {
      WoodenShaft: 4
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.WOODCUTTING,
    baseTime: 40 * MINUTES
  }
});
module.exports = global.WoodenShaft = WoodenShaft;
