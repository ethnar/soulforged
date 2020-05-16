const ArmorSetsLeather1 = require("./.leather_1");

class ArmorSetsLeather1_Feet extends ArmorSetsLeather1 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather1_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather1")} Boots`,
  nameable: "ArmorSetsLeather1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_1/nnj_bt_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WolfHide: 1,
      WolfLeather: 2,
      DeerLeather: 2,
      LinenThread: 8
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.4,
    [BUFFS.SKILLS.TRACKING]: 0.1
  }
});
