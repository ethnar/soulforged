const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class CoconutOpen extends Edible {}
Edible.itemFactory(CoconutOpen, {
  dynamicName: () => `Open ${Nameable.getName("Coconuts")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/coconut_open.png`,
  timeToEat: 3 * SECONDS,
  nutrition: 5,
  weight: 0.2,
  expiresIn: 5 * DAYS,
  calculateEffects: 1,
  buffs: {
    // tier 1
    [BUFFS.MOOD]: 3
  },
  research: {
    sameAsCrafting: true
  },
  crafting: {
    name: "Open Coconut",
    materials: {
      Coconut: 1
    },
    result: {
      CoconutOpen: 2
    },
    toolUtility: TOOL_UTILS.HAMMER,
    baseTime: 10 * SECONDS
  }
});

class Coconut extends Edible {}
Edible.itemFactory(Coconut, {
  dynamicName: () => Nameable.getName("Coconuts"),
  timeToEat: 60 * SECONDS,
  nutrition: 10,
  weight: 0.5,
  expiresIn: 60 * DAYS,
  calculateEffects: 0.5,
  buffs: {
    // tier 0
    [BUFFS.MOOD]: -10
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/coconut_closed.png`
});

class Coconuts extends Plant {}
Entity.factory(Coconuts, {
  name: "Coconut",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Coconut,
  skillLevel: 1,
  sizeRange: [8, 36],
  placement: {
    [NODE_TYPES.DESERT_PALMS]: 24
  },
  baseTime: 4 * MINUTES,
  activeFor: 6 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Coconut = Coconut;
module.exports = global.Coconuts = Coconuts;
