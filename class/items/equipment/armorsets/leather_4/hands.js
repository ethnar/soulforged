const ArmorSetsLeather4 = require("./.leather_4");

class ArmorSetsLeather4_Hands extends ArmorSetsLeather4 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather4_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather4")} Mitts`,
  nameable: "ArmorSetsLeather4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_4/htt_gl_t_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TurodoHide: 3,
      BearLeather: 3,
      LinenThread: 10,

      LeatherStraps: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 5,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1,
    [BUFFS.TEMPERATURE_MAX]: -0.3,
    [BUFFS.SKILLS.FISHING]: 0.5
  }
});
