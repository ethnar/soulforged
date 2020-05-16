class TopazGoldRing extends Jewelery {}
Item.itemFactory(TopazGoldRing, {
  name: "Rough Topaz Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/129_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.STATS.INTELLIGENCE]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 1,
      TinWire: 1,
      Topaz: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 2,
    baseTime: 2 * HOURS
  }
});
