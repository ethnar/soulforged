const ArmorSetsLeather1 = require("./.leather_1");

class ArmorSetsLeather1_Trousers extends ArmorSetsLeather1 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather1_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather1")} Trousers`,
  nameable: "ArmorSetsLeather1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_1/nnj_pn_01_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      DeerHide: 3,
      WolfLeather: 3,
      DeerLeather: 3,
      LinenThread: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.3,
    [BUFFS.SKILLS.PATHFINDING]: 0.2,
    [BUFFS.SKILLS.TRACKING]: 0.2
  }
});
