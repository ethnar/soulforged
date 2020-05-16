const ArmorSetsCloth1 = require("./.cloth_1");

class ArmorSetsCloth1_Hands extends ArmorSetsCloth1 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth1_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth1")} Gloves`,
  nameable: "ArmorSetsCloth1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_1/sharpshooter_gl_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkCloth: 3,
      BarkThread: 6,
      RatTail: 2,

      TinMetalRing: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 2,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 0.4,

    [BUFFS.SKILLS.CARPENTRY]: 0.4,
    [BUFFS.SKILLS.HUNTING]: 0.2,
    //[BUFFS.SKILLS.WOODCUTTING]: 0,
    //[BUFFS.SKILLS.CRAFTING]: 0,
    [BUFFS.SKILLS.LEATHERWORKING]: 0.4
  }
});
