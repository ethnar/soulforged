class DiamondTinNecklace extends Jewelery {}
Item.itemFactory(DiamondTinNecklace, {
  name: "Shining Diamond Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/nkk_n03_b_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.STATS.STRENGTH]: 1,
    [BUFFS.STATS.INTELLIGENCE]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      TinWire: 2,
      TinMetalRing: 1,
      Diamond: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 2,
    baseTime: 2 * HOURS
  }
});
