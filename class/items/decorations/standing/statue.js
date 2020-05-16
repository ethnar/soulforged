class Statue extends StatueDecoration {}
Item.itemFactory(Statue, {
  name: "Statue",
  icon: `/${ICONS_PATH}/items/decorations/standing/medium_sgi_15.png`,
  weight: 4,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.MEDIUM_STANDING_DECOR,
    DECORATION_SLOTS.LARGE_STANDING_DECOR
  ],
  buffs: {
    [BUFFS.STATS.INTELLIGENCE]: 2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      GraniteBlock: 1
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    baseTime: 2 * HOURS
  }
});
