const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class Herring extends Edible {}
Edible.itemFactory(Herring, {
  dynamicName: () => `${Nameable.getName("Herrings")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_112_b.png`
});

class Herrings extends Fish {}
Entity.factory(Herrings, {
  name: "Herring",
  skill: SKILLS.FISHING,
  produces: Herring,
  sizeRange: [9, 20],
  skillLevel: 2,
  placement: {
    [NODE_TYPES.COAST]: 18
  },
  placementCondition: node => node.isTemperatureRange(-1, 15),
  baseTime: 30 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Herring = Herring;
module.exports = global.Herrings = Herrings;
