const ArmorSetsCloth1 = require("./.cloth_1");

class ArmorSetsCloth1_Chest extends ArmorSetsCloth1 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth1_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth1")} Shirt`,
  nameable: "ArmorSetsCloth1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_1/sharpshooter_ar_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkCloth: 4,
      BarkThread: 10,
      RatTail: 3,

      LeatherStraps: 4,
      TinMetalRing: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.8,

    [BUFFS.SKILLS.CARPENTRY]: 0.2,
    [BUFFS.SKILLS.HUNTING]: 0.2,
    [BUFFS.SKILLS.WOODCUTTING]: 0.2,
    //[BUFFS.SKILLS.CRAFTING]: 1,
    [BUFFS.SKILLS.LEATHERWORKING]: 0.2
  }
});
