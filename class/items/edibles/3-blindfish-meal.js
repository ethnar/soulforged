const ClayPotMeal = require("./.clay-pot-meal");

class UndergroundStew extends ClayPotMeal {}
Edible.itemFactory(UndergroundStew, {
  name: "Underground Stew",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/dish_04_recolor.png`,
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
      CaveMushroom: 2,
      Blindfish: 2,
      Bitterweed: 1,
      ClayPot: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});

module.exports = global.UndergroundStew = UndergroundStew;
