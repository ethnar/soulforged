const RegrowingResource = require("../.regrowing-resource");

class Trees extends RegrowingResource {
  constructor(args) {
    super(args);
    this.size = 3;
  }

  cycle(seconds) {
    super.cycle(seconds);

    if (TimeCheck.timesADay(4, seconds)) {
      this.dropTwigs();
    }
  }

  dropTwigs() {
    if (this.twigsRatio) {
      const range = 0.1;
      const node = this.getNode();

      node.removeResourceType("Twigs");
      node.addResource(
        new Twigs({
          size: Math.floor(
            this.twigsRatio * (1 - range) +
              utils.random(0, this.twigsRatio) * 2 * range
          )
        })
      );
    }
  }
}
Object.assign(Trees.prototype, {
  gatherActionLabel: "Chop",
  failMessageGenerator(entity, creature) {
    if (utils.chance(20)) {
      return `The ${entity
        .getProduce(creature, true)
        .getName()} you chopped down turned out to be hollow.`;
    }
    return `The ${entity
      .getProduce(creature, true)
      .getName()} you chopped down turned out to be rotten.`;
  }
});

module.exports = global.Trees = Trees;
