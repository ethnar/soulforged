// ore of lead, silver

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Galena extends Item {}
Item.itemFactory(Galena, {
  dynamicName: () => Nameable.getName("GalenaVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/b_01_a.png`
});

class GalenaVein extends QuakingResource {}
Entity.factory(GalenaVein, {
  dynamicName: () => `${Nameable.getName("GalenaVein")} Vein`,
  name: "Galena",
  skill: SKILLS.MINING,
  skillLevel: 3,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [15, 40],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 1,
    [NODE_TYPES.HILLS_COLD]: 1,
    [NODE_TYPES.HILLS_SNOW]: 2,
    [NODE_TYPES.HILLS_DIRT]: 2,
    [NODE_TYPES.HILLS_REDGRASS]: 1,
    [NODE_TYPES.MOUNTAINS_COLD]: 3,
    [NODE_TYPES.MOUNTAINS_SNOW]: 4,
    [NODE_TYPES.MOUNTAINS_DIRT]: 5,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 3,
    [NODE_TYPES.UNDERGROUND_CAVE]: 3,
    [NODE_TYPES.UNDERGROUND_WALL]: 16
  },
  produces: (creature, core = false) => {
    if (!core) {
      const random = utils.random(1, 1000);
      if (random <= 4) {
        creature.logging(
          `You found ${Nameable.getName("Amethyst")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Amethyst);
      } else if (random <= 8) {
        creature.logging(
          `You found ${Nameable.getName("Ruby")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Ruby);
      }
    }
    return Galena;
  },
  baseTime: 540
});
module.exports = global.Galena = Galena;
module.exports = global.GalenaVein = GalenaVein;
