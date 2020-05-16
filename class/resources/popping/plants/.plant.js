const PoppingResource = require("../.popping-resource");

class Plant extends PoppingResource {}
Object.assign(Plant.prototype, {
  activeFor: 6 * HOURS,
  sizeRange: [25, 40],
  failMessageGenerator(entity, creature) {
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you found was rotten.`;
  }
});
module.exports = global.Plant = Plant;
