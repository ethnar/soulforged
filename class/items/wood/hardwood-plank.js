const Item = require("../.item");

class HardwoodPlank extends Item {}
Item.itemFactory(HardwoodPlank, {
  name: "Hardwood Plank",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_b_07_dark.png`,
  weight: 0.8,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodBeam: 1
    },
    result: {
      HardwoodPlank: 3
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 40 * MINUTES
  }
});
module.exports = global.HardwoodPlank = HardwoodPlank;
