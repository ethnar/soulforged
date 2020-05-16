const Fish = require("./.fish");
const Edible = require("../../../items/edibles/.edible");

class FireSquid extends Edible {}
Edible.itemFactory(FireSquid, {
  dynamicName: () => `${Nameable.getName("FireSquids")}`,
  timeToEat: 3,
  nutrition: 8,
  weight: 1,
  calculateEffects: 1,
  buffs: {},
  icon: `/${ICONS_PATH}/resources/popping/animals/fish/fishing_106_b.png`
});

class FireSquids extends Fish {}
Entity.factory(FireSquids, {
  name: "Squid",
  skill: SKILLS.FISHING,
  produces: FireSquid,
  sizeRange: [5, 15],
  skillLevel: 4,
  placement: {
    [NODE_TYPES.COAST]: 20
  },
  placementCondition: node => node.isTemperatureRange(4, 10),
  baseTime: 30 * MINUTES,
  activeFor: 8 * DAYS
});
// nutrition * 86400 / (baseTime + timeToEat)
module.exports = global.FireSquid = FireSquid;
module.exports = global.FireSquids = FireSquids;
