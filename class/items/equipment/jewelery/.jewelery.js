const ExpirableItem = require("../../.expirable-item");

class Jewelery extends ExpirableItem {}
Object.assign(Jewelery.prototype, {
  nameable: true,
  order: ITEMS_ORDER.JEWELERY,
  expiresIn: 300 * DAYS,
  weight: 0.05,
  expiresIntegrity: true
});

module.exports = global.Jewelery = Jewelery;
