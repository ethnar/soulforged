const Plant = require("../.plant");
const Item = require("../../../../items/.item");

class Bladewort extends Item {}
Object.assign(Bladewort.prototype, {
  dynamicName: () => `${Nameable.getName("Bladeworts")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/prehistoricicon_60_b.png`,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS
});

class Bladeworts extends Herbs {}
Entity.factory(Bladeworts, {
  name: "Spikebloom",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Bladewort,
  skillLevel: 1,
  sizeRange: [9, 20],
  placement: {
    [NODE_TYPES.JUNGLE]: 20,
    [NODE_TYPES.TROPICAL_PLAINS]: 10
  },
  baseTime: 8 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.Bladewort = Bladewort;
module.exports = global.Bladeworts = Bladeworts;
