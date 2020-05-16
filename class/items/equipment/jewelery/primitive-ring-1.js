class PrimitiveRingOne extends Jewelery {}
Item.itemFactory(PrimitiveRingOne, {
  name: "Carved Band",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/rng_02_b.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WillowWood: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 2 * HOURS
  }
});
