const Base_Treasury = require("../base/treasury");

class Tier1_Treasury extends Base_Treasury {}
Object.assign(Tier1_Treasury.prototype, {
  monstersTable: {
    10: {
      Lurker: "0:1"
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
  lootTable: Base_Treasury.getLootTable(1)
});

module.exports = global.Tier1_Treasury = Tier1_Treasury;
