class EmeraldCutBronzeNecklace extends Jewelery {}
Item.itemFactory(EmeraldCutBronzeNecklace, {
  name: "Elegant Emerald Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/122_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 4,
    [BUFFS.STATS.PERCEPTION]: 5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BronzeMetalRing: 1,
      BronzeWire: 1,
      CutEmerald: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 6,
    baseTime: 2 * HOURS
  }
});
