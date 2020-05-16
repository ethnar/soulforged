const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class Bass extends Edible {}
Edible.itemFactory(Bass, {
  dynamicName: () => `${Nameable.getName("Basses")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_03_b.png`
});

class Basses extends Fish {}
Entity.factory(Basses, {
  name: "Bass",
  skill: SKILLS.FISHING,
  produces: Bass,
  sizeRange: [9, 20],
  skillLevel: 5,
  placement: {
    [NODE_TYPES.COAST]: 3
  },
  placementCondition: node => node.isTemperatureRange(-5, 5),
  baseTime: 30 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Bass = Bass;
module.exports = global.Basses = Basses;
