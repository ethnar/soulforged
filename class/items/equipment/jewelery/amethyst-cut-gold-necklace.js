class AmethystCutGoldNecklace extends Jewelery {}
Item.itemFactory(AmethystCutGoldNecklace, {
  name: "Elegant Amethyst Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/122_b_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 3,
    [BUFFS.STATS.INTELLIGENCE]: 4
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 1,
      GoldWire: 1,
      CutAmethyst: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 3,
    baseTime: 2 * HOURS
  }
});
