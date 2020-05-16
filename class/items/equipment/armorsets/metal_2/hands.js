const ArmorSetsMetal2 = require("./.metal_2");

class ArmorSetsMetal2_Hands extends ArmorSetsMetal2 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal2_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal2")} Gauntlets`,
  nameable: "ArmorSetsMetal2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_2/iron_gl_b.png`,
  autoCalculateWeight: true,
  weight: -0.2,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      IronPlate: 3,
      GoatHide: 3,

      LeatherStraps: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2
  }
});
