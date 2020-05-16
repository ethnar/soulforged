class Cauldron extends Decoration {}
Item.itemFactory(Cauldron, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/large_witchcrafticons_71_b.png`,
  weight: 15,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 200 * DAYS,
  decorationSlots: [
    DECORATION_SLOTS.MEDIUM_STANDING_DECOR,
    DECORATION_SLOTS.LARGE_STANDING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.COOKING]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      IronPlate: 8,
      IronRod: 3,
      IronWire: 10,
      IronMetalRing: 2
    },
    skill: SKILLS.SMITHING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 2.5 * HOURS
  }
});

module.exports = global.Cauldron = Cauldron;
