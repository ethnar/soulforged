const Item = require("../.item");
const Inspiration = require("../../inspiration");

class HammerHeadMold extends Item {}
Item.itemFactory(HammerHeadMold, {
  name: "Hammer head mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/ni_b_03_copper_head_mold.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      StoneHammer: 0
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

module.exports = global.HammerHeadMold = HammerHeadMold;
