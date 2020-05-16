const ArmorSetsMetal0 = require("./.metal_0");

class ArmorSetsMetal0_Head extends ArmorSetsMetal0 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal0_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal0")} Helmet`,
  nameable: "ArmorSetsMetal0",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_0/hlm_b_05.png`,
  autoCalculateWeight: true,
  weight: 0,
  slots: {
    [EQUIPMENT_SLOTS.HEAD]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperPlate: 2,

      WolfLeather: 1,
      LeatherStraps: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 2,
    baseTime: 1 * HOURS
  },
  buffs: {}
});
