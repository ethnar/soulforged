const QuakingResource = require("./.quaking-resource");
const Item = require("../../items/.item");

class Coal extends Item {}
Item.itemFactory(Coal, {
  name: "Coal",
  icon: `/${ICONS_PATH}/resources/quaking/st_b_08.png`,
  recipeName: "Make Charcoal",
  research: {
    sameAsCrafting: true
  },
  crafting: {
    materials: {
      Firewood: 40
    },
    skill: SKILLS.CRAFTING,
    building: ["Kiln"],
    baseTime: 500
  }
});

class CoalDeposit extends QuakingResource {}
Object.assign(CoalDeposit.prototype, {
  nameable: false,
  name: "Coal Deposit",
  skill: SKILLS.MINING,
  skillLevel: 1,
  toolUtility: TOOL_UTILS.MINING,
  produces: Coal,
  baseTime: 720,
  sizeRange: [40, 80],
  placement: {
    [NODE_TYPES.HILLS_GRASS]: 1,
    [NODE_TYPES.HILLS_COLD]: 1,
    [NODE_TYPES.HILLS_SNOW]: 1,
    [NODE_TYPES.HILLS_DIRT]: 1,
    [NODE_TYPES.HILLS_REDGRASS]: 3,
    [NODE_TYPES.MOUNTAINS_COLD]: 3,
    [NODE_TYPES.MOUNTAINS_SNOW]: 5,
    [NODE_TYPES.MOUNTAINS_DIRT]: 6,
    [NODE_TYPES.UNDERGROUND_FLOOR]: 20,
    [NODE_TYPES.UNDERGROUND_CAVE]: 25,
    [NODE_TYPES.UNDERGROUND_WALL]: 25
  }
});
module.exports = global.Coal = Coal;
module.exports = global.CoalDeposit = CoalDeposit;
