const ArmorSetsMetal1 = require("./.metal_1");

class ArmorSetsMetal1_Trousers extends ArmorSetsMetal1 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal1_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal1")} Greaves`,
  nameable: "ArmorSetsMetal1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_1/h_pn_01b.png`,
  autoCalculateWeight: true,
  weight: -0.5,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerLeather: 3,
      BronzePlate: 6,
      CopperRod: 1,
      CopperBuckle: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.3
  }
});
