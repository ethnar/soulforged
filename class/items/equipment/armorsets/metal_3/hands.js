const ArmorSetsMetal3 = require("./.metal_3");

class ArmorSetsMetal3_Hands extends ArmorSetsMetal3 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal3_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal3")} Gauntlets`,
  nameable: "ArmorSetsMetal3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_3/dw_gl_b_01.png`,
  autoCalculateWeight: true,
  weight: -0.2,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 4,
      BisonLeather: 4,

      CopperWire: 2,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2
  }
});
