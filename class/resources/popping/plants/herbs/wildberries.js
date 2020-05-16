const Edible = require("../../../../items/edibles/.edible");
const Herbs = require("./.herbs");

class Wildberry extends Edible {}
Object.assign(Wildberry.prototype, {
  dynamicName: () => `${Nameable.getName("Wildberries")}`,
  order: ITEMS_ORDER.PLANTS,
  timeToEat: 2,
  nutrition: 2,
  weight: 0.05,
  expiresIn: 15 * DAYS,
  buffs: {
    // tier 1
    [BUFFS.MOOD]: 2
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/witchcrafticons_50_b.png`
});

class Wildberries extends Herbs {}
Entity.factory(Wildberries, {
  name: "Wildberry",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Wildberry,
  skillLevel: 0,
  sizeRange: [40, 70],
  placement: {
    [NODE_TYPES.PLAINS]: 25,
    [NODE_TYPES.BROADLEAF_FOREST]: 40
  },
  baseTime: 45,
  activeFor: 6 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.Wildberry = Wildberry;
module.exports = global.Wildberries = Wildberries;
