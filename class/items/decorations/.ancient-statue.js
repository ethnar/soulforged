const Decoration = require("./.decoration");

class AncientStatueDecoration extends Decoration {}
Object.assign(AncientStatueDecoration.prototype, {
  name: "?AncientStatue?",
  expiresIn: 10 * YEARS,
  weight: 10,
  order: ITEMS_ORDER.DECOR,
  decorationSlots: [DECORATION_SLOTS.LARGE_STANDING_DECOR],
  crafting: {
    materials: {
      GoldIngot: 5,
      GoldMetalRing: 2,
      GoldRod: 4,
      SilverIngot: 4,
      HeartOfDarkness: 1
    }
  }
});

module.exports = global.AncientStatueDecoration = AncientStatueDecoration;
