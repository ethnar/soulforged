const ArmorSetsMetal4 = require("./.metal_4");

class ArmorSetsMetal4_Feet extends ArmorSetsMetal4 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal4_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal4")} Boots`,
  nameable: "ArmorSetsMetal4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_4/fantom_bt_b.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 3,
      ElephantSkin: 3,

      TinPlate: 2,
      TinMetalRing: 3
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.1,
    [BUFFS.TEMPERATURE_MAX]: 0.1,
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
