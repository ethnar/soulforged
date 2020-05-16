const ArmorSetsMetal2 = require("./.metal_2");

class ArmorSetsMetal2_Feet extends ArmorSetsMetal2 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal2_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal2")} Boots`,
  nameable: "ArmorSetsMetal2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_2/iron_bt_b.png`,
  autoCalculateWeight: true,
  weight: -0.2,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 2,
      GoatHide: 2,

      WolfFang: 4,
      LeadPlate: 1
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.1,
    [BUFFS.TEMPERATURE_MAX]: 0.1,
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
