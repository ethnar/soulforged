const Edible = require("./.edible");

class MellowSalmon extends Edible {}
Edible.itemFactory(MellowSalmon, {
  name: "Mellow Salmon",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/barbarian_icons_101_b_recolor.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 15 * DAYS,
  calculateEffects: 3,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bitterweed: 2,
      Salmon: 1,
      CoconutOpen: 1,
      ClayPot: 1
    },
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 4
  }
});
