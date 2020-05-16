class Statue14332 extends StatueDecoration {}
Item.itemFactory(Statue14332, {
  name: "Guardian Statue",
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/statues/necromancericons_77_b_green_eyes.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  buffs: {
    [BUFFS.STATS.DEXTERITY]: 2,
    [BUFFS.STATS.PERCEPTION]: 3
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0,
      TabletWriting14332: 0
    }
  },
  crafting: {
    materials: {
      Emerald: 2,
      GraniteBlock: 2
    },
    toolUtility: TOOL_UTILS.CARVING,
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    baseTime: 4 * HOURS
  }
});
