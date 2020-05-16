const Edible = require("../../../../items/edibles/.edible");
const Herbs = require("./.herbs");

class Muckroot extends Edible {}
Object.assign(Muckroot.prototype, {
  dynamicName: () => `${Nameable.getName("Muckroots")}`,
  order: ITEMS_ORDER.PLANTS,
  timeToEat: 2,
  nutrition: 5,
  weight: 0.05,
  expiresIn: 2 * DAYS,
  buffs: {
    // tier 0
    [BUFFS.MOOD]: -10,
    [BUFFS.STATS.STRENGTH]: -8,
    [BUFFS.STATS.INTELLIGENCE]: -8
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/prehistoricicon_106_b.png`
});

class Muckroots extends Herbs {}
Entity.factory(Muckroots, {
  name: "Muckroot",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Muckroot,
  skillLevel: 0,
  sizeRange: [14, 25],
  placement: {
    [NODE_TYPES.PLAINS]: 60,
    [NODE_TYPES.BROADLEAF_FOREST]: 40
  },
  baseTime: 1 * MINUTES,
  activeFor: 1 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Muckroot = Muckroot;
module.exports = global.Muckroots = Muckroots;
