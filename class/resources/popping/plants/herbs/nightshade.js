const Herbs = require("./.herbs");
const Edible = require("../../../../items/edibles/.edible");

class Nightshade extends Edible {}
Object.assign(Nightshade.prototype, {
  dynamicName: () => `${Nameable.getName("Nightshades")}`,
  timeToEat: 2,
  nutrition: 2,
  weight: 0.05,
  expiresIn: 15 * DAYS,
  buffs: {
    // tier 1
    [BUFFS.MOOD]: 5,
    [BUFFS.NAUSEOUS]: 10
  },
  icon: `/${ICONS_PATH}/resources/popping/plants/herbs/hb_b_08.png`
});

class Nightshades extends Herbs {}
Entity.factory(Nightshades, {
  name: "Nightshade",
  nameable: true,
  skill: SKILLS.FORAGING,
  produces: Nightshade,
  skillLevel: 1,
  sizeRange: [9, 20],
  placement: {
    [NODE_TYPES.BROADLEAF_FOREST]: 5,
    [NODE_TYPES.CONIFEROUS_FOREST]: 20,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 30,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 30
  },
  baseTime: 6 * MINUTES,
  activeFor: 7 * DAYS
});
module.exports = global.Nightshade = Nightshade;
module.exports = global.Nightshades = Nightshades;
