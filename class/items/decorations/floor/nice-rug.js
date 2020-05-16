class NiceRug extends Decoration {}
Item.itemFactory(NiceRug, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/floor/carpet2.png`,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 150 * DAYS,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 8,
    [BUFFS.STATS.INTELLIGENCE]: 3,
    [BUFFS.STATS.ENDURANCE]: 3,
    [BUFFS.TEMPERATURE_MAX]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      SilkCloth: 20,
      LinenThread: 30
    },
    skill: SKILLS.TAILORING,
    toolUtility: TOOL_UTILS.SEWING,
    skillLevel: 6,
    baseTime: 3 * HOURS
  }
});

module.exports = global.NiceRug = NiceRug;
