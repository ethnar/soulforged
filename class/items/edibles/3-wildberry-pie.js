const Edible = require("./.edible");

class WildberryPie extends Edible {}
Edible.itemFactory(WildberryPie, {
  name: "Wildberry Pie",
  nameable: true,
  icon: `/${ICONS_PATH}/items/edibles/bakery_f_07.png`,
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
      Wildberry: 5,
      ChickenEgg: 2,
      Firewood: 1
    },
    building: ["Kiln"],
    baseTime: 30 * MINUTES,
    skill: SKILLS.COOKING,
    skillLevel: 4
  }
});

module.exports = global.WildberryPie = WildberryPie;
