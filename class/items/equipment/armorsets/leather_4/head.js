const ArmorSetsLeather4 = require("./.leather_4");

class ArmorSetsLeather4_Head extends ArmorSetsLeather4 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather4_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather4")} Shroud`,
  nameable: "ArmorSetsLeather4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_4/htt_hlm_t_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 3,
      BearLeather: 2,
      LinenThread: 10
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.8,
    [BUFFS.TEMPERATURE_MAX]: -0.4,
    [BUFFS.SKILLS.COOKING]: 0.3
  }
});
