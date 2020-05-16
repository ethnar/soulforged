class Dreamcatcher2 extends Decoration {}
Item.itemFactory(Dreamcatcher2, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/medium_artifact_08_b.png`,
  weight: 0.8,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_HANGING_DECOR,
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.SMELTING]: 0.6,
    [BUFFS.SKILLS.TAMING]: 0.5,
    [BUFFS.SKILLS.MINING]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      BronzeWire: 2,
      LinenThread: 12,
      CopperMetalRing: 3,
      BronzeMetalRing: 3,
      TinMetalRing: 3
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 3,
    baseTime: 2 * HOURS
  }
});

module.exports = global.Dreamcatcher2 = Dreamcatcher2;
