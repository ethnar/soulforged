const ArmorSetsMetal0 = require("./.metal_0");

class ArmorSetsMetal0_Feet extends ArmorSetsMetal0 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal0_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal0")} Boots`,
  nameable: "ArmorSetsMetal0",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_0/kre_bts_01_b.png`,
  autoCalculateWeight: true,
  weight: -0.5,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperPlate: 4,

      LeatherStraps: 3,
      LeatherRope: 1
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 3,
    baseTime: 1 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
