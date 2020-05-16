const Item = require("../.item");

class HardwoodBoard extends Item {}
Item.itemFactory(HardwoodBoard, {
  name: "Hardwood Board",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_n3_b_dark.png`,
  weight: 6.75,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      HardwoodPlank: 5,
      HardwoodFrame: 1,
      IronNails: 6
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 5,
    baseTime: 40 * MINUTES
  }
});
module.exports = global.HardwoodBoard = HardwoodBoard;
