const ArmorSetsCloth3 = require("./.cloth_3");

class ArmorSetsCloth3_Chest extends ArmorSetsCloth3 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth3_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth3")} Shirt`,
  nameable: "ArmorSetsCloth3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_3/dru_arm_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkCloth: 4,
      SilkThread: 8,
      // GoatHide: 1,
      ScreechFeather: 4,

      SilverBuckle: 1,
      // LeatherStraps: 2,
      LeatherRope: 2
      // TinWire: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 5,
    baseTime: 2.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 1.5,

    [BUFFS.SKILLS.ALCHEMY]: 0.4,
    [BUFFS.SKILLS.DOCTORING]: 0.4,
    // [BUFFS.SKILLS.TRACKING]: 0.2,
    // [BUFFS.SKILLS.JEWELCRAFTING]: 0.2,
    [BUFFS.SKILLS.SMELTING]: 0.3
  }
});
