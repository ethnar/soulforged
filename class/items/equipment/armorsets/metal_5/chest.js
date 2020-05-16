const ArmorSetsMetal5 = require("./.metal_5");

class ArmorSetsMetal5_Chest extends ArmorSetsMetal5 {}
ArmorSet_Piece.itemFactory(ArmorSetsMetal5_Chest, {
  dynamicName: () => `${Nameable.getName("ArmorSetsMetal5")} Cuirass`,
  nameable: "ArmorSetsMetal5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/metal_5/pp_arm_b_01.png`,
  autoCalculateWeight: true,
  weight: -6,
  slots: {
    [EQUIPMENT_SLOTS.CHEST]: 1
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
      SilverPlate: 3,
      SilverRod: 4,
      BronzeBuckle: 2
    },
    building: ["Forge"],
    toolUtility: TOOL_UTILS.HAMMER,
    skill: SKILLS.SMITHING,
    skillLevel: 7,
    baseTime: 2.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: 0.5
  }
});
