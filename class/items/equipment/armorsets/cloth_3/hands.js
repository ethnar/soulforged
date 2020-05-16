const ArmorSetsCloth3 = require("./.cloth_3");

class ArmorSetsCloth3_Hands extends ArmorSetsCloth3 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth3_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth3")} Gloves`,
  nameable: "ArmorSetsCloth3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_3/dru_gl_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilkCloth: 3,
      SilkThread: 6,
      // GoatHide: 1,
      ScreechFeather: 4,
      LeatherStraps: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 1,

    // [BUFFS.SKILLS.ALCHEMY]: 0.2,
    [BUFFS.SKILLS.DOCTORING]: 0.3,
    // [BUFFS.SKILLS.TRACKING]: 0.2,
    [BUFFS.SKILLS.JEWELCRAFTING]: 0.3,
    [BUFFS.SKILLS.SMELTING]: 0.2
  }
});
