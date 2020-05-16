const ArmorSetsMetal3 = require("./.metal_3");

class ArmorSetsMetal3_Trousers extends ArmorSetsMetal3 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal3_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal3")} Greaves`,
  nameable: "ArmorSetsMetal3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_3/dw_pnc_b_01.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 7,
      BisonLeather: 6,

      CopperWire: 6,
      BronzeBuckle: 2,
      LeatherStraps: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.3
  }
});
