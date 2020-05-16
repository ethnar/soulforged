const ArmorSetsMetal1 = require("./.metal_1");

class ArmorSetsMetal1_Chest extends ArmorSetsMetal1 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal1_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal1")} Chestpiece`,
  nameable: "ArmorSetsMetal1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_1/h_arm_01b.png`,
  autoCalculateWeight: true,
  weight: -1,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherStraps: 6,
      BronzePlate: 8,
      CopperWire: 3,
      DeerLeather: 4,
      CopperBuckle: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 0.4
  }
});
