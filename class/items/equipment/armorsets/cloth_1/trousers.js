const ArmorSetsCloth1 = require("./.cloth_1");

class ArmorSetsCloth1_Trousers extends ArmorSetsCloth1 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth1_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth1")} Trousers`,
  nameable: "ArmorSetsCloth1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_1/sharpshooter_pnc_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkCloth: 4,
      BarkThread: 10,
      RatTail: 3,

      LeatherStraps: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 1,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.6,

    [BUFFS.SKILLS.CARPENTRY]: 0.2,
    //[BUFFS.SKILLS.HUNTING]: 1,
    //[BUFFS.SKILLS.WOODCUTTING]: 1,
    [BUFFS.SKILLS.CRAFTING]: 0.2
    //[BUFFS.SKILLS.LEATHERWORKING]: 1,
  }
});
