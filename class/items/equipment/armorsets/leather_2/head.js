const ArmorSetsLeather2 = require("./.leather_2");

class ArmorSetsLeather2_Head extends ArmorSetsLeather2 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather2_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather2")} Cap`,
  nameable: "ArmorSetsLeather2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_2/crimson_hl_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherStraps: 2,
      DeerLeather: 2,
      BatWing: 6,
      BarkRope: 2,
      LinenThread: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.STATS.PERCEPTION]: 1,
    [BUFFS.SKILLS.SPELUNKING]: 0.1
  }
});
