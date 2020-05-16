const ArmorSetsCloth3 = require("./.cloth_3");

class ArmorSetsCloth3_Trousers extends ArmorSetsCloth3 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth3_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth3")} Kilt`,
  nameable: "ArmorSetsCloth3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_3/dru_pnc_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkCloth: 4,
      SilkThread: 10,
      // GoatHide: 1,
      ScreechFeather: 4,
      LeatherRope: 2

      // LeatherStraps: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: 1.5,

    // [BUFFS.SKILLS.ALCHEMY]: 0.2,
    [BUFFS.SKILLS.DOCTORING]: 0.4,
    // [BUFFS.SKILLS.TRACKING]: 0.2,
    // [BUFFS.SKILLS.JEWELCRAFTING]: 0.2,
    [BUFFS.SKILLS.SMELTING]: 0.3
  }
});
