const ArmorSetsCloth3 = require("./.cloth_3");

class ArmorSetsCloth3_Feet extends ArmorSetsCloth3 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth3_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth3")} Boots`,
  nameable: "ArmorSetsCloth3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_3/dru_bts_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkCloth: 3,
      SilkThread: 6,
      // GoatHide: 1,
      ScreechFeather: 4

      // TinWire: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 1,
    [BUFFS.SKILLS.PATHFINDING]: 0.5,

    // [BUFFS.SKILLS.ALCHEMY]: 0.2,
    // [BUFFS.SKILLS.DOCTORING]: 0.3,
    [BUFFS.SKILLS.TRACKING]: 0.4,
    [BUFFS.SKILLS.JEWELCRAFTING]: 0.3
    // [BUFFS.SKILLS.SMELTING]: 0.5
  }
});
