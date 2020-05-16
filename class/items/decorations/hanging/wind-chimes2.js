class WindChimes2 extends Decoration {}
Item.itemFactory(WindChimes2, {
  nameable: true,
  icon: `/${ICONS_PATH}/items/decorations/hanging/medium_barbarian_icons_115_b.png`,
  weight: 1,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [
    DECORATION_SLOTS.MEDIUM_HANGING_DECOR,
    DECORATION_SLOTS.LARGE_HANGING_DECOR
  ],
  buffs: {
    [BUFFS.SKILLS.MINING]: 0.5,
    [BUFFS.SKILLS.SMITHING]: 0.5,
    [BUFFS.SKILLS.SPELUNKING]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      AncientBone: 4,
      SilverMetalRing: 1,
      LinenThread: 10
    },
    skill: SKILLS.CRAFTING,
    skillLevel: 3,
    toolUtility: TOOL_UTILS.CUTTING,
    baseTime: 3 * HOURS
  }
});

module.exports = global.WindChimes2 = WindChimes2;
