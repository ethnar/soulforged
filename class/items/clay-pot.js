const Item = require("./.item");

class ClayPot extends Item {}
Item.itemFactory(ClayPot, {
  nameable: true,
  name: "Clay Pot",
  icon: `/${ICONS_PATH}/items/am_b_03.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.2,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Clay: 1
    },
    building: ["Kiln"],
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
module.exports = global.ClayPot = ClayPot;
