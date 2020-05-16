class EmeraldCutGoldNecklace extends Jewelery {}
Item.itemFactory(EmeraldCutGoldNecklace, {
  name: "Elegant Emerald Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/16_ff_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 5,
    [BUFFS.STATS.PERCEPTION]: 7,
    [BUFFS.LUCK]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 1,
      GoldWire: 2,
      CutEmerald: 1,
      Emerald: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 7,
    baseTime: 2 * HOURS
  }
});
