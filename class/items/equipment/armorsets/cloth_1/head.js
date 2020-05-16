const ArmorSetsCloth1 = require("./.cloth_1");

class ArmorSetsCloth1_Head extends ArmorSetsCloth1 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth1_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth1")} Hood`,
  nameable: "ArmorSetsCloth1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_1/86b_recolor.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkCloth: 2,
      BarkThread: 8,
      RatTail: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 1,
    [BUFFS.STATS.PERCEPTION]: 1,

    //[BUFFS.SKILLS.CARPENTRY]: 1,
    [BUFFS.SKILLS.HUNTING]: 0.2,
    //[BUFFS.SKILLS.WOODCUTTING]: 1,
    [BUFFS.SKILLS.CRAFTING]: 0.2
    //[BUFFS.SKILLS.LEATHERWORKING]: 1,
  }
});
