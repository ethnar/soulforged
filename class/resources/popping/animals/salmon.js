const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class Salmon extends Edible {}
Edible.itemFactory(Salmon, {
  dynamicName: () => `${Nameable.getName("Salmons")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_90_b.png`
});

class Salmons extends Fish {}
Entity.factory(Salmons, {
  name: "Salmon",
  skill: SKILLS.FISHING,
  produces: Salmon,
  sizeRange: [6, 12],
  skillLevel: 3,
  placement: {
    [NODE_TYPES.COAST]: 18
  },
  placementCondition: node => node.isTemperatureRange(-20, -4),
  baseTime: 30 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Salmon = Salmon;
module.exports = global.Salmons = Salmons;
