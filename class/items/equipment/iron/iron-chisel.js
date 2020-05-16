const Item = require("../../.item");

class IronChisel extends IronEquipment {}
Item.itemFactory(IronChisel, {
  dynamicName: () => `${Nameable.getName("MeltedIron")} Chisel`,
  order: ITEMS_ORDER.TOOLS,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/iron/tool_b_n_01_iron.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1.1,
    [TOOL_UTILS.CARVING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImproveCarving: 0
    }
  },
  crafting: {
    materials: {
      IronRod: 1,
      IronWire: 1,
      PalmWood: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});

new ResearchConcept({
  name: "Better carving tool",
  className: "ResearchConcept_ImproveCarving",
  tier: ResearchConcept.TIERS.PARCHMENT,
  requirements: [
    ResearchConcept.knownItem("IronRod"),
    utils.or(
      ResearchConcept.knownItem("StonePick"),
      ResearchConcept.knownItem("CopperPick"),
      ResearchConcept.knownItem("IronPick")
    )
  ]
});
