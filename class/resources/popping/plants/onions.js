const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Onion extends Edible {}
Edible.itemFactory(Onion, {
  dynamicName: () => Nameable.getName("Onions"),
  timeToEat: 3,
  nutrition: 5,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  buffs: {
    // tier 0
    [BUFFS.MOOD]: -4
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/food_25_t.png`
});

class Onions extends Plant {}
Entity.factory(Onions, {
  name: "Onion",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Onion,
  skillLevel: 0,
  sizeRange: [12, 30],
  placement: {
    [NODE_TYPES.BOG]: 22,
    [NODE_TYPES.SWAMP]: 1
  },
  baseTime: 8 * MINUTES,
  activeFor: 6 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Onion = Onion;
module.exports = global.Onions = Onions;
