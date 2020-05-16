const Base_Treasury = require("../base/treasury");

class TierSpecial_Treasury_Trial extends Base_Treasury {}
Object.assign(TierSpecial_Treasury_Trial.prototype, {
  lootTable: () => {
    const result = {};
    for (let i = 0; i < 4; i++) {
      const loot = Base_Treasury.getLootTable(4)();
      Object.keys(loot).forEach(itemType => {
        result[itemType] = (result[itemType] || 0) + loot[itemType];
      });
    }
    return result;
  }
});

module.exports = global.TierSpecial_Treasury_Trial = TierSpecial_Treasury_Trial;
