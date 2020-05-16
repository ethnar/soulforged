const ExpirableItem = require("../../.expirable-item");

class CopperArmor extends ExpirableItem {}
Object.assign(CopperArmor.prototype, {
  expiresIn: 90 * DAYS,
  expiresIntegrity: true
});

module.exports = global.CopperArmor = CopperArmor;
