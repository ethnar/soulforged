const Edible = require("../../../../items/edibles/.edible");
const Herbs = require("./.herbs");

class Bitterweed extends Edible {}
Object.assign(Bitterweed.prototype, {
  dynamicName: () => `${Nameable.getName("Bitterweeds")}`,
  timeToEat: 2,
  nutrition: 1,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS,
  expiresIn: 30 * DAYS,
  buffs: {
    // tier 0
    [BUFFS.MOOD]: -15,
    [BUFFS.PAIN]: -40
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/lf_n_01_b.png`
});

class Bitterweeds extends Herbs {}
Entity.factory(Bitterweeds, {
  name: "Bitterweed",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Bitterweed,
  skillLevel: 2,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.BOG]: 15,
    [NODE_TYPES.SWAMP]: 25
  },
  baseTime: 9 * MINUTES,
  activeFor: 4 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Bitterweed = Bitterweed;
module.exports = global.Bitterweeds = Bitterweeds;
