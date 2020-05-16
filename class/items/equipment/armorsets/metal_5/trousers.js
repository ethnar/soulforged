const ArmorSetsMetal5 = require("./.metal_5");

class ArmorSetsMetal5_Trousers extends ArmorSetsMetal5 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal5_Trousers, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal5")} Greaves`,
  nameable: "ArmorSetsMetal5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_5/pp_pnc_b_01.png`,
  autoCalculateWeight: true,
  weight: -4,
  slots: {
    [EQUIPMENT_SLOTS.TROUSERS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SteelPlate: 2,
      SteelRod: 2,
      BisonLeather: 2,
      LionSkin: 2,

      Ivory: 4,
      SilverPlate: 2,
      BronzeBuckle: 2,
      LeadMetalRing: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    baseTime: 2.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.2,
    [BUFFS.TEMPERATURE_MAX]: 0.2
  }
});
