const ArmorSetsMetal3 = require("./.metal_3");

class ArmorSetsMetal3_Feet extends ArmorSetsMetal3 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal3_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal3")} Boots`,
  nameable: "ArmorSetsMetal3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_3/dw_bts_b_01.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 4,
      BisonLeather: 3,

      BronzeBuckle: 2,
      LeatherStraps: 3
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.1,
    [BUFFS.TEMPERATURE_MAX]: 0.1,
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
