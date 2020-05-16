const ClayPotMeal = require("./.clay-pot-meal");

class FruitSalad extends ClayPotMeal {}
Edible.itemFactory(FruitSalad, {
  name: "Fruit Salad",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/food_19_t_recolor.png`,
  timeToEat: 3,
  nutrition: 12,
  calculateEffects: 3,
  buffs: {},
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Apple: 3,
      Wildberry: 3,
      Dragonfruit: 3,
      ClayPot: 1
    },
    baseTime: 15 * MINUTES,
    toolUtility: TOOL_UTILS.CUTTING,
    skill: SKILLS.COOKING,
    skillLevel: 4,
    level: 1
  }
});

module.exports = global.FruitSalad = FruitSalad;
