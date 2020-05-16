const Entity = require("../.entity");

class Connection extends Entity {
  constructor(args, nodeA, nodeB) {
    super(args);

    this.nodeAId = nodeA.getEntityId();
    this.nodeBId = nodeB.getEntityId();

    nodeA.addConnection(this);
    nodeB.addConnection(this);
  }

  destroy() {
    this.getFirstNode().removeConnection(this);
    this.getSecondNode().removeConnection(this);
    super.destroy();
  }

  getFirstNode() {
    return Entity.getById(this.nodeAId);
  }

  getSecondNode() {
    return Entity.getById(this.nodeBId);
  }

  hasNode(node) {
    return this.getFirstNode() === node || this.getSecondNode() === node;
  }

  getOtherNode(node) {
    return this.getFirstNode() !== node
      ? this.getFirstNode()
      : this.getSecondNode();
  }

  getDistance(creature) {
    const nodes = [this.getFirstNode(), this.getSecondNode()];
    return nodes.reduce((acc, node) => acc + node.getTravelTime(creature), 0);
  }

  getCurrentDistance(creature) {
    const nodes = [this.getFirstNode(), this.getSecondNode()];
    return nodes.reduce(
      (acc, node) => acc + node.getTravelTime(creature, true),
      0
    );
  }

  isInaccessible() {
    return this.inaccessible;
  }

  blocksVision() {
    return false;
  }
}
module.exports = global.Connection = Connection;
