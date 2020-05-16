const Item = require("../.item");

class BarkThread extends Item {}
Item.itemFactory(BarkThread, {
  name: "Bark Thread",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/leather/pt_b_07.png`,
  weight: 0.02,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Sewing: 0
    }
  },
  crafting: {
    materials: {
      BarkRope: 1
    },
    result: {
      BarkThread: 3
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 10 * MINUTES
  }
});
module.exports = global.BarkRope = BarkRope;

new ResearchConcept({
  name: "Sewing",
  className: "ResearchConcept_Sewing",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [
    utils.or(
      ResearchConcept.knownItem("DeerLeather"),
      ResearchConcept.knownItem("BearLeather"),
      ResearchConcept.knownItem("WolfLeather")
    )
  ]
});
