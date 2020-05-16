class CopperAmberRing extends Jewelery {}
Item.itemFactory(CopperAmberRing, {
  name: "Glimmering Amber Ring",

  icon: `/${ICONS_PATH}/items/equipment/jewelery/49_b_copper.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperMetalRing: 1,
      Amber: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 2,
    baseTime: 2 * HOURS
  }
});
