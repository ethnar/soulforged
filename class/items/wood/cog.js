const Item = require("../.item");

class MahoganyCog extends Item {}
Item.itemFactory(MahoganyCog, {
  name: "Wooden Cog",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/wood/pt_b_11.png`,
  weight: 2,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Machinery: 0
    }
  },
  crafting: {
    materials: {
      MahoganyWood: 1
    },
    skill: SKILLS.MECHANICS,
    skillLevel: 1,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 6 * HOURS
  }
});
module.exports = global.MahoganyCog = MahoganyCog;

new ResearchConcept({
  name: "Machinery",
  className: "ResearchConcept_Machinery",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [ResearchConcept.soulLevel(6)]
});
