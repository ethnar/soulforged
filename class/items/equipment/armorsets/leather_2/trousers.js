const ArmorSetsLeather2 = require("./.leather_2");

class ArmorSetsLeather2_Trousers extends ArmorSetsLeather2 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather2_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather2")} Trousers`,
  nameable: "ArmorSetsLeather2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_2/crimson_pn_b.png`,
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
      DeerLeather: 3,
      BatWing: 8,
      BarkRope: 4,
      LinenThread: 6,
      LeadBuckle: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 2,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.SKILLS.SPELUNKING]: 0.3
  }
});
