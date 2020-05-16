const Item = require("../.item");

class IndestructibleItem extends Item {
  destroy() {
    if (!this.indestructible) {
      return super.destroy();
    }
  }

  getIntegrityPayload() {
    return null;
  }
}
Object.assign(IndestructibleItem.prototype, {
  nonResearchable: true,
  indestructible: true
});

module.exports = global.IndestructibleItem = IndestructibleItem;
