const ArmorSetsMetal5 = require("./.metal_5");

class ArmorSetsMetal5_Hands extends ArmorSetsMetal5 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal5_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal5")} Gauntlets`,
  nameable: "ArmorSetsMetal5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_5/pp_gl_b_01.png`,
  autoCalculateWeight: true,
  weight: -2,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
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

      Ivory: 2,
      SilverPlate: 1,
      LeadMetalRing: 1,
      CopperWire: 4
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    baseTime: 2.5 * HOURS
  },
  buffs: {}
});
