const Resource = require("../.resource");

class RegrowingResource extends Resource {
  cycle(seconds) {
    if (TimeCheck.atHour(4, seconds)) {
      this.regrow();
    }
  }

  regrow() {
    let newSize = this.getSize() * 1.03 + 0.2;
    const reduction = Math.max(newSize - this.getMaxSize(), 0);
    if (reduction) {
      newSize -= utils.random(1, reduction);
    }
    this.setSize(newSize);
  }

  useUpResource(reduction = 1) {
    this.size -= reduction;
  }
}
Object.assign(RegrowingResource.prototype, {});

module.exports = global.RegrowingResource = RegrowingResource;
