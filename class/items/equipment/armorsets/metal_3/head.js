const ArmorSetsMetal3 = require("./.metal_3");

class ArmorSetsMetal3_Head extends ArmorSetsMetal3 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal3_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal3")} Helmet`,
  nameable: "ArmorSetsMetal3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_3/dw_hlt_b_01.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 2,
      BisonLeather: 2,

      CopperRod: 2,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {}
});
