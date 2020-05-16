const ExpirableItem = require("../../.expirable-item");

class SteelArmor extends ExpirableItem {}
Object.assign(SteelArmor.prototype, {
  expiresIn: 300 * DAYS,
  expiresIntegrity: true
});

module.exports = global.SteelArmor = SteelArmor;
