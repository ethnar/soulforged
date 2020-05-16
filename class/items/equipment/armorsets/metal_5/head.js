const ArmorSetsMetal5 = require("./.metal_5");

class ArmorSetsMetal5_Head extends ArmorSetsMetal5 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal5_Head, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal5")} Helmet`,
  nameable: "ArmorSetsMetal5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_5/97b_recolor.png`,
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
      SteelPlate: 1,
      SteelRod: 1,
      BisonLeather: 1,
      LionSkin: 1,

      SilverRod: 2,
      LeadMetalRing: 2,
      CopperWire: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    baseTime: 2.5 * HOURS
  },
  buffs: {}
});
