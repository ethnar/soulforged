const ArmorSetsLeather3 = require("./.leather_3");

class ArmorSetsLeather3_Hands extends ArmorSetsLeather3 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather3_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather3")} Mitts`,
  nameable: "ArmorSetsLeather3",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_3/ar_gll_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoatHide: 3,
      DeerLeather: 2,
      WolfFang: 2,
      LinenThread: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.6,
    [BUFFS.TEMPERATURE_MAX]: -0.2,
    [BUFFS.SKILLS.FORAGING]: 0.3
  }
});
