// construction stone, flux stone
// chance for malachite & galena vein

const RockDeposit = require("./.rock-deposit");
const Item = require("../../items/.item");

class Limestone extends Item {}
Object.assign(Limestone.prototype, {
  name: "Limestone Boulder",
  icon: `/${ICONS_PATH}/resources/quaking/st_b_09.png`,
  weight: 5
});

class LimestoneDeposit extends RockDeposit {}
Object.assign(LimestoneDeposit.prototype, {
  nameable: false,
  name: "Limestone Deposit",
  skill: SKILLS.MINING,
  skillLevel: 0,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [30, 40],
  wallTypeName: "LimestoneWall",
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 35,
    [NODE_TYPES.HILLS_COLD]: 40,
    [NODE_TYPES.HILLS_SNOW]: 40,
    [NODE_TYPES.HILLS_DIRT]: 30,
    [NODE_TYPES.HILLS_REDGRASS]: 30,
    [NODE_TYPES.MOUNTAINS_COLD]: 10,
    [NODE_TYPES.MOUNTAINS_SNOW]: 10,
    [NODE_TYPES.MOUNTAINS_DIRT]: 10,
    // [NODE_TYPES.UNDERGROUND_FLOOR]: 7,
    [NODE_TYPES.UNDERGROUND_CAVE]: 12
  },
  produces: (creature, core = false, resource) => {
    if (!core) {
      const random = utils.random(1, 1000);
      const chanceMultiplier = 1;
      if (random <= 3 * chanceMultiplier) {
        creature.logging(`You struck a Malachite Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new MalachiteVein());
      } else if (random <= 6 * chanceMultiplier) {
        creature.logging(`You struck a Galena Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new GalenaVein());
      }
    }
    return Limestone;
  },
  baseTime: 9 * MINUTES
});

class LimestoneWall extends RockWall {}
Object.assign(LimestoneWall.prototype, {
  name: "Limestone Wall",
  icon: `/${ICONS_PATH}/resources/quaking/st_b_09_zoom.png`,
  skill: SKILLS.MINING,
  skillLevel: 0,
  toolUtility: TOOL_UTILS.MINING,
  sizeRange: [150, 200],
  depositType: LimestoneDeposit,
  placement: {},
  produces: (creature, core = false, resource) => {
    if (!core) {
      const random = utils.random(1, 1000);
      const chanceMultiplier = 1;
      if (random <= 3 * chanceMultiplier) {
        creature.logging(`You struck a Malachite Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new MalachiteVein());
      } else if (random <= 6 * chanceMultiplier) {
        creature.logging(`You struck a Galena Vein!`, LOGGING.GOOD);
        resource.getNode().addResource(new GalenaVein());
      }
    }
    return Limestone;
  },
  baseTime: 9 * MINUTES
});

module.exports = global.Limestone = Limestone;
module.exports = global.LimestoneWall = LimestoneWall;
module.exports = global.LimestoneDeposit = LimestoneDeposit;
