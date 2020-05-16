const ArmorSetsMetal0 = require("./.metal_0");

class ArmorSetsMetal0_Trousers extends ArmorSetsMetal0 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal0_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal0")} Greaves`,
  nameable: "ArmorSetsMetal0",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_0/kre_pn_01_b.png`,
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
      CopperPlate: 5,

      WolfLeather: 3,
      LeatherStraps: 4,
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
