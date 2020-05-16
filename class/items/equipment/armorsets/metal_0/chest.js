const ArmorSetsMetal0 = require("./.metal_0");

class ArmorSetsMetal0_Chest extends ArmorSetsMetal0 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal0_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal0")} Cuirass`,
  nameable: "ArmorSetsMetal0",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_0/kre_arm_01_b.png`,
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
      CopperPlate: 5,

      WolfLeather: 2,
      TinPlate: 2,
      LeatherRope: 1
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {}
});
