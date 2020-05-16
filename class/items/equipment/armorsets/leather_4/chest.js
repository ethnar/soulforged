const ArmorSetsLeather4 = require("./.leather_4");

class ArmorSetsLeather4_Chest extends ArmorSetsLeather4 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather4_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather4")} Vest`,
  nameable: "ArmorSetsLeather4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_4/htt_arm_t_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 6,
      BearLeather: 3,
      LinenThread: 10,

      BearHide: 2,
      LeatherStraps: 2,
      BronzeBuckle: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 6,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1.8,
    [BUFFS.TEMPERATURE_MAX]: -0.4,
    [BUFFS.SKILLS.HUNTING]: 0.5
  }
});
