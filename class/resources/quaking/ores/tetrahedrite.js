// ore of copper, silver

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Tetrahedrite extends Item {}
Item.itemFactory(Tetrahedrite, {
  dynamicName: () => Nameable.getName("TetrahedriteVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/mtr_b_01.png`
});

class TetrahedriteVein extends QuakingResource {}
Entity.factory(TetrahedriteVein, {
  dynamicName: () => `${Nameable.getName("TetrahedriteVein")} Vein`,
  name: "Tetrahedrite",
  skill: SKILLS.MINING,
  skillLevel: 2,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [30, 45],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 0,
    [NODE_TYPES.HILLS_COLD]: 0,
    [NODE_TYPES.HILLS_SNOW]: 0,
    [NODE_TYPES.HILLS_DIRT]: 0,
    [NODE_TYPES.HILLS_REDGRASS]: 0,
    [NODE_TYPES.MOUNTAINS_COLD]: 0,
    [NODE_TYPES.MOUNTAINS_SNOW]: 0,
    [NODE_TYPES.MOUNTAINS_DIRT]: 0,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 4,
    [NODE_TYPES.UNDERGROUND_CAVE]: 4,
    [NODE_TYPES.UNDERGROUND_WALL]: 6
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
          `You found ${Nameable.getName("Diamond")} while mining!`,
          LOGGING.GOOD
        );
        creature.addItemByType(Diamond);
      }
    }
    return Tetrahedrite;
  },
  baseTime: 540
});
module.exports = global.Tetrahedrite = Tetrahedrite;
module.exports = global.TetrahedriteVein = TetrahedriteVein;
