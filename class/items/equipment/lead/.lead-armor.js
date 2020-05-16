const ExpirableItem = require("../../.expirable-item");

class LeadArmor extends ExpirableItem {}
Object.assign(LeadArmor.prototype, {
  expiresIn: 100 * DAYS,
  expiresIntegrity: true
});

module.exports = global.LeadArmor = LeadArmor;
