const ArmorSetsLeather1 = require("./.leather_1");

class ArmorSetsLeather1_Hands extends ArmorSetsLeather1 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather1_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather1")} Gauntlets`,
  nameable: "ArmorSetsLeather1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_1/nnj_gl_01_b.png`,
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
      WolfLeather: 2,
      DeerLeather: 2,
      LinenThread: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.1,
    [BUFFS.SKILLS.TRACKING]: 0.3
  }
});
