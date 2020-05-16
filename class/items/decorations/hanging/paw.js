class HangingDecoration2 extends Decoration {}
Item.itemFactory(HangingDecoration2, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/small_paw_b_05.png`,
  weight: 0.5,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 40 * DAYS,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_HANGING_DECOR,
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.FORAGING]: 0.1,
    [BUFFS.SKILLS.TRACKING]: 0.1,
    [BUFFS.SKILLS.PATHFINDING]: 0.1,
    [BUFFS.SKILLS.SPELUNKING]: 0.1,
    [BUFFS.SKILLS.COOKING]: 0.1,
    [BUFFS.SKILLS.FARMING]: 0.1,
    [BUFFS.SKILLS.LOCKPICKING]: 0.1,
    [BUFFS.SKILLS.DOCTORING]: 0.1,
    [BUFFS.LUCK]: 4
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    result: {
      HangingDecoration2: 2
    },
    materials: {
      Rabbit: 1,
      BronzeMetalRing: 2,
      BronzeWire: 4
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 2,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 2 * HOURS
  }
});

module.exports = global.HangingDecoration2 = HangingDecoration2;
