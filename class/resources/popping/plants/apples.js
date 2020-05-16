const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Apple extends Edible {}
Edible.itemFactory(Apple, {
  dynamicName: () => Nameable.getName("Apples"),
  timeToEat: 3,
  nutrition: 8,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  icon: `/${ICONS_PATH}/resources/popping/plants/apple.png`
});

class Apples extends Plant {}
Entity.factory(Apples, {
  name: "Apple",
  nameable: true,
  skill: SKILLS.FORAGING,
  skillLevel: 0,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 20
  },
  produces: Apple,
  baseTime: 30,
  activeFor: 12 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Apple = Apple;
module.exports = global.Apples = Apples;
