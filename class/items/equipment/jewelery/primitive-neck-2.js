class PrimitiveNeckTwo extends Jewelery {}
Item.itemFactory(PrimitiveNeckTwo, {
  name: "Savage Necklace",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/barbarian_icons_88_b_black.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.NECK]: 1
  },
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 1,
    [BUFFS.STATS.ENDURANCE]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      BarkRope: 1,
      WolfFang: 2,
      DuskCrowFeather: 8
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 0,
    baseTime: 1 * HOURS
  }
});
