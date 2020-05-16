const ArmorSetsMetal1 = require("./.metal_1");

class ArmorSetsMetal1_Head extends ArmorSetsMetal1 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal1_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal1")} Helmet`,
  nameable: "ArmorSetsMetal1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_1/h_hl_01b.png`,
  autoCalculateWeight: true,
  weight: -0.3,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BronzePlate: 2,
      CopperRod: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {}
});
