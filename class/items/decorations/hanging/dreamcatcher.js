class Dreamcatcher extends Decoration {}
Item.itemFactory(Dreamcatcher, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/small_prehistoricicon_115_b_black.png`,
  weight: 0.2,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_HANGING_DECOR,
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.FORAGING]: 0.3,
    [BUFFS.SKILLS.MINING]: 0.3,
    [BUFFS.SKILLS.HUNTING]: 0.3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      Twig: 3,
      BarkThread: 5,
      DuskCrowFeather: 5
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 1.5 * HOURS
  }
});

module.exports = global.Dreamcatcher = Dreamcatcher;
