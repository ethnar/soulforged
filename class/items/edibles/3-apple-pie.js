const Edible = require("./.edible");

class ApplePie extends Edible {}
Edible.itemFactory(ApplePie, {
  name: "Apple Pie",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/baking_03.png`,
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
      Flour: 4,
      Apple: 3,
      ChickenEgg: 2,
      Firewood: 1
    },
    building: ["Kiln"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 3
  }
});

module.exports = global.ApplePie = ApplePie;
