class PrimitiveRingTwo extends Jewelery {}
Item.itemFactory(PrimitiveRingTwo, {
  name: "Rune Band",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/23_b.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.STRENGTH]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      TabletWriting14200: 0
    }
  },
  crafting: {
    materials: {
      Stone: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 2 * HOURS
  }
});
