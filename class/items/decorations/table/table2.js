class Table2 extends Decoration {}
Item.itemFactory(Table2, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/table/table2.png`,
  weight: 30,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 100 * DAYS,
  decorationSlots: [DECORATION_SLOTS.TABLE],
  buffs: {
    [BUFFS.MOOD]: 3,
    [BUFFS.FOOD_BONUS]: 25
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      MahoganyWood: 5,
      HardwoodBoard: 1,
      HardwoodBeam: 2,
      SilverWire: 6,
      TrueIronNails: 16
    },
    skill: SKILLS.CARPENTRY,
    skillLevel: 7,
    toolUtility: TOOL_UTILS.SAWING,
    baseTime: 4 * HOURS
  }
});

module.exports = global.Table2 = Table2;
