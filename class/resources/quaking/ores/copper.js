// ore of copper

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Copper extends Item {}
Item.itemFactory(Copper, {
  dynamicName: () => Nameable.getName("CopperVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/st_b_06.png`
});

class CopperVein extends QuakingResource {}
Entity.factory(CopperVein, {
  dynamicName: () => `${Nameable.getName("CopperVein")} Vein`,
  name: `Copper`,
  skill: SKILLS.MINING,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [20, 40],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 1,
    [NODE_TYPES.HILLS_COLD]: 0,
    [NODE_TYPES.HILLS_SNOW]: 0,
    [NODE_TYPES.HILLS_DIRT]: 1,
    [NODE_TYPES.HILLS_REDGRASS]: 3,
    [NODE_TYPES.MOUNTAINS_COLD]: 3,
    [NODE_TYPES.MOUNTAINS_SNOW]: 5,
    [NODE_TYPES.MOUNTAINS_DIRT]: 14,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 2,
    [NODE_TYPES.UNDERGROUND_CAVE]: 3,
    [NODE_TYPES.UNDERGROUND_WALL]: 22
  },
  produces: (creature, core = false) => {
    // if (!core) {
    //     const random = utils.random(1, 1000);
    //     const chanceMultiplier = 1 + PerkSystem.getPerkBonus(creature, PERKS.GEM_CHANCE);
    //     if (random <= 3 * chanceMultiplier) {
    //         creature.logging(`You found an emerald while mining!`, LOGGING.GOOD);
    //         creature.addItemByType('Emerald');
    //     }
    // }
    return Copper;
  },
  baseTime: 540
});
module.exports = global.Copper = Copper;
module.exports = global.CopperVein = CopperVein;
