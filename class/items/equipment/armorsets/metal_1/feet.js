const ArmorSetsMetal1 = require("./.metal_1");

class ArmorSetsMetal1_Feet extends ArmorSetsMetal1 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal1_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal1")} Boots`,
  nameable: "ArmorSetsMetal1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_1/h_bt_01b.png`,
  autoCalculateWeight: true,
  weight: -0.5,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerLeather: 5,
      BronzePlate: 3,
      CopperBuckle: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.1,
    [BUFFS.TEMPERATURE_MAX]: 0.1,
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
