const ArmorSetsCloth1 = require("./.cloth_1");

class ArmorSetsCloth1_Feet extends ArmorSetsCloth1 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth1_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth1")} Boots`,
  nameable: "ArmorSetsCloth1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_1/sharpshooter_bt_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkCloth: 3,
      BarkThread: 6,
      RatTail: 2,

      RabbitPelt: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 0.4,
    [BUFFS.SKILLS.PATHFINDING]: 0.2,

    //[BUFFS.SKILLS.CARPENTRY]: 0,
    [BUFFS.SKILLS.HUNTING]: 0.4,
    [BUFFS.SKILLS.WOODCUTTING]: 0.3
    //[BUFFS.SKILLS.CRAFTING]: 0,
    //[BUFFS.SKILLS.LEATHERWORKING]: 1,
  }
});
