const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Lemon extends Edible {}
Edible.itemFactory(Lemon, {
  dynamicName: () => Nameable.getName("Lemons"),
  timeToEat: 3,
  nutrition: 4,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  buffs: {
    [BUFFS.MOOD]: -5
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/lemon_01_b.png`
});

class Lemons extends Plant {}
Entity.factory(Lemons, {
  name: "Lemon",
  nameable: true,
  skill: SKILLS.FORAGING,
  skillLevel: 4,
  sizeRange: [13, 25],
  placement: {
    [NODE_TYPES.SAVANNAH]: 14
  },
  produces: Lemon,
  baseTime: 6 * MINUTES,
  activeFor: 12 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Lemon = Lemon;
module.exports = global.Lemons = Lemons;
