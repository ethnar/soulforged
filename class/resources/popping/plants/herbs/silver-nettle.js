const Herbs = require("./.herbs");
const Item = require("../../../../items/.item");

class SilverNettle extends Item {}
Object.assign(SilverNettle.prototype, {
  dynamicName: () => `${Nameable.getName("SilverNettles")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/hb_b_07.png`,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS
});

class SilverNettles extends Herbs {}
Entity.factory(SilverNettles, {
  name: "Silver Nettle",
  nameable: true,
  skill: SKILLS.FORAGING,
  skillLevel: 1,
  produces: SilverNettle,
  sizeRange: [25, 40],
  placement: {
    [NODE_TYPES.PLAINS]: 10,
    [NODE_TYPES.HILLS_GRASS]: 20
  },
  baseTime: 6 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.SilverNettle = SilverNettle;
module.exports = global.SilverNettles = SilverNettles;
