const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class Trout extends Edible {}
Edible.itemFactory(Trout, {
  dynamicName: () => `${Nameable.getName("Trouts")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_91_b.png`
});

class Trouts extends Fish {}
Entity.factory(Trouts, {
  name: "Trout",
  skill: SKILLS.FISHING,
  produces: Trout,
  sizeRange: [19, 40],
  skillLevel: 1,
  placement: {
    [NODE_TYPES.COAST]: 25
  },
  placementCondition: node => node.isTemperatureRange(-2, 2),
  baseTime: 30 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Trout = Trout;
module.exports = global.Trouts = Trouts;
