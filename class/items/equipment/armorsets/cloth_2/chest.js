const ArmorSetsCloth2 = require("./.cloth_2");

class ArmorSetsCloth2_Chest extends ArmorSetsCloth2 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth2_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth2")} Shirt`,
  nameable: "ArmorSetsCloth2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_2/illusionist_ar_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 4,
      LinenThread: 8,
      GoatHide: 1,
      DuskCrowFeather: 4,

      LeatherStraps: 2,
      TinWire: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 1,

    [BUFFS.SKILLS.FORAGING]: 0.3,
    //[BUFFS.SKILLS.COOKING]: 0.2,
    //[BUFFS.SKILLS.TAILORING]: 0.2,
    [BUFFS.SKILLS.MILLING]: 0.5
    //[BUFFS.SKILLS.ALCHEMY]: 0.2,
  }
});
