const Item = require("./.item");

class ClayFlask extends Item {}
Item.itemFactory(ClayFlask, {
  name: "Clay Flask",
  icon: `/${ICONS_PATH}/items/bottle_02.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.3,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Clay: 1,
      WillowWood: 1
    },
    building: ["Kiln"],
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  }
});
module.exports = global.ClayFlask = ClayFlask;
