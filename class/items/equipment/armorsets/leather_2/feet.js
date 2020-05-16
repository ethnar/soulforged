const ArmorSetsLeather2 = require("./.leather_2");

class ArmorSetsLeather2_Feet extends ArmorSetsLeather2 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather2_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather2")} Boots`,
  nameable: "ArmorSetsLeather2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_2/crimson_bts_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerHide: 2,
      DeerLeather: 2,
      BatWing: 6,
      LinenThread: 8
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.SPELUNKING]: 0.4
  }
});
