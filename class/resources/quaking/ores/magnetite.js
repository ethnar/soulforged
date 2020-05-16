// ore of iron

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Magnetite extends Item {}
Item.itemFactory(Magnetite, {
  dynamicName: () => Nameable.getName("MagnetiteVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/178_b.png`
});

class MagnetiteVein extends QuakingResource {}
Entity.factory(MagnetiteVein, {
  dynamicName: () => `${Nameable.getName("MagnetiteVein")} Vein`,
  name: "Magnetite",
  skill: SKILLS.MINING,
  skillLevel: 3,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [80, 150],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 0,
    [NODE_TYPES.HILLS_COLD]: 0,
    [NODE_TYPES.HILLS_SNOW]: 0,
    [NODE_TYPES.HILLS_DIRT]: 0,
    [NODE_TYPES.HILLS_REDGRASS]: 0,
    [NODE_TYPES.MOUNTAINS_COLD]: 0,
    [NODE_TYPES.MOUNTAINS_SNOW]: 0,
    [NODE_TYPES.MOUNTAINS_DIRT]: 0,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 0,
    [NODE_TYPES.UNDERGROUND_CAVE]: 3,
    [NODE_TYPES.UNDERGROUND_WALL]: 16
  },
  produces: (creature, core = false) => {
    if (!core) {
      const random = utils.random(1, 1000);
      if (random <= 4) {
        creature.logging(
          `You found ${Nameable.getName("Ruby")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Ruby);
      } else if (random <= 8) {
        creature.logging(
          `You found ${Nameable.getName("Diamond")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Diamond);
      }
    }
    return Magnetite;
  },
  baseTime: 540
});
module.exports = global.Magnetite = Magnetite;
module.exports = global.MagnetiteVein = MagnetiteVein;
