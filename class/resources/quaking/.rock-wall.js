const QuakingResources = require("./.quaking-resource");

class RockWall extends QuakingResources {
  setNode(node) {
    super.setNode(node);
    node.removeResourceType("RockDeposit");
    node.recalculateType();
  }
  destroy() {
    super.destroy();
    this.getNode().addResource(new this.depositType());
    this.getNode().recalculateType();
  }
  reQuake() {}
  undergroundReshaping() {
    const reduce = Math.floor((this.getMaxSize() * utils.random(15, 25)) / 100);
    this.useUpResource(reduce);
  }
}
Object.assign(RockWall.prototype, {
  nameable: false,
  gatherActionLabel: "Mine",
  failMessageGenerator(entity, creature) {
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you mined was no good and it crumbled.`;
  }
});

module.exports = global.RockWall = RockWall;
