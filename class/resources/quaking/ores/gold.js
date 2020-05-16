// ore of gold

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class GoldOre extends Item {}
Item.itemFactory(GoldOre, {
  dynamicName: () => Nameable.getName("GoldVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/175_b_gold.png`
});

class GoldVein extends QuakingResource {}
Entity.factory(GoldVein, {
  dynamicName: () => `${Nameable.getName("GoldVein")} Vein`,
  name: "Gold",
  skill: SKILLS.MINING,
  skillLevel: 4,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [8, 15],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 0,
    [NODE_TYPES.HILLS_COLD]: 0,
    [NODE_TYPES.HILLS_SNOW]: 0,
    [NODE_TYPES.HILLS_DIRT]: 0,
    [NODE_TYPES.HILLS_REDGRASS]: 1,
    [NODE_TYPES.MOUNTAINS_COLD]: 0,
    [NODE_TYPES.MOUNTAINS_SNOW]: 0,
    [NODE_TYPES.MOUNTAINS_DIRT]: 1,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 0,
    [NODE_TYPES.UNDERGROUND_CAVE]: 0,
    [NODE_TYPES.UNDERGROUND_WALL]: 4
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
    return GoldOre;
  },
  baseTime: 540
});
module.exports = global.GoldOre = GoldOre;
module.exports = global.GoldVein = GoldVein;
