const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class Mushroom extends Edible {}
Edible.itemFactory(Mushroom, {
  dynamicName: () => Nameable.getName("Mushrooms"),
  timeToEat: 3,
  nutrition: 5,
  weight: 0.4,
  expiresIn: 3 * DAYS,
  buffs: {
    // tier 0
    [BUFFS.STATS.STRENGTH]: -5,
    [BUFFS.STATS.INTELLIGENCE]: -5
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/forest_mushroom.png`
});

class Mushrooms extends Plant {}
Entity.factory(Mushrooms, {
  name: "Mushroom",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Mushroom,
  skillLevel: 0.3,
  sizeRange: [90, 150],
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 80,
    [NODE_TYPES.CONIFEROUS_FOREST]: 45
  },
  baseTime: 2 * MINUTES,
  activeFor: 15 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Mushroom = Mushroom;
module.exports = global.Mushrooms = Mushrooms;
