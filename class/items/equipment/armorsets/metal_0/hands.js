const ArmorSetsMetal0 = require("./.metal_0");

class ArmorSetsMetal0_Hands extends ArmorSetsMetal0 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal0_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal0")} Gauntlets`,
  nameable: "ArmorSetsMetal0",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_0/kre_gl_01_b.png`,
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
      CopperPlate: 3,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2
  }
});
