const Base_Treasury = require("../base/treasury");

class Tier2_Treasury extends Base_Treasury {}
Object.assign(Tier2_Treasury.prototype, {
  monstersTable: {
    10: {
      Lurker: "0:2"
    },
    40: {
      Rat: "7-12",
      MoleRat: "1"
    },
    50: {
      Rat: "4-7",
      MoleRat: "2"
    },
    80: {
      CaveSpider: "2"
    },
    100: {
      Snake: "3-6:2-4"
    }
  },
  lootTable: Base_Treasury.getLootTable(2)
});

module.exports = global.Tier2_Treasury = Tier2_Treasury;
