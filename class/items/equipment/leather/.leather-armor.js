const ExpirableItem = require("../../.expirable-item");

class LeatherArmor extends ExpirableItem {}
Object.assign(LeatherArmor.prototype, {
  expiresIn: 100 * DAYS,
  expiresIntegrity: true
});

module.exports = global.LeatherArmor = LeatherArmor;
