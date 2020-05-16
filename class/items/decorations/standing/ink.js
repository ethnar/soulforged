class Standing1 extends Decoration {}
Item.itemFactory(Standing1, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/standing/small_potion_01_b.png`,
  weight: 1,
  order: ITEMS_ORDER.DECOR,
  expiresIn: 50 * DAYS,
  decorationSlots: [
    DECORATION_SLOTS.SMALL_STANDING_DECOR,
    DECORATION_SLOTS.MEDIUM_STANDING_DECOR,
    DECORATION_SLOTS.LARGE_STANDING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.ALCHEMY]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_ImpFurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      GlassFlask: 1,
      FireSquid: 5,
      ScreechFeather: 1
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 4,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 2 * HOURS
  }
});

module.exports = global.Standing1 = Standing1;
