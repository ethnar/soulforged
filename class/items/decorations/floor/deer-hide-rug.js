class DeerSkinRug extends Decoration {}
Item.itemFactory(DeerSkinRug, {
  dynamicName: () => `${Nameable.getName("Deers")} Skin Rug`,
  icon: `/${ICONS_PATH}/items/decorations/floor/huntingicons_29.png`,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 3,
    [BUFFS.SKILLS.HUNTING]: 0.2,
    [BUFFS.TEMPERATURE_MIN]: 0.2
  },
  research: {
    sameAsCrafting: true,
    materials: {
      ResearchConcept_FurnitureDecoration: 0
    }
  },
  crafting: {
    materials: {
      DeerHide: 20
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 0,
    baseTime: 2 * HOURS
  }
});

module.exports = global.DeerSkinRug = DeerSkinRug;
