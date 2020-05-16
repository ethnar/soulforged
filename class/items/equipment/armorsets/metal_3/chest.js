const ArmorSetsMetal3 = require("./.metal_3");

class ArmorSetsMetal3_Chest extends ArmorSetsMetal3 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal3_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal3")} Chestpiece`,
  nameable: "ArmorSetsMetal3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_3/dw_arm_b_01.png`,
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
      IronPlate: 7,
      BisonLeather: 5,

      CopperRod: 4,
      CopperWire: 4,
      BronzeBuckle: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 0.4
  }
});
