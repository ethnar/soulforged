const Plant = require("./.plant");
const Item = require("../../../items/.item");

class Hops extends Item {}
Object.assign(Hops.prototype, {
  dynamicName: () => Nameable.getName("HopsFields"),
  icon: `/${ICONS_PATH}/resources/popping/plants/pineapple_b_green.png`,
  order: ITEMS_ORDER.OTHER,
  weight: 0.01
});

class HopsFields extends Plant {}
Entity.factory(HopsFields, {
  name: "Hops",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Hops,
  skillLevel: 1,
  sizeRange: [30, 80],
  placement: {
    [NODE_TYPES.PLAINS]: 2,
    [NODE_TYPES.SCRUB_LAND]: 30
  },
  baseTime: 5 * MINUTES,
  activeFor: 9 * DAYS
});
module.exports = global.Hops = Hops;
module.exports = global.HopsFields = HopsFields;
