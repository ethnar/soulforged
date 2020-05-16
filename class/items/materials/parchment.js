const Item = require("../.item");

class Parchment extends Item {}
Item.itemFactory(Parchment, {
  name: "Parchment",
  icon: `/${ICONS_PATH}/items/materials/pt_b_09.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Lime: 1,
      GoatHide: 1
    },
    result: {
      Parchment: 4
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
