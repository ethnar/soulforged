class CopperAmberNecklace extends Jewelery {}
Item.itemFactory(CopperAmberNecklace, {
  name: "Glimmering Amber Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/nkk_n01_b_amber_copper.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      CopperWire: 2,
      Amber: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 2 * HOURS
  }
});
