const ArmorSetsCloth2 = require("./.cloth_2");

class ArmorSetsCloth2_Trousers extends ArmorSetsCloth2 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth2_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth2")} Kilt`,
  nameable: "ArmorSetsCloth2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_2/illusionist_pn_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 4,
      LinenThread: 10,
      GoatHide: 1,
      DuskCrowFeather: 4,

      LeatherStraps: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 1,

    //[BUFFS.SKILLS.FORAGING]: 0.2,
    [BUFFS.SKILLS.COOKING]: 0.3,
    //[BUFFS.SKILLS.TAILORING]: 0.2,
    [BUFFS.SKILLS.MILLING]: 0.3
    //[BUFFS.SKILLS.ALCHEMY]: 0.2,
  }
});
