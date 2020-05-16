const Plant = require("./.plant");
const Item = require("../../../items/.item");

class Wheat extends Item {}
Item.itemFactory(Wheat, {
  dynamicName: () => Nameable.getName("WheatFields"),
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/resources/popping/plants/foresticons_03_b.png`,
  weight: 0.05
});

class WheatFields extends Plant {}
Entity.factory(WheatFields, {
  name: "Razorgrain",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Wheat,
  skillLevel: 2,
  sizeRange: [30, 80],
  placement: {
    [NODE_TYPES.PLAINS]: 100
  },
  baseTime: 4 * MINUTES,
  activeFor: 12 * DAYS
});
module.exports = global.Wheat = Wheat;
module.exports = global.WheatFields = WheatFields;
