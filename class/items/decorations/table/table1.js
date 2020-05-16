class Table1 extends Decoration {}
Item.itemFactory(Table1, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/table/table1.png`,
  weight: 15,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.TABLE],
  buffs: {
    [BUFFS.MOOD]: 2,
    [BUFFS.FOOD_BONUS]: 10
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      WoodenBoard: 1,
      WoodenBeam: 4,
      IronNails: 8
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 2.5 * HOURS
  }
});

module.exports = global.Table1 = Table1;
