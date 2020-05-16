class BearSkinRug extends Decoration {}
Item.itemFactory(BearSkinRug, {
  dynamicName: () => `${Nameable.getName("Bear")} Skin Rug`,
  icon: `/${ICONS_PATH}/items/decorations/floor/huntingicons_29_darker.png`,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 4,
    [BUFFS.STATS.STRENGTH]: 1,
    [BUFFS.TEMPERATURE_MIN]: 0.5
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      BearHide: 20
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 1,
    baseTime: 3 * HOURS
  }
});

module.exports = global.BearSkinRug = BearSkinRug;
