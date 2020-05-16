class TopazCutCopperRing extends Jewelery {}
Item.itemFactory(TopazCutCopperRing, {
  name: "Smooth Topaz Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/52_b.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 3,
    [BUFFS.STATS.INTELLIGENCE]: 4
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperMetalRing: 1,
      CopperWire: 1,
      Topaz: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 3,
    baseTime: 2 * HOURS
  }
});
