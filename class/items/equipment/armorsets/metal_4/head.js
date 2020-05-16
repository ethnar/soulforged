const ArmorSetsMetal4 = require("./.metal_4");

class ArmorSetsMetal4_Head extends ArmorSetsMetal4 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal4_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal4")} Helmet`,
  nameable: "ArmorSetsMetal4",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_4/fantom_h_b.png`,
  autoCalculateWeight: true,
  weight: -0.3,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 2,
      ElephantSkin: 2,

      TinPlate: 2
    },
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  },
  buffs: {}
});
