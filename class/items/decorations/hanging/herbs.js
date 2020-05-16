class HangingDecoration3 extends Decoration {}
Item.itemFactory(HangingDecoration3, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/small_r_02.png`,
  weight: 1.5,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_HANGING_DECOR,
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.FORAGING]: 0.5,
    [BUFFS.SKILLS.ALCHEMY]: 0.5,
    [BUFFS.SKILLS.DOCTORING]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      Bitterweed: 12,
      SilverNettle: 10,
      Sungrass: 10,
      Muckroot: 10,
      BarkThread: 10
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 1,
    baseTime: 1 * HOURS
  }
});

module.exports = global.HangingDecoration3 = HangingDecoration3;
