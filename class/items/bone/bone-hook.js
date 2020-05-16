const Item = require("../.item");
const BarkRope = require("../materials/bark-rope");

class BoneHook extends Item {}
Item.itemFactory(BoneHook, {
  name: "Bone Hook",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/items/bone/prehistoricicon_38_b.png`,
  weight: 0.01,
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Fishing: 0
    }
  },
  crafting: {
    materials: {
      Bone: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 1 * HOURS
  }
});
module.exports = global.BarkRope = BarkRope;

new ResearchConcept({
  name: "Fishing",
  className: "ResearchConcept_Fishing",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [utils.or(ResearchConcept.knownItem("Trout"))]
});
