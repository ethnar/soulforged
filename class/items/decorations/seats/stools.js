class Stools extends Decoration {}
Item.itemFactory(Stools, {
  name: "Set of Stools",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/seats/stool-576138_640.png`,
  weight: 3,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.SEATS],
  buffs: {
    [BUFFS.MOOD]: 3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      WoodenPlank: 4,
      WoodenShaft: 2
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 2 * HOURS
  }
});

module.exports = global.Stools = Stools;
