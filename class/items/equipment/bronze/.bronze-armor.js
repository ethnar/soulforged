const ExpirableItem = require("../../.expirable-item");

class BronzeArmor extends ExpirableItem {}
Object.assign(BronzeArmor.prototype, {
  expiresIn: 180 * DAYS,
  expiresIntegrity: true
});

module.exports = global.BronzeArmor = BronzeArmor;
