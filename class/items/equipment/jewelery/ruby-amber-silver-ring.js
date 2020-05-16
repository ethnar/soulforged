class RubyAmberSilverRing extends Jewelery {}
Item.itemFactory(RubyAmberSilverRing, {
  name: "Intricate Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/rn_b_03.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 3,
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.STATS.INTELLIGENCE]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldWire: 1,
      LeadMetalRing: 1,
      Ruby: 1,
      Amber: 2
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 5,
    baseTime: 2 * HOURS
  }
});
