const Base_Garden = require("../base/garden");

class Tier3_Garden extends Base_Garden {}
Object.assign(Tier3_Garden.prototype, {
  monstersTable: {
    10: {
      Snake: "0:1-2"
    }
  },
  lootTable: {
    20: {
      SilverNettle: "4-10"
    },
    24: {
      Bladewort: "4-10"
    },
    28: {
      Bitterweed: "4-10"
    }
  }
});

module.exports = global.Tier3_Garden = Tier3_Garden;
