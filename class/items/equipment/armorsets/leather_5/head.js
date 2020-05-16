const ArmorSetsLeather5 = require("./.leather_5");

class ArmorSetsLeather5_Head extends ArmorSetsLeather5 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather5_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather5")} Cap`,
  nameable: "ArmorSetsLeather5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_5/ren_hl_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LionSkin: 3,
      DrakeScale: 2,
      SilkThread: 5,

      RatTail: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 7,
    baseTime: 1.8 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.SKILLS.TRACKING]: 0.7
  }
});
