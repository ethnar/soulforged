const ArmorSetsLeather3 = require("./.leather_3");

class ArmorSetsLeather3_Head extends ArmorSetsLeather3 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather3_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather3")} Shroud`,
  nameable: "ArmorSetsLeather3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_3/ar_hlt_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoatHide: 3,
      DeerLeather: 1,
      WolfFang: 1,
      LinenThread: 4,

      LeatherStraps: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: -0.2,
    [BUFFS.SKILLS.FISHING]: 0.5
  }
});
