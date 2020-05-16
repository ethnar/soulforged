const ArmorSetsLeather5 = require("./.leather_5");

class ArmorSetsLeather5_Hands extends ArmorSetsLeather5 {}
ArmorSet_Piece.itemFactory(ArmorSetsLeather5_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsLeather5")} Gloves`,
  nameable: "ArmorSetsLeather5",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/leather_5/ren_gl_b_01.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LionSkin: 3,
      DrakeScale: 3,
      SilkThread: 5,

      LeatherStraps: 2
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 5,
    baseTime: 1.5 * HOURS
  },
  buffs: {
    [BUFFS.TEMPERATURE_MIN]: 0.5,
    [BUFFS.TEMPERATURE_MAX]: 0.2,
    [BUFFS.SKILLS.MINING]: 0.8
  }
});
