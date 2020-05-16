class PrimitiveRingThree extends Jewelery {}
Item.itemFactory(PrimitiveRingThree, {
  name: "Snake Band",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/77_b.png`,
  expiresIn: 60 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 1,
    [BUFFS.STATS.PERCEPTION]: 0.5
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      SnakeSkin: 1,
      WillowWood: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
