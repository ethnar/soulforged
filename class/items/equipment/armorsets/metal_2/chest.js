const ArmorSetsMetal2 = require("./.metal_2");

class ArmorSetsMetal2_Chest extends ArmorSetsMetal2 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal2_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal2")} Chestpiece`,
  nameable: "ArmorSetsMetal2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_2/iron_ar_b.png`,
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
      IronPlate: 5,
      GoatHide: 4,

      WolfFang: 6,
      LeadPlate: 2,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.4,
    [BUFFS.TEMPERATURE_MAX]: 0.4
  }
});
