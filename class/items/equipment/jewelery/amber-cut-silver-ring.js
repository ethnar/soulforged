class AmberCutGoldRing extends Jewelery {}
Item.itemFactory(AmberCutGoldRing, {
  name: "Delicate Amber Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/126_b_recolor.png`,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 4,
    [BUFFS.STATS.PERCEPTION]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      GoldMetalRing: 1,
      GoldWire: 1,
      CutAmber: 1
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 4,
    baseTime: 2 * HOURS
  }
});
