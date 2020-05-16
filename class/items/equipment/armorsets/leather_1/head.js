const ArmorSetsLeather1 = require("./.leather_1");

class ArmorSetsLeather1_Head extends ArmorSetsLeather1 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather1_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather1")} Helmet`,
  nameable: "ArmorSetsLeather1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_1/nnj_hlml_01_b.png`,
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
      WolfHide: 1,
      WolfLeather: 1,
      DeerLeather: 1,
      LinenThread: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.1,
    [BUFFS.SKILLS.TRACKING]: 0.3
  }
});
