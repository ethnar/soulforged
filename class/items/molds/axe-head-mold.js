const Item = require("../.item");

class AxeHeadMold extends Item {}
Item.itemFactory(AxeHeadMold, {
  name: "Axe head mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/nw_b_03_copper_head_mold.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      StoneHatchet: 0
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

module.exports = global.AxeHeadMold = AxeHeadMold;
