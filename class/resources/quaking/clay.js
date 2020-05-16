const QuakingResource = require("./.quaking-resource");
const Item = require("../../items/.item");
require("../../items/gems/amber");

class Clay extends Item {}
Object.assign(Clay.prototype, {
  name: "Clay",
  icon: `/${ICONS_PATH}/resources/quaking/prehistoricicon_79_b.png`
});

class ClayDeposit extends QuakingResource {}
Object.assign(ClayDeposit.prototype, {
  nameable: false,
  name: "Clay Deposit",
  skill: SKILLS.MINING,
  skillLevel: 0,
  sizeRange: [200, 300],
  toolUtility: TOOL_UTILS.MINING,
  produces: (creature, core = false) => {
    if (!core) {
      const random = utils.random(1, 1000);
      const chanceMultiplier =
        1 + PerkSystem.getPerkBonus(creature, PERKS.GEM_CHANCE);
      if (random <= 5 * chanceMultiplier) {
        creature.logging(
          `You found ${Nameable.getName("Amber")} while mining!`,
          LOGGING.GOOD
        );
        return Amber;
      }
    }
    return Clay;
  },
  placement: {
    [NODE_TYPES.SNOW_FIELDS]: 15,
    [NODE_TYPES.BOG]: 55,
    [NODE_TYPES.TROPICAL_PLAINS]: 15,
    [NODE_TYPES.DESERT_SAND]: 15,
    [NODE_TYPES.JUNGLE]: 15,
    [NODE_TYPES.SAVANNAH]: 15,
    [NODE_TYPES.CACTI]: 15,
    [NODE_TYPES.SWAMP]: 35,
    [NODE_TYPES.DESERT_PALMS]: 15,
    [NODE_TYPES.DESERT_GRASS]: 15,
    [NODE_TYPES.PLAINS]: 15,
    [NODE_TYPES.SCRUB_LAND]: 15,
    [NODE_TYPES.PLAINS_SNOW]: 15,
    [NODE_TYPES.COLD_DIRT]: 15,
    [NODE_TYPES.BROADLEAF_FOREST]: 7,
    [NODE_TYPES.CONIFEROUS_FOREST_SNOWED]: 7,
    [NODE_TYPES.CONIFEROUS_FOREST_COLD]: 7,
    [NODE_TYPES.CONIFEROUS_FOREST]: 7,
    [NODE_TYPES.HILLS_DIRT]: 30,
    [NODE_TYPES.HILLS_REDGRASS]: 30,
    [NODE_TYPES.HILLS_GRASS]: 10,
    [NODE_TYPES.HILLS_SNOW]: 10,
    [NODE_TYPES.HILLS_COLD]: 10,
    [NODE_TYPES.MOUNTAINS_DIRT]: 0,
    [NODE_TYPES.MOUNTAINS_COLD]: 0,
    [NODE_TYPES.MOUNTAINS_SNOW]: 0
  },
  placementCondition: node => node.isCoast(),
  baseTime: 4 * MINUTES
});
module.exports = global.Clay = Clay;
module.exports = global.ClayDeposit = ClayDeposit;
