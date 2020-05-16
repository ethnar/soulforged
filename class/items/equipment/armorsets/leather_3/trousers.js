const ArmorSetsLeather3 = require("./.leather_3");

class ArmorSetsLeather3_Trousers extends ArmorSetsLeather3 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather3_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather3")} Strides`,
  nameable: "ArmorSetsLeather3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_3/ar_pnc_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoatHide: 4,
      DeerLeather: 3,
      WolfFang: 4,
      LinenThread: 6,

      LeatherStraps: 2,
      DeerHide: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1,
    [BUFFS.TEMPERATURE_MAX]: -0.3,
    [BUFFS.SKILLS.WOODCUTTING]: 0.3
  }
});
