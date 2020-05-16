const Item = require("../.item");

class WoodenBoard extends Item {}
Item.itemFactory(WoodenBoard, {
  name: "Wooden Board",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/wd_n3_b.png`,
  weight: 7,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WoodenPlank: 5,
      WoodenFrame: 1,
      Glue: 6
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 4,
    baseTime: 30 * MINUTES
  }
});
module.exports = global.WoodenBoard = WoodenBoard;
