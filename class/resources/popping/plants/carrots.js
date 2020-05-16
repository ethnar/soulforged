const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Carrot extends Edible {}
Edible.itemFactory(Carrot, {
  dynamicName: () => Nameable.getName("Carrots"),
  timeToEat: 2,
  nutrition: 4,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  icon: `/${ICONS_PATH}/resources/popping/plants/carrots_01.png`
});

class Carrots extends Plant {}
Entity.factory(Carrots, {
  name: "Carrot",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Carrot,
  skillLevel: 0,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.PLAINS]: 10,
    [NODE_TYPES.SCRUB_LAND]: 25
  },
  baseTime: 8 * MINUTES,
  activeFor: 12 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Carrot = Carrot;
module.exports = global.Carrots = Carrots;
