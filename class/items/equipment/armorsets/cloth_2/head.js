const ArmorSetsCloth2 = require("./.cloth_2");

class ArmorSetsCloth2_Head extends ArmorSetsCloth2 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth2_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth2")} Hat`,
  nameable: "ArmorSetsCloth2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_2/illusionist_h_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 2,
      LinenThread: 8,
      GoatHide: 1,
      DuskCrowFeather: 4,

      TinBuckle: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 4,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 1.5,
    [BUFFS.STATS.PERCEPTION]: 2,

    [BUFFS.SKILLS.FORAGING]: 0.3,
    //[BUFFS.SKILLS.COOKING]: 0.2,
    //[BUFFS.SKILLS.TAILORING]: 0.2,
    //[BUFFS.SKILLS.MILLING]: 1,
    [BUFFS.SKILLS.ALCHEMY]: 0.2
  }
});
