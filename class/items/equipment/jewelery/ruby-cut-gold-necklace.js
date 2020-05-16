class RubyCutGoldNecklace extends Jewelery {}
Item.itemFactory(RubyCutGoldNecklace, {
  name: "Intricate Ruby Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/06_ob.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 6,
    [BUFFS.STATS.ENDURANCE]: 3,
    [BUFFS.TEMPERATURE_MIN]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldWire: 1,
      CopperWire: 1,
      CutRuby: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  }
});
