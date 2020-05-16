const Edible = require("./.edible");

class FriedEgg extends Edible {}
Edible.itemFactory(FriedEgg, {
  name: "Fried Egg",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/omelette.png`,
  timeToEat: 3,
  nutrition: 6,
  expiresIn: 3 * DAYS,
  calculateEffects: 1,
  weight: 0.1,
  buffs: {
    [BUFFS.MOOD]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      ChickenEgg: 1,
      Firewood: 1
    },
    building: ["Fireplace"],
    baseTime: 15 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 4
  }
});

module.exports = global.FriedEgg = FriedEgg;
