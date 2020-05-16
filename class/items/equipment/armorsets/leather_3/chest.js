const ArmorSetsLeather3 = require("./.leather_3");

class ArmorSetsLeather3_Chest extends ArmorSetsLeather3 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather3_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather3")} Vest`,
  nameable: "ArmorSetsLeather3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_3/ar_arm_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
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

      LeatherRope: 1,
      DeerHide: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1,
    [BUFFS.TEMPERATURE_MAX]: -0.1,
    [BUFFS.SKILLS.HUNTING]: 0.3
  }
});
