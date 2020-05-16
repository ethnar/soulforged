class Vase1 extends Decoration {}
Item.itemFactory(Vase1, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/large_trophyicons_07_b.png`,
  weight: 8,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 150 * DAYS,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  buffs: {
    [BUFFS.STATS.STRENGTH]: 1,
    [BUFFS.STATS.ENDURANCE]: 1,
    [BUFFS.STATS.DEXTERITY]: 1,
    [BUFFS.STATS.INTELLIGENCE]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      BronzePlate: 4,
      BronzeWire: 6,
      BronzeRod: 3,
      BronzeMetalRing: 8
    },
    skill: SKILLS.SMITHING,
    skillLevel: 5,
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 2.5 * HOURS
  }
});

module.exports = global.Vase1 = Vase1;
