class LinenRug extends Decoration {}
Item.itemFactory(LinenRug, {
  dynamicName: () => `Linen Rug`,
  icon: `/${ICONS_PATH}/items/decorations/floor/carpet1.png`,
  weight: 6,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 6,
    [BUFFS.STATS.DEXTERITY]: 2,
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.TEMPERATURE_MAX]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      LinenCloth: 12,
      BarkThread: 30
    },
    skill: SKILLS.TAILORING,
    toolUtility: TOOL_UTILS.SEWING,
    skillLevel: 4,
    baseTime: 3 * HOURS
  }
});

module.exports = global.LinenRug = LinenRug;
