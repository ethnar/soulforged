const ClayPotMeal = require("./.clay-pot-meal");

class Broth extends ClayPotMeal {}
Edible.itemFactory(Broth, {
  name: "Broth",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/food_34_t_clay.png`,
  timeToEat: 3,
  nutrition: 12,
  expiresIn: 5 * DAYS,
  calculateEffects: 3,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Carrot: 2,
      Onion: 2,
      FowlMeat: 1,
      ClayPot: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});

module.exports = global.Broth = Broth;
