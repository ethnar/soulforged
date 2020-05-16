class SturdyStools extends Decoration {}
Item.itemFactory(SturdyStools, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/seats/stools2.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.SEATS],
  buffs: {
    [BUFFS.MOOD]: 5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      AcaciaWood: 3,
      HardwoodShaft: 2,
      IronNails: 12
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 3 * HOURS
  }
});

module.exports = global.SturdyStools = SturdyStools;
