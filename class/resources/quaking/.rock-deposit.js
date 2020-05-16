const QuakingResources = require("./.quaking-resource");

class RockDeposit extends QuakingResources {
  setNode(node) {
    super.setNode(node);
    node.recalculateType();
  }
  destroy() {
    super.destroy();
    this.getNode().recalculateType();
  }
  reQuake() {
    if (!(this.getNode() instanceof Underground)) {
      super.reQuake();
    }
  }
  undergroundReshaping() {
    if (utils.chance(15)) {
      this.destroy();
      return;
    }
    const increase = Math.floor(
      (this.getMaxSize() * utils.random(15, 25)) / 100
    );
    const newSize = this.getSize() + increase;
    if (newSize > this.getMaxSize() * 2) {
      this.getNode().addResource(new global[this.wallTypeName]());
    } else {
      this.setSize(newSize);
    }
  }
}
Object.assign(RockDeposit.prototype, {
  gatherActionLabel: "Mine",
  failMessageGenerator(entity, creature) {
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you mined was no good and it crumbled.`;
  }
});

module.exports = global.RockDeposit = RockDeposit;
