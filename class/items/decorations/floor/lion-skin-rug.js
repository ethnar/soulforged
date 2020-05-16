class LionSkinRug extends Decoration {}
Item.itemFactory(LionSkinRug, {
  dynamicName: () => `${Nameable.getName("Lion")} Skin Rug`,
  icon: `/${ICONS_PATH}/items/decorations/floor/huntingicons_29_yellow.png`,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 5,
    [BUFFS.STATS.ENDURANCE]: 2,
    [BUFFS.STATS.PERCEPTION]: 2,
    [BUFFS.TEMPERATURE_MAX]: 1
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      LionSkin: 20,
      LinenThread: 15
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 3,
    baseTime: 3 * HOURS
  }
});

module.exports = global.LionSkinRug = LionSkinRug;
