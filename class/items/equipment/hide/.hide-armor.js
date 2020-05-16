const ExpirableItem = require("../../.expirable-item");

class HideArmor extends ExpirableItem {}
Object.assign(HideArmor.prototype, {
  expiresIn: 60 * DAYS,
  expiresIntegrity: true
});

module.exports = global.HideArmor = HideArmor;
