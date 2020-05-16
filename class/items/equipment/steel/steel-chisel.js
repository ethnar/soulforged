const Item = require("../../.item");

class SteelChisel extends SteelEquipment {}
Item.itemFactory(SteelChisel, {
  dynamicName: () => `${Nameable.getName("MeltedSteel")} Chisel`,
  order: ITEMS_ORDER.TOOLS,
  weight: 2,
  icon: `/${ICONS_PATH}/items/equipment/steel/tool_b_n_01_steel.png`,
  slots: {
    [EQUIPMENT_SLOTS.TOOL]: 1
  },
  utility: {
    [TOOL_UTILS.ETCHING]: 1.2,
    [TOOL_UTILS.CARVING]: 1.2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImproveCarving: 0
    }
  },
  crafting: {
    materials: {
      SteelRod: 1,
      SteelWire: 1,
      PalmWood: 1
    },
    building: ["Forge"],
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 60 * MINUTES
  }
});
