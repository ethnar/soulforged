class Statue14338 extends StatueDecoration {}
Item.itemFactory(Statue14338, {
  name: "Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/tradingicons_56_gray.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  buffs: {
    [BUFFS.STATS.ENDURANCE]: 3,
    [BUFFS.STATS.STRENGTH]: 1,
    [BUFFS.STATS.INTELLIGENCE]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14338: 0
    }
  },
  crafting: {
    materials: {
      Diamond: 2,
      GraniteBlock: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    baseTime: 4 * HOURS
  }
});
