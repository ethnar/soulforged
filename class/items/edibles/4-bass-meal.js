const ClayPotMeal = require("./.clay-pot-meal");

class BassMeal extends ClayPotMeal {}
Edible.itemFactory(BassMeal, {
  name: "Crispy Bass",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/barbarian_icons_105_b.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 3 * DAYS,
  calculateEffects: 4,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Bass: 2,
      Onion: 2,
      Flour: 2,
      Bitterweed: 1,
      ClayPot: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 5
  }
});
