const ArmorSetsCloth3 = require("./.cloth_3");

class ArmorSetsCloth3_Head extends ArmorSetsCloth3 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth3_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth3")} Shroud`,
  nameable: "ArmorSetsCloth3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_3/dru_hlm_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkCloth: 2,
      SilkThread: 8,
      // GoatHide: 1,
      ScreechFeather: 4,

      SilverBuckle: 1,
      LeatherStraps: 2

      // TinBuckle: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: 1.8,
    [BUFFS.STATS.PERCEPTION]: 2,

    // [BUFFS.SKILLS.ALCHEMY]: 0.2,
    [BUFFS.SKILLS.DOCTORING]: 0.4,
    [BUFFS.SKILLS.TRACKING]: 0.4,
    [BUFFS.SKILLS.JEWELCRAFTING]: 0.3
    // [BUFFS.SKILLS.SMELTING]: 0.5
  }
});
