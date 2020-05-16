const ArmorSetsLeather1 = require("./.leather_1");

class ArmorSetsLeather1_Chest extends ArmorSetsLeather1 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather1_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather1")} Chestpiece`,
  nameable: "ArmorSetsLeather1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_1/nnj_arm_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WolfLeather: 4,
      DeerLeather: 3,
      LinenThread: 10
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.8,
    [BUFFS.TEMPERATURE_MAX]: 0.8,
    [BUFFS.SKILLS.PATHFINDING]: 0.1,
    [BUFFS.SKILLS.TRACKING]: 0.4
  }
});
