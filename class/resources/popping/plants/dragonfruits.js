const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Dragonfruit extends Edible {}
Edible.itemFactory(Dragonfruit, {
  dynamicName: () => Nameable.getName("Dragonfruits"),
  timeToEat: 3,
  nutrition: 10,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  buffs: {
    // tier 2
    [BUFFS.MOOD]: 3
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/pumpkin_01.png`
});

class Dragonfruits extends Plant {}
Entity.factory(Dragonfruits, {
  name: "Dragonfruit",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Dragonfruit,
  skillLevel: 4,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.JUNGLE]: 10
  },
  baseTime: 12 * MINUTES,
  activeFor: 6 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Dragonfruit = Dragonfruit;
module.exports = global.Dragonfruits = Dragonfruits;
