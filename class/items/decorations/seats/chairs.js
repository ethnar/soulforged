class PlainChair extends Decoration {}
Item.itemFactory(PlainChair, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/seats/chairs1.png`,
  weight: 15,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.SEATS],
  buffs: {
    [BUFFS.MOOD]: 7
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      OakWood: 3,
      HardwoodShaft: 2,
      HardwoodBoard: 1,
      IronNails: 12
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 3 * HOURS
  }
});

module.exports = global.PlainChair = PlainChair;
