const server = require("../singletons/server");
const mailer = require("../singletons/mailer");
const Entity = require("./.entity");

const used = {};

class Region extends Entity {
  constructor(args) {
    super({});
    this.nodes = args;
    this.nodes.forEach(node => {
      node.setRegion(this);
    });
    this.allowedResources = null;
  }

  getAllowedResources() {
    return this.allowedResources;
  }

  getNodes() {
    return this.nodes;
  }

  hasNameSubmission() {
    return !!this.nameSubmission;
  }

  hasName() {
    return !!this.regionName;
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(n => n !== node);
    node.setRegion(null);
    if (!this.nodes.length) {
      this.destroy();
    }
  }

  addNode(node) {
    this.nodes.push(node);
    node.setRegion(this);
  }

  getName(creature) {
    if (this.regionNameOverride) {
      return this.regionNameOverride;
    }
    if (program.dev || creature instanceof Admin) {
      return (this.regionName || "") + `(${this.threatLevel})`;
    }
    return this.regionName;
  }

  removeResourceType(resourceName) {
    if (this.resources[resourceName]) {
      delete this.resources[resourceName];
    }
  }

  hasResourceType(resourceName) {
    this.resources = this.resources || {};
    return this.resources[resourceName];
  }

  addResourceType(resourceName) {
    this.resources = this.resources || {};
    this.resources[resourceName] = true;
  }

  onNameChange(newName) {
    server.sendUpdateForEachConnection("regionNameUpdate", player => {
      const creature = player.getCreature();
      if (!creature) {
        return null;
      }
      return {
        regionName: newName,
        nodeIds: this.getNodes()
          .filter(node => creature.isNodeKnown(node))
          .map(node => node.id)
      };
    });
    utils.log("Updated region name", this.id, newName);
  }

  destroy() {
    this.nodes.forEach(node => {
      if (node.getRegion() === this) {
        node.setRegion(null);
      }
    });
    super.destroy();
  }

  getNPCTownNode() {
    return this.getNodes()
      .filter(node => LeanTo.prototype.placement.includes(node.getType()))
      .reduce((acc, node) => (!acc || node.id < acc.id ? node : acc), null);
  }

  modifyThreatLevel(by) {
    if (this.threatLevel === -Infinity) {
      return;
    }
    this.threatLevel += by;
    this.threatLevel = utils.limit(this.threatLevel, 0, 100);
  }
}
Object.assign(Region.prototype, {});
module.exports = global.Region = Region;

Nameable.byVoting({
  className: "Region",
  property: "regionName",
  validation: {
    maxLength: 22
  },
  condition: (creature, region) =>
    !region.regionNameOverride && creature.updateCanNameRegion(region)
});

server.registerHandler("set-region-name", (params, player) => {
  const creature = player.getCreature();
  if (creature.noControlCheck()) {
    return;
  }
  const node = Entity.getById(params.nodeId);
  const region = node.getRegion();
  return Nameable.castVote(creature, region, params.name);
});

server.registerHandler("get-region-name-preferences", (params, player) => {
  const creature = player.getCreature();
  const node = Entity.getById(params.nodeId);
  const region = node.getRegion();
  return {
    ...Nameable.getVotes(creature, region),
    nodeIds: region.getNodes().map(node => node.getEntityId())
  };
});
