const ArmorSetsMetal1 = require("./.metal_1");

class ArmorSetsMetal1_Hands extends ArmorSetsMetal1 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal1_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal1")} Gauntlets`,
  nameable: "ArmorSetsMetal1",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_1/h_gl_01b.png`,
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
      LeatherStraps: 4,
      BronzePlate: 4
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
