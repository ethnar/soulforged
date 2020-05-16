const Plant = require("../.plant");
const Item = require("../../../../items/.item");

class Acorn extends Item {}
Object.assign(Acorn.prototype, {
  dynamicName: () => `${Nameable.getName("Acorns")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/acorn_b_01.png`,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS
});

class Acorns extends Plant {}
Entity.factory(Acorns, {
  name: "Acorn",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Acorn,
  skillLevel: 0,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 40
  },
  placementCondition: node => node.hasResource("Oak"),
  baseTime: 3 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.Acorn = Acorn;
module.exports = global.Acorns = Acorns;
