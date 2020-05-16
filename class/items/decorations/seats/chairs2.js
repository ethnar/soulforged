class HighChair extends Decoration {}
Item.itemFactory(HighChair, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/seats/chairs2.png`,
  weight: 25,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.SEATS],
  buffs: {
    [BUFFS.MOOD]: 9
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      AcaciaWood: 4,
      HardwoodShaft: 2,
      HardwoodBoard: 1,
      TrueIronNails: 12
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 4 * HOURS
  }
});

module.exports = global.HighChair = HighChair;
