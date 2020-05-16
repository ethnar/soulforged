// construction stone
// chance for cassiterite & galena vein

const RockDeposit = require("./.rock-deposit");
const RockWall = require("./.rock-wall");
const Item = require("../../items/.item");

class Granite extends Item {}
Object.assign(Granite.prototype, {
  name: "Granite Boulder",
  icon: `/${ICONS_PATH}/resources/quaking/st_b_09_gray.png`,
  weight: 5
});

class GraniteDeposit extends RockDeposit {}
Object.assign(GraniteDeposit.prototype, {
  nameable: false,
  name: "Granite Deposit",
  skill: SKILLS.MINING,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [30, 40],
  wallTypeName: "GraniteWall",
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 5,
    [NODE_TYPES.HILLS_COLD]: 10,
    [NODE_TYPES.HILLS_SNOW]: 10,
    [NODE_TYPES.HILLS_DIRT]: 8,
    [NODE_TYPES.HILLS_REDGRASS]: 8,
    [NODE_TYPES.MOUNTAINS_COLD]: 40,
    [NODE_TYPES.MOUNTAINS_SNOW]: 50,
    [NODE_TYPES.MOUNTAINS_DIRT]: 20,
    // [NODE_TYPES.UNDERGROUND_FLOOR]: 25,
    [NODE_TYPES.UNDERGROUND_CAVE]: 8
  },
  produces: (creature, core = false, resource) => {
    if (!core) {
      const random = utils.random(1, 1000);
      const chanceMultiplier = 1;
      if (random <= 3 * chanceMultiplier) {
        creature.logging(`You struck a Cassiterite Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new CassiteriteVein());
      } else if (random <= 6 * chanceMultiplier) {
        creature.logging(`You struck a Galena Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new GalenaVein());
      }
    }
    return Granite;
  },
  baseTime: 20 * MINUTES
});

class GraniteWall extends RockWall {}
Object.assign(GraniteWall.prototype, {
  name: "Granite Wall",
  skill: SKILLS.MINING,
  icon: `/${ICONS_PATH}/resources/quaking/st_b_09_gray_zoom.png`,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [150, 200],
  placement: {},
  depositType: GraniteDeposit,
  produces: (creature, core = false, resource) => {
    if (!core) {
      const random = utils.random(1, 1000);
      const chanceMultiplier = 1;
      if (random <= 3 * chanceMultiplier) {
        creature.logging(`You struck a Cassiterite Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new CassiteriteVein());
      } else if (random <= 6 * chanceMultiplier) {
        creature.logging(`You struck a Galena Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new GalenaVein());
      }
    }
    return Granite;
  },
  baseTime: 20 * MINUTES
});

module.exports = global.Granite = Granite;
module.exports = global.GraniteWall = GraniteWall;
module.exports = global.GraniteDeposit = GraniteDeposit;
