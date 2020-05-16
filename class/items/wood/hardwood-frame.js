const Item = require("../.item");

class HardwoodFrame extends Item {}
Item.itemFactory(HardwoodFrame, {
  name: "Hardwood Frame",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_n6_b_dark.png`,
  weight: 3.75,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodPlank: 6,
      IronNails: 8
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 25 * MINUTES
  }
});
module.exports = global.HardwoodFrame = HardwoodFrame;
