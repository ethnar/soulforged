const Edible = require("./.edible");

class HerringSoup extends Edible {}
Edible.itemFactory(HerringSoup, {
  name: "Fish Chowder",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/soup.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 15 * DAYS,
  calculateEffects: 2,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Herring: 1,
      Lemon: 1,
      ClayPot: 1
    },
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});
