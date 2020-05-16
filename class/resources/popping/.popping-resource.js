const Resource = require("../.resource");

class PoppingResource extends Resource {
  constructor(args) {
    super(args);
    this.visible = false;
    this.showUpInSeconds = utils.random(1, global.RESOURCE_REROLL_FREQUENCY);
  }

  progressExpiration(rate = 1) {
    this.showUpInSeconds = (this.showUpInSeconds || 0) - rate;
  }

  stopExpiration() {
    this.showUpInSeconds = Infinity;
  }

  isVisible() {
    return this.visible;
  }

  cycle(seconds) {
    this.progressExpiration(seconds);
    if (this.showUpInSeconds <= 0) {
      this.visible = true;
    }
    if (this.showUpInSeconds < 0) {
      const visibleFor = Math.abs(this.showUpInSeconds);
      if (visibleFor >= this.activeFor) {
        this.destroy();
      }
    }
  }
}
Object.assign(PoppingResource.prototype, {
  activeFor: 1 * DAYS
});

module.exports = global.PoppingResource = PoppingResource;
