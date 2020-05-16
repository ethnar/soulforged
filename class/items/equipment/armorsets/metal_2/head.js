const ArmorSetsMetal2 = require("./.metal_2");

class ArmorSetsMetal2_Head extends ArmorSetsMetal2 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal2_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal2")} Helmet`,
  nameable: "ArmorSetsMetal2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_2/iron_hl_b.png`,
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
      GoatHide: 2,

      WolfFang: 6,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {}
});
