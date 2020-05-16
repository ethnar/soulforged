const ArmorSetsLeather2 = require("./.leather_2");

class ArmorSetsLeather2_Chest extends ArmorSetsLeather2 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather2_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather2")} Chestpiece`,
  nameable: "ArmorSetsLeather2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_2/42b_recolor.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerLeather: 5,
      BatWing: 10,
      LinenThread: 10,
      LeadBuckle: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.8,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.SKILLS.SPELUNKING]: 0.2
  }
});
