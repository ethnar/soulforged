const Resource = require("../.resource");

class QuakingResources extends Resource {
  reQuake() {
    this.useUpResource(30 + utils.random(1, Math.floor(0.6 * this.getSize())));
  }
}
Object.assign(QuakingResources.prototype, {
  nameable: true,
  sizeRange: [400, 900],
  gatherActionLabel: "Mine",
  failMessageGenerator(entity, creature) {
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you mined was too impure.`;
  }
});

module.exports = global.QuakingResources = QuakingResources;
