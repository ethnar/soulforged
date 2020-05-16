const ArmorSetsCloth2 = require("./.cloth_2");

class ArmorSetsCloth2_Hands extends ArmorSetsCloth2 {}
ArmorSet_Piece.itemFactory(ArmorSetsCloth2_Hands, {
  dynamicName: () => `${Nameable.getName("ArmorSetsCloth2")} Gloves`,
  nameable: "ArmorSetsCloth2",
  order: ITEMS_ORDER.ARMOUR,
  icon: `/${ICONS_PATH}/items/equipment/armorsets/cloth_2/illusionist_gl_b.png`,
  autoCalculateWeight: true,
  slots: {
    [EQUIPMENT_SLOTS.HANDS]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      LinenCloth: 3,
      LinenThread: 6,
      GoatHide: 1,
      DuskCrowFeather: 4
    },
    toolUtility: TOOL_UTILS.SEWING,
    skill: SKILLS.TAILORING,
    skillLevel: 3,
    baseTime: 40 * MINUTES
  },
  buffs: {
    [BUFFS.TEMPERATURE_MAX]: 0.6,

    [BUFFS.SKILLS.FORAGING]: 0.3,
    [BUFFS.SKILLS.COOKING]: 0.3,
    [BUFFS.SKILLS.TAILORING]: 0.3,
    //[BUFFS.SKILLS.MILLING]: 1,
    [BUFFS.SKILLS.ALCHEMY]: 0.3
  }
});
