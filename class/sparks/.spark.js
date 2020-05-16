const Entity = require("../.entity");

class Spark extends Entity {
  hasFeatureBadge() {}

  getMapData() {
    return {};
  }

  setCreature(creature) {
    this.creature = creature;
  }

  getCreature() {
    return this.creature;
  }

  control() {
    // doing nothing here
  }
}

module.exports = global.Spark = Spark;
