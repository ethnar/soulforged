const ClayPotMeal = require("./.clay-pot-meal");

class PastaAndMeatballs extends ClayPotMeal {}
Edible.itemFactory(PastaAndMeatballs, {
  name: "Meatballs Meal",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/food_18_t_clay.png`,
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
      ChickenEgg: 4,
      Flour: 4,
      ToughMeat: 2,
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

module.exports = global.PastaAndMeatballs = PastaAndMeatballs;
