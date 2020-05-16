const Plant = require("../.plant");

class Herbs extends Plant {}
Object.assign(Herbs.prototype, {
  failMessageGenerator(entity, creature) {
    if (utils.chance(50)) {
      return `The ${entity
        .getProduce(creature, true)
        .getName()} you found didn't flourish yet.`;
    }
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you found was decaying already.`;
  }
});
module.exports = global.Herbs = Herbs;
