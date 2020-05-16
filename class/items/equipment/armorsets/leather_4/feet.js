const ArmorSetsLeather4 = require("./.leather_4");

class ArmorSetsLeather4_Feet extends ArmorSetsLeather4 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather4_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather4")} Feet Wraps`,
  nameable: "ArmorSetsLeather4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_4/htt_bts_t_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 3,
      BearLeather: 2,
      LinenThread: 10,

      BearHide: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 5,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1,
    [BUFFS.TEMPERATURE_MAX]: -0.2,
    [BUFFS.SKILLS.PATHFINDING]: 0.5
  }
});
