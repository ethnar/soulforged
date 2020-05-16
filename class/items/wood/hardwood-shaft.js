const Item = require("../.item");

class HardwoodShaft extends Item {}
Item.itemFactory(HardwoodShaft, {
  name: "Hardwood Pole",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_b_04_dark.png`,
  weight: 0.5,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodBeam: 1
    },
    result: {
      HardwoodShaft: 4
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.WOODCUTTING,
    baseTime: 120 * MINUTES
  }
});
module.exports = global.HardwoodShaft = HardwoodShaft;
