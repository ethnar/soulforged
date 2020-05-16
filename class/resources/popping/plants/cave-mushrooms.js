const Edible = require("../../../items/edibles/.edible");
const Plant = require("./.plant");

class CaveMushroom extends Edible {}
Edible.itemFactory(CaveMushroom, {
  dynamicName: () => Nameable.getName("CaveMushrooms"),
  timeToEat: 2,
  nutrition: 4,
  weight: 0.1,
  expiresIn: 15 * DAYS,
  calculateEffects: 1,
  buffs: {
    // tier 0
    [BUFFS.SKILLS.MINING]: 0.7,
    [BUFFS.SKILLS.COOKING]: -0.5,
    [BUFFS.SKILLS.FARMING]: -0.5,
    [BUFFS.SKILLS.FORAGING]: -0.5
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/mushroom_05.png`
});

class CaveMushrooms extends Plant {}
Entity.factory(CaveMushrooms, {
  name: "Cave Mushroom",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: CaveMushroom,
  skillLevel: 2,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.UNDERGROUND_CAVE]: 15,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 15
  },
  baseTime: 5 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.CaveMushroom = CaveMushroom;
module.exports = global.CaveMushrooms = CaveMushrooms;
