const Item = require("../.item");

class IngotMold extends Item {}
Item.itemFactory(IngotMold, {
  name: "Ingot mold",
  order: ITEMS_ORDER.OTHER,
  weight: 5,
  icon: `/${ICONS_PATH}/items/molds/prehistoricicon_31_b_ingot.png`,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Smithing: 0,
      MeltedIron: 0
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
  name: "Smithing",
  className: "ResearchConcept_Smithing",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.knownItem("MeltedIron")]
});

module.exports = global.IngotMold = IngotMold;
