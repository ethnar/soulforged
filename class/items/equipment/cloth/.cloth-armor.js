const ExpirableItem = require("../../.expirable-item");

class ClothArmor extends ExpirableItem {}
Object.assign(ClothArmor.prototype, {
  expiresIn: 40 * DAYS,
  expiresIntegrity: true
});

module.exports = global.ClothArmor = ClothArmor;
