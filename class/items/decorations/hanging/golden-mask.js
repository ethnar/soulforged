class HangingDecoration4 extends Decoration {}
Item.itemFactory(HangingDecoration4, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/medium_tradingicons_108.png`,
  weight: 6,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 180 * DAYS,
  decorationSlots: [
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.SMITHING]: 1,
    [BUFFS.SKILLS.SMELTING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      GoldPlate: 3,
      GoldWire: 8,
      Ruby: 2,
      Amethyst: 5,
      Emerald: 2
    },
    skill: SKILLS.JEWELCRAFTING,
    skillLevel: 6,
    toolUtility: TOOL_UTILS.CARVING,
    baseTime: 3 * HOURS
  }
});

module.exports = global.HangingDecoration4 = HangingDecoration4;
