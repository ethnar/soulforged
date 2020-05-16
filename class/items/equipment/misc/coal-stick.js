const Item = require("../../.item");

class CoalStick extends Item {}
Item.itemFactory(CoalStick, {
  name: "Coal Stick",
  icon: `/${ICONS_PATH}/items/equipment/misc/engeniring_40_b_recolor.png`,
  order: ITEMS_ORDER.TOOLS,
  weight: 0.2,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.WRITING_PARCHMENT]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_Writing_Parchment: 0
    }
  },
  crafting: {
    result: {
      CoalStick: 4
    },
    materials: {
      Coal: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 0,
    baseTime: 1 * HOURS
  }
});
module.exports = global.CoalStick = CoalStick;

new ResearchConcept({
  name: "Writing: Parchment",
  className: "ResearchConcept_Writing_Parchment",
  tier: ResearchConcept.TIERS.CLAY,
  requirements: [ResearchConcept.knownItem("Parchment")]
});
