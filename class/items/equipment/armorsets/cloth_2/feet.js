const ArmorSetsCloth2 = require("./.cloth_2");

class ArmorSetsCloth2_Feet extends ArmorSetsCloth2 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth2_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth2")} Boots`,
  nameable: "ArmorSetsCloth2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_2/illusionist_bt_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 3,
      LinenThread: 6,
      GoatHide: 1,
      DuskCrowFeather: 4,

      TinWire: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 0.6,
    [BUFFS.SKILLS.PATHFINDING]: 0.3,

    //[BUFFS.SKILLS.FORAGING]: 0.2,
    //[BUFFS.SKILLS.COOKING]: 0.2,
    [BUFFS.SKILLS.TAILORING]: 0.3,
    [BUFFS.SKILLS.MILLING]: 0.4
    //[BUFFS.SKILLS.ALCHEMY]: 0.2,
  }
});
