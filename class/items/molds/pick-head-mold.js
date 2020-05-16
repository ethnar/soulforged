const Item = require("../.item");

class PickHeadMold extends Item {}
Item.itemFactory(PickHeadMold, {
  name: "Pick head mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/pick_b_02_copper_head_mold.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      StonePick: 0
    }
  },
  crafting: {
    materials: {
      Clay: 3,
      Sand: 2
    },
    building: ["Kiln"],
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 40 * MINUTES
  }
});

module.exports = global.PickHeadMold = PickHeadMold;
