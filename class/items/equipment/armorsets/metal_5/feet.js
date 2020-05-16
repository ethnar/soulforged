const ArmorSetsMetal5 = require("./.metal_5");

class ArmorSetsMetal5_Feet extends ArmorSetsMetal5 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal5_Feet, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal5")} Chausses`,
  nameable: "ArmorSetsMetal5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_5/pp_bts_b_01.png`,
  autoCalculateWeight: true,
  weight: -2,
  slots: {
    [EQUIPMENT_SLOTS.FEET]: 1
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

      Ivory: 1,
      SilverPlate: 2,
      SilverRod: 1,
      BronzeBuckle: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 6,
    baseTime: 2.5 * HOURS
  },
  buffs: {
    [BUFFS.SKILLS.PATHFINDING]: 0.2
  }
});
