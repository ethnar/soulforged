const Herbs = require("./.herbs");
const Item = require("../../../../items/.item");

class Sungrass extends Item {}
Object.assign(Sungrass.prototype, {
  dynamicName: () => `${Nameable.getName("SungrassField")}`,
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/hb_b_03.png`,
  weight: 0.05,
  order: ITEMS_ORDER.PLANTS
});

class SungrassField extends Herbs {}
Entity.factory(SungrassField, {
  name: "Sungrass",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Sungrass,
  skillLevel: 3,
  sizeRange: [40, 70],
  placement: {
    [NODE_TYPES.SAVANNAH]: 30,
    [NODE_TYPES.DESERT_GRASS]: 60
  },
  baseTime: 8 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.Sungrass = Sungrass;
module.exports = global.SungrassField = SungrassField;
