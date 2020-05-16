const Item = require("../.item");

class SpearHeadMold extends Item {}
Item.itemFactory(SpearHeadMold, {
  name: "Spear head mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/prehistoricicon_31_b_copper_head_mold_update.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      StoneSpear: 0
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

module.exports = global.SpearHeadMold = SpearHeadMold;
