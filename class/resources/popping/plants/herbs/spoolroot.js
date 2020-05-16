const Herbs = require("./.herbs");
const Item = require("../../../../items/.item");

class Spoolroot extends Item {}
Object.assign(Spoolroot.prototype, {
  dynamicName: () => `${Nameable.getName("Spoolroots")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/hb_b_09_white.png`,
  weight: 0.1,
  order: ITEMS_ORDER.PLANTS
});

class Spoolroots extends Herbs {}
Entity.factory(Spoolroots, {
  name: "Spoolroot",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Spoolroot,
  skillLevel: 2,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.PLAINS]: 10,
    [NODE_TYPES.SAVANNAH]: 20,
    [NODE_TYPES.COLD_DIRT]: 10,
    [NODE_TYPES.SCRUB_LAND]: 30
  },
  baseTime: 8 * MINUTES,
  activeFor: 12 * DAYS
});
module.exports = global.Spoolroot = Spoolroot;
module.exports = global.Spoolroots = Spoolroots;
