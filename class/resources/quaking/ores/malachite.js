// ore of copper

const QuakingResource = require("../.quaking-resource");
const Item = require("../../../items/.item");

class Malachite extends Item {}
Item.itemFactory(Malachite, {
  dynamicName: () => Nameable.getName("MalachiteVein"),
  icon: `/${ICONS_PATH}/resources/quaking/ores/st_b_02_green.png`
});

class MalachiteVein extends QuakingResource {}
Entity.factory(MalachiteVein, {
  dynamicName: () => `${Nameable.getName("MalachiteVein")} Vein`,
  name: "Malachite",
  skill: SKILLS.MINING,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [100, 200],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 3,
    [NODE_TYPES.HILLS_COLD]: 3,
    [NODE_TYPES.HILLS_SNOW]: 4,
    [NODE_TYPES.HILLS_DIRT]: 2,
    [NODE_TYPES.HILLS_REDGRASS]: 2,
    [NODE_TYPES.MOUNTAINS_COLD]: 8,
    [NODE_TYPES.MOUNTAINS_SNOW]: 9,
    [NODE_TYPES.MOUNTAINS_DIRT]: 7,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 2,
    [NODE_TYPES.UNDERGROUND_CAVE]: 2,
    [NODE_TYPES.UNDERGROUND_WALL]: 5
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
    return Malachite;
  },
  baseTime: 540
});
module.exports = global.Malachite = Malachite;
module.exports = global.MalachiteVein = MalachiteVein;
