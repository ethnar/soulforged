class AmethystRubyGoldNecklace extends Jewelery {}
Item.itemFactory(AmethystRubyGoldNecklace, {
  name: "Bright Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/teeth_b_02_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 2.5,
    [BUFFS.STATS.INTELLIGENCE]: 3.5,
    [BUFFS.TEMPERATURE_MIN]: 1.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 3,
      BronzeWire: 1,
      Amethyst: 1,
      Ruby: 2
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 6,
    baseTime: 2 * HOURS
  }
});
