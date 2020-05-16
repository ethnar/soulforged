const ArmorSetsMetal4 = require("./.metal_4");

class ArmorSetsMetal4_Hands extends ArmorSetsMetal4 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal4_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal4")} Gauntlets`,
  nameable: "ArmorSetsMetal4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_4/fantom_gl_b.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 4,
      ElephantSkin: 5,

      TinMetalRing: 3
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2
  }
});
