const ArmorSetsMetal4 = require("./.metal_4");

class ArmorSetsMetal4_Trousers extends ArmorSetsMetal4 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal4_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal4")} Greaves`,
  nameable: "ArmorSetsMetal4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_4/fantom_pn_b.png`,
  autoCalculateWeight: true,
  weight: -0.5,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 5,
      ElephantSkin: 4,

      TinPlate: 5,
      LeadBuckle: 4
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.3,
    [BUFFS.TEMPERATURE_MAX]: 0.3
  }
});
