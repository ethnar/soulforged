class PrimitiveRingFive extends Jewelery {}
Item.itemFactory(PrimitiveRingFive, {
  name: "Fanged Ring",
  icon: `/${ICONS_PATH}/items/equipment/jewelery/10_b.png`,
  expiresIn: 100 * DAYS,
  slots: {
    [EQUIPMENT_SLOTS.FINGER]: 1
  },
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 0.5,
    [BUFFS.STATS.DEXTERITY]: 1
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      WillowWood: 1,
      WolfFang: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});
