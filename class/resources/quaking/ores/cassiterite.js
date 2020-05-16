// ore of tin

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Cassiterite extends Item {}
Item.itemFactory(Cassiterite, {
  dynamicName: () => Nameable.getName("CassiteriteVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/168_b_iron.png`
});

class CassiteriteVein extends QuakingResource {}
Entity.factory(CassiteriteVein, {
  dynamicName: () => `${Nameable.getName("CassiteriteVein")} Vein`,
  name: "Cassiterite",
  skill: SKILLS.MINING,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [100, 200],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 1,
    [NODE_TYPES.HILLS_COLD]: 1,
    [NODE_TYPES.HILLS_SNOW]: 1,
    [NODE_TYPES.HILLS_DIRT]: 2,
    [NODE_TYPES.HILLS_REDGRASS]: 0,
    [NODE_TYPES.MOUNTAINS_COLD]: 2,
    [NODE_TYPES.MOUNTAINS_SNOW]: 4,
    [NODE_TYPES.MOUNTAINS_DIRT]: 6,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 3,
    [NODE_TYPES.UNDERGROUND_CAVE]: 4,
    [NODE_TYPES.UNDERGROUND_WALL]: 18
  },
  produces: (creature, core = false) => {
    if (!core) {
      const random = utils.random(1, 1000);
      if (random <= 4) {
        creature.logging(
          `You found ${Nameable.getName("Emerald")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Emerald);
      } else if (random <= 8) {
        creature.logging(
          `You found ${Nameable.getName("Topaz")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Topaz);
      }
    }
    return Cassiterite;
  },
  baseTime: 540
});
module.exports = global.Cassiterite = Cassiterite;
module.exports = global.CassiteriteVein = CassiteriteVein;
