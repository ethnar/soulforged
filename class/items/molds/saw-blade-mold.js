const Item = require("../.item");

class SawBladeMold extends Item {}
Item.itemFactory(SawBladeMold, {
  name: "Saw blade mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/155_b_saw_blade.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_MetalCasting: 0,
      ResearchConcept_ImproveSawing: 0
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

new ResearchConcept({
  name: "Better sawing tool",
  className: "ResearchConcept_ImproveSawing",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    ResearchConcept.knownItem("WoodenPlank"),
    ResearchConcept.knownItem("ResearchConcept_MetalCasting")
  ]
});

module.exports = global.SawBladeMold = SawBladeMold;
