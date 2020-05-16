class WindChimes extends Decoration {}
Item.itemFactory(WindChimes, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/small_prehistoricicon_114_b.png`,
  weight: 0.3,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_HANGING_DECOR,
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.CARPENTRY]: 0.3,
    [BUFFS.SKILLS.TAILORING]: 0.3,
    [BUFFS.SKILLS.CRAFTING]: 0.3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      PoplarWood: 1,
      BarkThread: 5
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 3 * HOURS
  }
});

module.exports = global.WindChimes = WindChimes;
