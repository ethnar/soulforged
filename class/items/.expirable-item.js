const Item = require("./.item");
require("../structures/buildings/kiln");

const registry = {};

class ExpirableItem extends Item {
  constructor(...args) {
    super(...args);

    if (!this.expiresIn) {
      throw new Error(
        `Expirable item that doesn't have expiry time: ${this.constructor.name}`
      );
    }

    registry[this.getEntityId()] = this;
  }

  cycle(seconds) {
    this.expiring = this.expiring || -1;
    if (this.expiring !== Infinity) {
      this.expiring -= seconds;
      const oldIntegrity = this.integrity;
      this.integrity = Math.max(
        0,
        100 - (100 * Math.abs(this.expiring)) / this.expiresIn
      );
      if (Math.abs(this.expiring) >= this.expiresIn) {
        this.expire();
        return;
      }
      if (this.getContainer()) {
        if (
          Math.floor(oldIntegrity) !== Math.floor(this.integrity) &&
          this.getContainer().reStackItems
        ) {
          this.getContainer().reStackItems();
        }
      } else {
        utils.log(
          "Expirable item without container",
          this.constructor.name,
          this.getEntityId(),
          JSON.stringify(this)
        );
      }
    }
  }

  expire(leavesContainer = true) {
    if (this.expiresIntegrity) {
      this.expired = true;
      this.integrity = 0;
      delete registry[this.getEntityId()];
      this.markInvalidForUse();
      return;
    }

    if (this.expiresInto) {
      Object.keys(this.expiresInto).forEach(itemClass => {
        this.getContainer().addItemByType(
          global[itemClass],
          this.expiresInto[itemClass] * this.qty
        );
      });
    }
    this.destroy(leavesContainer);
  }

  reduceIntegrity(value) {
    this.modifyIntegrity(-value);
  }

  modifyIntegrity(mod) {
    this.expiring = this.expiring || -1;
    this.expiring += (mod * this.expiresIn) / 100;
    this.expiring = utils.limit(this.expiring, -this.expiresIn, -1);
  }

  split(qty) {
    const result = super.split(qty);
    result.expiring = this.expiring;
    return result;
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    const brackets = this.getIntegrityPayload();

    result.expiresIn = brackets.map(value =>
      Math.abs((this.expiresIn * value) / 100 / MINUTES)
    );
    return result;
  }

  destroy(...args) {
    delete registry[this.getEntityId()];
    super.destroy(...args);
  }

  static cycle(seconds) {
    Object.values(registry).forEach(item => {
      if (!item.entityDestroyed) {
        item.cycle(seconds);
      }
    });
  }
}

utils.prepareRegistry(registry, ExpirableItem);

module.exports = global.ExpirableItem = ExpirableItem;
