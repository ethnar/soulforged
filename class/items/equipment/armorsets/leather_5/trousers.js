const ArmorSetsLeather5 = require("./.leather_5");

class ArmorSetsLeather5_Trousers extends ArmorSetsLeather5 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather5_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather5")} Trousers`,
  nameable: "ArmorSetsLeather5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_5/ren_pn_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LionSkin: 5,
      DrakeScale: 4,
      SilkThread: 12,

      RatTail: 6,
      TinBuckle: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 6,
    baseTime: 2.2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 1.2,
    [BUFFS.TEMPERATURE_MAX]: 0.4,
    [BUFFS.SKILLS.SMELTING]: 0.6
  }
});
