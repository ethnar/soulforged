const Item = require("../.item");

class Bricks extends Item {}
Item.itemFactory(Bricks, {
  name: "Bricks",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/materials/sgi_23_black_bg.png`,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Clay: 3,
      Firewood: 5
    },
    skill: SKILLS.CRAFTING,
    building: ["Kiln"],
    skillLevel: 4,
    baseTime: 10 * MINUTES
  }
});
module.exports = global.Bricks = Bricks;
