class AmberSilverRing extends Jewelery {}
Item.itemFactory(AmberSilverRing, {
  name: "Encrusted Amber Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/130_b_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 3,
    [BUFFS.STATS.PERCEPTION]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SilverMetalRing: 1,
      SilverWire: 1,
      Amber: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 2,
    baseTime: 2 * HOURS
  }
});
