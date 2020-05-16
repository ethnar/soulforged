const ArmorSetsLeather4 = require("./.leather_4");

class ArmorSetsLeather4_Trousers extends ArmorSetsLeather4 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather4_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather4")} Strides`,
  nameable: "ArmorSetsLeather4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_4/htt_pnc_t_01_recolor.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 5,
      BearLeather: 4,
      LinenThread: 10,

      BearHide: 2,
      BronzeBuckle: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1.8,
    [BUFFS.TEMPERATURE_MAX]: -0.6,
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
