const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class Blindfish extends Edible {}
Edible.itemFactory(Blindfish, {
  dynamicName: () => `${Nameable.getName("Blindfishes")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_110_b_alt.png`
});

class Blindfishes extends Fish {}
Entity.factory(Blindfishes, {
  name: "Blindfish",
  produces: Blindfish,
  sizeRange: [14, 30],
  skill: SKILLS.FISHING,
  skillLevel: 4,
  toolUtility: TOOL_UTILS.FISHING,
  placement: {
    [NODE_TYPES.UNDERGROUND_LAKE]: 18
  },
  baseTime: 25 * MINUTES,
  activeFor: 8 * DAYS
});

module.exports = global.Blindfish = Blindfish;
module.exports = global.Blindfishes = Blindfishes;
