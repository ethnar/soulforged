const ArmorSetsLeather5 = require("./.leather_5");

class ArmorSetsLeather5_Chest extends ArmorSetsLeather5 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather5_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather5")} Vest`,
  nameable: "ArmorSetsLeather5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_5/ren_a_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LionSkin: 6,
      DrakeScale: 6,
      SilkThread: 10,

      TinBuckle: 1,
      RatTail: 6
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 6,
    baseTime: 2.2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1.3,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.SKILLS.FORAGING]: 1
  }
});
