const ExpirableItem = require("../../.expirable-item");

class TinArmor extends ExpirableItem {}
Object.assign(TinArmor.prototype, {
  expiresIn: 60 * DAYS,
  expiresIntegrity: true
});

module.exports = global.TinArmor = TinArmor;
