const ExpirableItem = require("../../.expirable-item");

class IronArmor extends ExpirableItem {}
Object.assign(IronArmor.prototype, {
  expiresIn: 200 * DAYS,
  expiresIntegrity: true
});

module.exports = global.IronArmor = IronArmor;
