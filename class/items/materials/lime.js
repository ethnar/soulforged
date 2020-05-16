const Item = require("../.item");

class Lime extends Item {}
Item.itemFactory(Lime, {
  name: "Lime",
  icon: `/${ICONS_PATH}/items/materials/ash_b.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 1,
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Limestone: 1,
      Coal: 1
    },
    result: {
      Lime: 4
    },
    skill: SKILLS.SMELTING,
    skillLevel: 0,
    building: ["Kiln"],
    baseTime: 20 * MINUTES
  }
});
