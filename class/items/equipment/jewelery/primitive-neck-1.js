class PrimitiveNeckOne extends Jewelery {}
Item.itemFactory(PrimitiveNeckOne, {
  name: "Fanged Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/huntingicons_90.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      WolfFang: 2
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 0,
    baseTime: 1 * HOURS
  }
});
