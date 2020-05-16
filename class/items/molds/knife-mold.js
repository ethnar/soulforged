const Item = require("../.item");
const Inspiration = require("../../inspiration");

class KnifeMold extends Item {}
Item.itemFactory(KnifeMold, {
  name: "Knife mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/kn_b_11_mold.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      StoneKnife: 0
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

module.exports = global.KnifeMold = KnifeMold;
