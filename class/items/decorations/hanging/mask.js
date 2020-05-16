class HangingDecoration1 extends Decoration {}
Item.itemFactory(HangingDecoration1, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/medium_artifact_07_b.png`,
  weight: 1.5,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 80 * DAYS,
  decorationSlots: [
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.FORAGING]: 0.6,
    [BUFFS.SKILLS.FARMING]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      WoodenBoard: 1,
      TinWire: 8,
      ScreechFeather: 8
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.CARVING,
    baseTime: 2 * HOURS
  }
});

module.exports = global.HangingDecoration1 = HangingDecoration1;
