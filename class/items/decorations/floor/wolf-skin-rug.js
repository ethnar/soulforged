class WolfSkinRug extends Decoration {}
Item.itemFactory(WolfSkinRug, {
  dynamicName: () => `${Nameable.getName("Wolf")} Skin Rug`,
  icon: `/${ICONS_PATH}/items/decorations/floor/huntingicons_29_gray.png`,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.FLOOR],
  buffs: {
    [BUFFS.MOOD]: 3,
    [BUFFS.SKILLS.FIGHTING_KNIFE]: 0.3,
    [BUFFS.SKILLS.FIGHTING_POLEARM]: 0.3,
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
      WolfHide: 20
    },
    skill: SKILLS.LEATHERWORKING,
    skillLevel: 0,
    baseTime: 2 * HOURS
  }
});

module.exports = global.WolfSkinRug = WolfSkinRug;
