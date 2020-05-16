const Edible = require("./.edible");

class Bread extends Edible {}
Edible.itemFactory(Bread, {
  name: "Bread Roll",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/baking_04_bg.png`,
  timeToEat: 3,
  nutrition: 10,
  expiresIn: 35 * DAYS,
  weight: 0.2,
  calculateEffects: 1.5,
  buffs: {
    [BUFFS.MOOD]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Flour: 2,
      Firewood: 1
    },
    building: ["Kiln"],
    baseTime: 5 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 2
  }
});
module.exports = global.Bread = Bread;
