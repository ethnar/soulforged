const ArmorSetsMetal4 = require("./.metal_4");

class ArmorSetsMetal4_Chest extends ArmorSetsMetal4 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal4_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal4")} Chestpiece`,
  nameable: "ArmorSetsMetal4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_4/41b_recolor.png`,
  autoCalculateWeight: true,
  weight: -1,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 7,
      ElephantSkin: 6,

      TinPlate: 4,
      TinMetalRing: 2,
      LeadBuckle: 2
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 0.4
  }
});
