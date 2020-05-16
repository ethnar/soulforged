const ArmorSetsLeather2 = require("./.leather_2");

class ArmorSetsLeather2_Hands extends ArmorSetsLeather2 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather2_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather2")} Gauntlets`,
  nameable: "ArmorSetsLeather2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_2/crimson_gl_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LeatherStraps: 2,
      DeerLeather: 3,
      BatWing: 6,
      LinenThread: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.SKILLS.SPELUNKING]: 0.4
  }
});
