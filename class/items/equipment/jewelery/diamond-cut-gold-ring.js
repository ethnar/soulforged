class DiamondCutGoldRing extends Jewelery {}
Item.itemFactory(DiamondCutGoldRing, {
  name: "Shining Diamond Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/82b_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 6,
    [BUFFS.STATS.STRENGTH]: 2,
    [BUFFS.STATS.INTELLIGENCE]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldWire: 1,
      GoldMetalRing: 1,
      CutDiamond: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  }
});
