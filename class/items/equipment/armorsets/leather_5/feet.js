const ArmorSetsLeather5 = require("./.leather_5");

class ArmorSetsLeather5_Feet extends ArmorSetsLeather5 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather5_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather5")} Boots`,
  nameable: "ArmorSetsLeather5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_5/ren_bt_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LionSkin: 2,
      DrakeScale: 3,
      SilkThread: 6,

      RatTail: 6,
      BearHide: 1
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.SKILLS.PATHFINDING]: 0.8
  }
});
