const ArmorSetsLeather3 = require("./.leather_3");

class ArmorSetsLeather3_Feet extends ArmorSetsLeather3 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather3_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather3")} Feet Wraps`,
  nameable: "ArmorSetsLeather3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_3/ar_bt_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoatHide: 3,
      DeerLeather: 2,
      WolfFang: 2,
      LinenThread: 4,

      LeatherRope: 1,
      LeatherStraps: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.6,
    [BUFFS.SKILLS.PATHFINDING]: 0.4
  }
});
