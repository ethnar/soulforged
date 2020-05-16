class Statue14200 extends StatueDecoration {}
Item.itemFactory(Statue14200, {
  name: "Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/miningicons_32_b.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.STATS.INTELLIGENCE]: 3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14200: 0
    }
  },
  crafting: {
    materials: {
      Topaz: 2,
      GraniteBlock: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    baseTime: 4 * HOURS
  }
});
