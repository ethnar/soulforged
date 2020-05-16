const ArmorSetsMetal2 = require("./.metal_2");

class ArmorSetsMetal2_Trousers extends ArmorSetsMetal2 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal2_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal2")} Greaves`,
  nameable: "ArmorSetsMetal2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_2/iron_pn_b.png`,
  autoCalculateWeight: true,
  weight: -0.8,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 4,
      GoatHide: 5,

      WolfFang: 4,
      LeadPlate: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.3
  }
});
