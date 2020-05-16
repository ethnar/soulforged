class Statue14327 extends StatueDecoration {}
Item.itemFactory(Statue14327, {
  name: "Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/149_b_red_eyes.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  buffs: {
    [BUFFS.STATS.STRENGTH]: 4,
    [BUFFS.STATS.ENDURANCE]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14327: 0
    }
  },
  crafting: {
    materials: {
      Ruby: 2,
      GraniteBlock: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    baseTime: 4 * HOURS
  }
});
