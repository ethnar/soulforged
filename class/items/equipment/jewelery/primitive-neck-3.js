class PrimitiveNeckThree extends Jewelery {}
Item.itemFactory(PrimitiveNeckThree, {
  name: `Sage's Necklace`,
  icon: `/${ICONS_PATH}/items/equipment/jewelery/huntingicons_110_b.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 1,
    [BUFFS.STATS.PERCEPTION]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      WolfFang: 2,
      CopperMetalRing: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
